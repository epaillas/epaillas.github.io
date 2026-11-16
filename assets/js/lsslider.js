// Interactive galaxy power spectrum multipoles (FOLPS one-loop EFT model).
// Renders into <div id="lsslider" data-src="..."> on the lsslider page.
//
// Everything runs in the browser. The model is precomputed offline with
// desilike and stored as a small JSON file:
//   P_ell(k) = sum_t w_t(nuisance) * T_t(k; cosmology)
// where w_t are exact polynomial combinations of the bias, counterterm and
// stochastic parameters, and each template T_t is emulated as a polynomial
// in the cosmological parameters (and the FoG damping parameter), compressed
// with PCA.
(function () {
  var root = document.getElementById("lsslider");
  if (!root) return;

  var NS = "http://www.w3.org/2000/svg";
  var W = 620,
    PL = 70, // plot left
    PR = 12,
    PT = 10,
    PH = 150, // panel height
    GAP = 18,
    PB = 44;
  var COLORS = { 0: "#1d9e75", 2: "#d85a30", 4: "#7f77dd" };

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function h(tag, attrs, parent, text) {
    var e = document.createElement(tag);
    for (var a in attrs || {}) e.setAttribute(a, attrs[a]);
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function b64f32(s) {
    var bin = atob(s),
      n = bin.length,
      buf = new Uint8Array(n);
    for (var i = 0; i < n; i++) buf[i] = bin.charCodeAt(i);
    return new Float32Array(buf.buffer);
  }
  function fmt(v, step) {
    var d = Math.max(0, Math.min(5, Math.ceil(-Math.log10(step)) ));
    return v.toFixed(d).replace(/^-(0\.?0*)$/, "$1");
  }
  function niceTicks(lo, hi, n) {
    var span = hi - lo,
      raw = span / n,
      mag = Math.pow(10, Math.floor(Math.log10(raw))),
      r = raw / mag,
      st = (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * mag,
      out = [];
    for (var v = Math.ceil(lo / st) * st; v <= hi + 1e-9 * span; v += st) out.push(Math.abs(v) < 1e-9 * span ? 0 : v);
    return out;
  }

  root.textContent = "Loading model…";
  fetch(root.getAttribute("data-src"))
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(init)
    .catch(function (e) {
      root.textContent = "Could not load the model (" + e.message + ").";
    });

  function init(D) {
    root.textContent = "";
    var k = D.k,
      nk = k.length,
      ells = D.ells,
      nf = D.nf,
      npc = D.npc,
      nexp = D.exps.length,
      coef = b64f32(D.coef), // nexp x npc
      basis = b64f32(D.basis), // npc x nf
      mean = b64f32(D.mean); // nf
    var emuNames = D.emu_params; // order of emulator inputs
    var specs = {};
    D.params.forEach(function (p) {
      specs[p.name] = p;
    });
    var defaults = {};
    D.params.forEach(function (p) {
      defaults[p.name] = p.def;
    });

    // --- model evaluation ---------------------------------------------------
    var mono = new Float64Array(nexp),
      z = new Float64Array(npc),
      tmpl = new Float64Array(nf);
    function evaluate(v) {
      var u = emuNames.map(function (n) {
        var s = specs[n];
        return (2 * (v[n] - s.lo)) / (s.hi - s.lo) - 1;
      });
      for (var i = 0; i < nexp; i++) {
        var e = D.exps[i],
          m = 1;
        for (var j = 0; j < e.length; j++) if (e[j]) m *= Math.pow(u[j], e[j]);
        mono[i] = m;
      }
      for (var c = 0; c < npc; c++) {
        var s = 0;
        for (i = 0; i < nexp; i++) s += mono[i] * coef[i * npc + c];
        z[c] = s;
      }
      for (var f = 0; f < nf; f++) tmpl[f] = mean[f];
      for (c = 0; c < npc; c++) {
        var zc = z[c],
          off = c * nf;
        for (f = 0; f < nf; f++) tmpl[f] += zc * basis[off + f];
      }
      var nper = ells.length * nk,
        out = ells.map(function () {
          return new Float64Array(nk);
        });
      D.terms.forEach(function (term, t) {
        var w = 1;
        term.forEach(function (n) {
          w *= v[n];
        });
        if (w === 0) return;
        for (var l = 0; l < ells.length; l++)
          for (var q = 0; q < nk; q++) out[l][q] += w * k[q] * tmpl[t * nper + l * nk + q];
      });
      return out; // k * P_ell(k)
    }

    root.lsEvaluate = evaluate; // handy for checking against the Python model

    // --- fixed axis limits: envelope of one-at-a-time extremes ------------
    // (cosmology and linear bias only; extreme nuisance values may leave the panel)
    var lims = ells.map(function () {
      return [Infinity, -Infinity];
    });
    function grow(curves) {
      curves.forEach(function (c, l) {
        for (var q = 0; q < nk; q++) {
          if (c[q] < lims[l][0]) lims[l][0] = c[q];
          if (c[q] > lims[l][1]) lims[l][1] = c[q];
        }
      });
    }
    grow(evaluate(defaults));
    D.params.forEach(function (p) {
      if (D.limit_params.indexOf(p.name) < 0) return;
      [p.lo, p.hi].forEach(function (x) {
        var v = Object.assign({}, defaults);
        v[p.name] = x;
        grow(evaluate(v));
      });
    });
    lims.forEach(function (L) {
      var pad = 0.06 * (L[1] - L[0]);
      L[0] -= pad;
      L[1] += pad;
    });

    // --- layout -------------------------------------------------------------
    var main = h("div", { class: "ls-main" }, root);
    var chart = h("div", { class: "ls-chart" }, main);
    var side = h("div", { class: "ls-side" }, main);

    var H = PT + ells.length * PH + (ells.length - 1) * GAP + PB;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", role: "img", "aria-label": "Galaxy power spectrum multipoles" }, chart);
    var x0 = PL,
      x1 = W - PR,
      kmin = k[0],
      kmax = k[nk - 1];
    function X(kk) {
      return x0 + ((kk - kmin) / (kmax - kmin)) * (x1 - x0);
    }
    var panels = ells.map(function (ell, l) {
      var top = PT + l * (PH + GAP),
        bot = top + PH,
        L = lims[l];
      function Y(y) {
        return bot - ((y - L[0]) / (L[1] - L[0])) * PH;
      }
      var g = el("g", {}, svg);
      var cid = "ls-clip-" + l;
      var cp = el("clipPath", { id: cid }, el("defs", {}, g));
      el("rect", { x: x0, y: top, width: x1 - x0, height: PH }, cp);
      niceTicks(L[0], L[1], 4).forEach(function (t) {
        el("line", { class: "ls-grid", x1: x0, x2: x1, y1: Y(t), y2: Y(t) }, g);
        el("text", { class: "ls-tick", x: x0 - 6, y: Y(t) + 4, "text-anchor": "end" }, g).textContent = Math.round(t);
      });
      niceTicks(kmin, kmax, 4).forEach(function (t) {
        el("line", { class: "ls-grid", x1: X(t), x2: X(t), y1: top, y2: bot }, g);
        if (l === ells.length - 1)
          el("text", { class: "ls-tick", x: X(t), y: bot + 16, "text-anchor": "middle" }, g).textContent = t.toFixed(2);
      });
      el("rect", { class: "ls-frame", x: x0, y: top, width: x1 - x0, height: PH }, g);
      if (L[0] < 0 && L[1] > 0) el("line", { class: "ls-zero", x1: x0, x2: x1, y1: Y(0), y2: Y(0) }, g);
      var lab = el("text", { class: "ls-ylab", x: 16, y: (top + bot) / 2, "text-anchor": "middle", transform: "rotate(-90 16 " + (top + bot) / 2 + ")" }, g);
      lab.textContent = "k P";
      el("tspan", { "baseline-shift": "sub", "font-size": "10" }, lab).textContent = String(ell);
      var labRest = el("tspan", {}, lab);
      labRest.textContent = "(k)";
      var ref = el("path", { class: "ls-ref", "clip-path": "url(#" + cid + ")" }, g);
      var cur = el("path", { class: "ls-cur", stroke: COLORS[ell] || "#888", "clip-path": "url(#" + cid + ")" }, g);
      var tag = el("text", { class: "ls-tag", x: x1 - 8, y: top + 18, "text-anchor": "end", fill: COLORS[ell] || "#888" }, g);
      tag.textContent = ["monopole", "", "quadrupole", "", "hexadecapole"][ell] || "ℓ = " + ell;
      return { Y: Y, ref: ref, cur: cur };
    });
    el("text", { class: "ls-xlab", x: (x0 + x1) / 2, y: H - 6, "text-anchor": "middle" }, svg).textContent = "k  [h Mpc⁻¹]";

    function path(c, Y) {
      var d = "";
      for (var q = 0; q < nk; q++) d += (q ? "L" : "M") + X(k[q]).toFixed(1) + " " + Y(c[q]).toFixed(1);
      return d;
    }

    var legend = h("div", { class: "ls-legend" }, chart);
    legend.innerHTML =
      '<span><svg width="22" height="8"><line x1="0" x2="22" y1="4" y2="4" class="ls-cur" stroke="currentColor"/></svg> current parameters</span>' +
      '<span><svg width="22" height="8"><line x1="0" x2="22" y1="4" y2="4" class="ls-ref"/></svg> fiducial</span>' +
      "<span>" + D.setup + "</span>";

    // --- sliders ------------------------------------------------------------
    var values = Object.assign({}, defaults),
      inputs = {},
      outs = {};
    var tabs = h("div", { class: "ls-tabs", role: "tablist" }, side);
    var groupsBox = h("div", { class: "ls-groups" }, side);
    var groupEls = [],
      tabEls = [];
    D.groups.forEach(function (g, gi) {
      var tab = h("button", { type: "button", role: "tab", class: "ls-tab" }, tabs, g.label);
      var box = h("div", { class: "ls-group", role: "tabpanel" }, groupsBox);
      if (g.note) h("p", { class: "ls-gnote" }, box, g.note);
      g.params.forEach(function (name) {
        var p = specs[name];
        var row = h("label", { class: "ls-row" }, box);
        var head = h("span", { class: "ls-rowhead" }, row);
        var nm = h("span", { class: "ls-name" }, head);
        nm.innerHTML = p.label;
        if (p.help) nm.title = p.help;
        outs[name] = h("span", { class: "ls-val" }, head, fmt(p.def, p.step));
        var inp = h("input", { type: "range", min: p.lo, max: p.hi, step: p.step, value: p.def }, row);
        inp.addEventListener("input", function () {
          values[name] = parseFloat(inp.value);
          outs[name].textContent = fmt(values[name], p.step);
          schedule();
        });
        inp.addEventListener("dblclick", function () {
          inp.value = p.def;
          values[name] = p.def;
          outs[name].textContent = fmt(p.def, p.step);
          schedule();
        });
        inputs[name] = inp;
      });
      tab.addEventListener("click", function () {
        select(gi);
      });
      groupEls.push(box);
      tabEls.push(tab);
    });
    function select(gi) {
      groupEls.forEach(function (b, i) {
        b.hidden = i !== gi;
        tabEls[i].setAttribute("aria-selected", i === gi ? "true" : "false");
      });
    }
    select(0);

    var actions = h("div", { class: "ls-actions" }, side);
    var reset = h("button", { type: "button", class: "ls-reset" }, actions, "Reset all");
    h("span", { class: "ls-hint" }, actions, "Double-click a slider to reset it.");
    reset.addEventListener("click", function () {
      D.params.forEach(function (p) {
        inputs[p.name].value = p.def;
        values[p.name] = p.def;
        outs[p.name].textContent = fmt(p.def, p.step);
      });
      schedule();
    });

    // --- draw ---------------------------------------------------------------
    var fid = evaluate(defaults);
    panels.forEach(function (P, l) {
      P.ref.setAttribute("d", path(fid[l], P.Y));
    });
    var pending = false;
    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        draw();
      });
    }
    function draw() {
      var c = evaluate(values);
      panels.forEach(function (P, l) {
        P.cur.setAttribute("d", path(c[l], P.Y));
      });
    }
    draw();
  }
})();
