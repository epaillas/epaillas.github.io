// Interactive wavelength coverage of spectroscopic and imaging surveys.
// Renders into <div id="survey-coverage"> on the survey-coverage page.
(function () {
  var root = document.getElementById("survey-coverage");
  if (!root) return;

  var NS = "http://www.w3.org/2000/svg";
  var L0 = 0.3,
    L1 = 5.5,
    X0 = 190,
    X1 = 650;

  // [name, [[lo, hi], ...] in micron, resolving power, optional dashed ranges]
  var spec = [
    ["HETDEX", [[0.35, 0.55]], "~800"],
    ["SDSS/BOSS", [[0.36, 1.04]], "~2000"],
    ["DESI", [[0.36, 0.98]], "2000–5500"],
    ["4MOST", [[0.37, 0.95]], "~6500"],
    ["Subaru PFS", [[0.38, 1.26]], "2300–5000"],
    ["VLT MOONS", [[0.64, 1.8]], "4000–9000"],
    ["Gaia BP/RP", [[0.33, 1.05]], "30–100"],
    ["Euclid NISP", [[1.206, 1.892]], "~450", [[0.926, 1.366]]],
    ["Roman grism", [[1.0, 1.93]], "~460"],
    ["Roman prism", [[0.75, 1.8]], "70–170"],
    [
      "SPHEREx",
      [
        [0.75, 3.82],
        [3.82, 5.0],
      ],
      "40–130",
    ],
  ];
  var phot = [
    [
      "SDSS",
      [
        [0.3, 0.4],
        [0.38, 0.55],
        [0.54, 0.7],
        [0.68, 0.84],
        [0.8, 1.08],
      ],
      "ugriz",
    ],
    [
      "DES",
      [
        [0.4, 0.55],
        [0.56, 0.71],
        [0.7, 0.86],
        [0.83, 1.0],
        [0.95, 1.06],
      ],
      "grizY",
    ],
    [
      "HSC",
      [
        [0.4, 0.55],
        [0.54, 0.7],
        [0.69, 0.85],
        [0.85, 0.93],
        [0.94, 1.07],
      ],
      "grizy",
    ],
    [
      "Rubin LSST",
      [
        [0.32, 0.4],
        [0.4, 0.55],
        [0.55, 0.69],
        [0.69, 0.82],
        [0.82, 0.92],
        [0.92, 1.08],
      ],
      "ugrizy",
    ],
    [
      "Euclid",
      [
        [0.55, 0.9],
        [0.95, 1.21],
        [1.17, 1.57],
        [1.52, 2.02],
      ],
      "VIS+YJH",
    ],
    [
      "Roman WFI",
      [
        [0.48, 0.76],
        [0.76, 0.98],
        [0.93, 1.19],
        [1.13, 1.45],
        [1.38, 1.77],
        [1.68, 2.0],
        [1.95, 2.3],
      ],
      "7 bands",
    ],
    [
      "VISTA VHS",
      [
        [1.17, 1.33],
        [1.49, 1.78],
        [1.99, 2.3],
      ],
      "JHKs",
    ],
    [
      "unWISE",
      [
        [2.75, 3.87],
        [4.0, 5.3],
      ],
      "W1 W2",
    ],
  ];
  // Official project pages, keyed by row name (spectroscopy and imaging rows
  // can share a name prefix but are looked up separately).
  var specUrls = {
    HETDEX: "https://hetdex.org/",
    "SDSS/BOSS": "https://www.sdss4.org/surveys/boss/",
    DESI: "https://www.desi.lbl.gov/",
    "4MOST": "https://www.4most.eu/",
    "Subaru PFS": "https://pfs.naoj.org/",
    "VLT MOONS": "https://vltmoons.org/",
    "Gaia BP/RP": "https://www.cosmos.esa.int/web/gaia",
    "Euclid NISP": "https://www.esa.int/Science_Exploration/Space_Science/Euclid",
    "Roman grism": "https://roman.gsfc.nasa.gov/",
    "Roman prism": "https://roman.gsfc.nasa.gov/",
    SPHEREx: "https://spherex.caltech.edu/",
  };
  var photUrls = {
    SDSS: "https://www.sdss.org/",
    DES: "https://www.darkenergysurvey.org/",
    HSC: "https://hsc.mtk.nao.ac.jp/ssp/",
    "Rubin LSST": "https://rubinobservatory.org/",
    Euclid: "https://www.esa.int/Science_Exploration/Space_Science/Euclid",
    "Roman WFI": "https://roman.gsfc.nasa.gov/",
    "VISTA VHS": "https://www.eso.org/public/teles-instr/paranal-observatory/surveytelescopes/vista/",
    unWISE: "https://unwise.me/",
  };

  // [label, rest wavelength (micron), kind, label tier]
  var feats = [
    ["Lyα", 0.1216, "line", 0],
    ["[OII]", 0.3727, "line", 1],
    ["4000Å", 0.4, "cont", 0],
    ["Hα", 0.6563, "line", 1],
    ["1.6µm bump", 1.6, "cont", 0],
  ];
  var regimes = [
    ["UV", 0.3, 0.38, "uv"],
    ["Optical", 0.38, 0.75, "opt"],
    ["Near-infrared  (J H K)", 0.75, 2.5, "nir"],
    ["Mid-infrared  (L M)", 2.5, 5.5, "mir"],
  ];

  function X(l) {
    return X0 + ((X1 - X0) * Math.log(l / L0)) / Math.log(L1 / L0);
  }

  // Vertical layout (SVG units)
  var SP_TOP = 46, // galaxy spectrum panel
    SP_BOT = 140,
    ROWS_TOP = 168, // first survey row
    ATM_H = 34; // atmosphere strip height
  var ATM_TOP = ROWS_TOP + (spec.length + 1 + phot.length) * 22 + 8,
    PLOT_BOT = ATM_TOP + ATM_H + 8; // x axis

  // ---------------------------------------------------------------------------
  // Illustrative galaxy spectra (rest frame, lambda F_lambda, arbitrary units).
  // Simple analytic toy models, not fits to real templates.
  // ---------------------------------------------------------------------------
  function bb(l, T) {
    // lambda * B_lambda, normalised to 1 at its peak (l in micron)
    var lp = 3670 / T;
    function f(x) {
      return Math.pow(x, -4) / (Math.exp(14388 / (x * T)) - 1);
    }
    return f(l) / f(lp);
  }
  function step(l, c, w) {
    return 1 / (1 + Math.exp(-(l - c) / w));
  }
  function lines(l, list) {
    var lg = Math.log10(l),
      m = 1;
    list.forEach(function (ln) {
      var d = (lg - Math.log10(ln[0])) / ln[2];
      m += ln[1] * Math.exp(-0.5 * d * d);
    });
    return m;
  }
  var N = 0.004, // display width of narrow lines (dex)
    B = 0.012; // broad lines
  var galaxies = {
    sf: {
      label: "Star-forming",
      f: function (l) {
        var c = bb(l, 15000) + 0.6 * bb(l, 4500) + 0.4 * bb(l, 300);
        c *= 0.8 + 0.2 * step(l, 0.4, 0.004);
        return (
          c *
          lines(l, [
            [0.1216, 6, N],
            [0.3727, 2, N],
            [0.4861, 1, N],
            [0.4959, 0.7, N],
            [0.5007, 2, N],
            [0.6563, 3, N],
            [0.6583, 0.8, N],
            [1.875, 0.6, N],
            [3.3, 0.5, 0.01],
          ])
        );
      },
    },
    q: {
      label: "Quiescent (LRG-like)",
      f: function (l) {
        var c = bb(l, 4000) + 0.02 * bb(l, 15000);
        c *= 0.35 + 0.65 * step(l, 0.4, 0.004);
        var lg = Math.log10(l / 1.6);
        return c * (1 + 0.12 * Math.exp(-0.5 * Math.pow(lg / 0.08, 2)));
      },
    },
    qso: {
      label: "Quasar",
      f: function (l) {
        var c = Math.pow(l / 0.3, -0.5) + 0.6 * bb(l, 1300) + 0.1 * bb(l, 4000);
        return (
          c *
          lines(l, [
            [0.1216, 4, B],
            [0.1549, 2, B],
            [0.1909, 0.8, B],
            [0.2798, 1, B],
            [0.4861, 0.8, B],
            [0.6563, 2, B],
          ])
        );
      },
    },
  };
  function observedSed(type, lobs, z) {
    var l = lobs / (1 + z),
      f = galaxies[type].f(l);
    if (l < 0.0912) f *= type === "qso" ? 0.3 : 0.05; // Lyman limit
    if (l < 0.1216) f *= Math.exp(-0.0036 * Math.pow(lobs / 0.1216, 3.46)); // Lyα forest (mean IGM)
    return f;
  }

  // Illustrative ground-based atmospheric transmission (Mauna Kea-like):
  // [start, end, depth] absorption bands in micron.
  var atmBands = [
    [0.686, 0.69, 0.5],
    [0.715, 0.735, 0.3],
    [0.758, 0.77, 0.8],
    [0.81, 0.84, 0.3],
    [0.89, 0.99, 0.6],
    [1.1, 1.17, 0.85],
    [1.33, 1.48, 1],
    [1.78, 1.97, 1],
    [2.0, 2.07, 0.4],
    [2.45, 2.95, 1],
    [2.95, 3.15, 0.6],
    [3.3, 3.35, 0.3],
    [4.18, 4.45, 1],
    [5.2, 6, 1],
  ];
  function atm(l) {
    var t = step(l, 0.34, 0.012); // ozone / Rayleigh UV cutoff
    atmBands.forEach(function (b) {
      var e = Math.min(0.01, (b[1] - b[0]) / 4);
      t *= 1 - b[2] * step(l, b[0], e) * (1 - step(l, b[1], e));
    });
    if (l > 4.45) t *= 0.75; // M-band thermal background and water
    return t;
  }
  function mk(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    if (text != null) e.textContent = text;
    return e;
  }
  // Row name, linked to the project's site when a URL is known.
  function nameLabel(name, cy, url) {
    var parent = svg;
    if (url) {
      parent = mk("a", { href: url, target: "_blank", rel: "noopener", class: "sc-link" });
      mk("title", {}, parent, name + " (opens official site)");
    }
    mk("text", { x: 8, y: cy, "dominant-baseline": "central", class: "sc-t" }, parent, name);
  }

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 680 " + (PLOT_BOT + 92));
  svg.setAttribute("width", "100%");
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    "Wavelength coverage of spectroscopic and imaging surveys from 0.3 to 5.5 microns, with a redshifted galaxy spectrum and atmospheric transmission"
  );
  // Layout: galaxy picker on top, chart with a vertical redshift slider on
  // its right, Hα/[OII] readout below.
  var controls = document.createElement("div");
  controls.className = "sc-controls";
  controls.innerHTML = '<label for="sc-gal">Galaxy</label><select id="sc-gal"></select>';
  root.appendChild(controls);
  var main = document.createElement("div");
  main.className = "sc-main";
  var chart = document.createElement("div");
  chart.className = "sc-chart";
  chart.appendChild(svg);
  main.appendChild(chart);
  var zcol = document.createElement("div");
  zcol.className = "sc-zcol";
  zcol.innerHTML =
    '<div class="sc-zsticky">' +
    '<label for="sc-z">Redshift</label>' +
    '<span class="sc-zout"></span>' +
    '<div class="sc-zbody">' +
    '<input type="range" id="sc-z" min="0" max="4" step="0.05" value="1" aria-orientation="vertical">' +
    '<div class="sc-zticks" aria-hidden="true"><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>' +
    "</div></div>";
  main.appendChild(zcol);
  root.appendChild(main);

  // Axis and grid
  [0.3, 0.4, 0.5, 0.7, 1, 1.5, 2, 3, 4, 5].forEach(function (t) {
    mk("line", { x1: X(t), y1: 42, x2: X(t), y2: PLOT_BOT, class: "sc-grid" });
    mk("text", { x: X(t), y: PLOT_BOT + 18, "text-anchor": "middle", class: "sc-ts" }, null, String(t));
  });
  [0.38, 0.75, 2.5].forEach(function (b) {
    mk("line", { x1: X(b), y1: 42, x2: X(b), y2: PLOT_BOT, class: "sc-boundary" });
  });
  mk("line", { x1: X0, y1: PLOT_BOT, x2: X1, y2: PLOT_BOT, class: "sc-axis" });

  // Regime strip, with a visible-light rainbow above the optical block
  var RG = PLOT_BOT + 32;
  for (var k = 0; k < 24; k++) {
    var a = 0.38 * Math.pow(0.75 / 0.38, k / 24);
    var b = 0.38 * Math.pow(0.75 / 0.38, (k + 1) / 24);
    mk("rect", {
      x: X(a),
      y: RG - 4,
      width: X(b) - X(a) + 0.4,
      height: 4,
      fill: "hsl(" + Math.round(275 - (275 * k) / 23) + ",75%,55%)",
    });
  }
  mk("text", { x: 8, y: RG + 11, "dominant-baseline": "central", class: "sc-th" }, null, "Regime");
  regimes.forEach(function (r) {
    var g = mk("g", { class: "sc-regime sc-" + r[3] });
    mk("rect", { x: X(r[1]) + 0.5, y: RG, width: X(r[2]) - X(r[1]) - 1, height: 22, rx: 3 }, g);
    mk("text", { x: (X(r[1]) + X(r[2])) / 2, y: RG + 11, "text-anchor": "middle", "dominant-baseline": "central" }, g, r[0]);
  });
  mk("text", { x: 420, y: RG + 46, "text-anchor": "middle", class: "sc-ts" }, null, "Observed wavelength (µm)");

  // Galaxy spectrum panel (path filled in by update())
  mk("text", { x: 8, y: SP_TOP + 34, class: "sc-th" }, null, "Galaxy");
  mk("text", { x: 8, y: SP_TOP + 52, class: "sc-th" }, null, "spectrum");
  mk("text", { x: 8, y: SP_TOP + 70, class: "sc-ts" }, null, "illustrative");
  mk("line", { x1: X0, y1: SP_BOT, x2: X1, y2: SP_BOT, class: "sc-grid" });
  var sedFill = mk("path", { class: "sc-sed-fill" });
  var sedLine = mk("path", { class: "sc-sed" });

  // Spectroscopic surveys
  mk("text", { x: 8, y: ROWS_TOP - 6, class: "sc-th" }, null, "Spectroscopy");
  mk("text", { x: 180, y: ROWS_TOP - 6, "text-anchor": "end", class: "sc-ts" }, null, "R");
  var y = ROWS_TOP;
  spec.forEach(function (s) {
    var cy = y + 11;
    nameLabel(s[0], cy, specUrls[s[0]]);
    mk("text", { x: 180, y: cy, "dominant-baseline": "central", "text-anchor": "end", class: "sc-ts" }, null, s[2]);
    (s[3] || []).forEach(function (r) {
      mk("rect", { x: X(r[0]), y: cy - 6, width: X(r[1]) - X(r[0]), height: 12, rx: 2, class: "sc-spec-dashed" });
    });
    s[1].forEach(function (r, i) {
      mk("rect", { x: X(r[0]), y: cy - 6, width: X(r[1]) - X(r[0]), height: 12, rx: 2, class: "sc-spec", opacity: i ? 0.95 : 0.7 });
    });
    y += 22;
  });

  // Imaging surveys
  y += 12;
  mk("text", { x: 8, y: y + 6, class: "sc-th" }, null, "Imaging");
  y += 10;
  phot.forEach(function (s) {
    var cy = y + 11;
    nameLabel(s[0], cy, photUrls[s[0]]);
    mk("text", { x: 180, y: cy, "dominant-baseline": "central", "text-anchor": "end", class: "sc-ts" }, null, s[2]);
    s[1].forEach(function (r, i) {
      mk("rect", {
        x: X(r[0]) + 0.5,
        y: cy - 6,
        width: Math.max(1, X(r[1]) - X(r[0]) - 1),
        height: 12,
        rx: 2,
        class: "sc-phot",
        opacity: i % 2 ? 0.95 : 0.6,
      });
    });
    y += 22;
  });

  // Atmospheric transmission strip (static)
  mk("text", { x: 8, y: ATM_TOP + 12, "dominant-baseline": "central", class: "sc-th" }, null, "Atmosphere");
  mk("text", { x: 8, y: ATM_TOP + 28, "dominant-baseline": "central", class: "sc-ts" }, null, "ground transmission");
  (function () {
    var d = "M" + X0 + " " + (ATM_TOP + ATM_H);
    for (var i = 0; i <= 600; i++) {
      var l = L0 * Math.pow(L1 / L0, i / 600);
      d += " L" + X(l).toFixed(1) + " " + (ATM_TOP + ATM_H * (1 - atm(l))).toFixed(1);
    }
    d += " L" + X1 + " " + (ATM_TOP + ATM_H) + " Z";
    mk("path", { d: d, class: "sc-atm" });
    mk("line", { x1: X0, y1: ATM_TOP + ATM_H, x2: X1, y2: ATM_TOP + ATM_H, class: "sc-grid" });
  })();

  // Redshifted features
  var fl = feats.map(function (f) {
    var g = mk("g", { class: "sc-feat sc-feat-" + f[2] });
    var ln = mk("line", { y1: 40, y2: PLOT_BOT }, g);
    var tx = mk("text", { y: f[3] ? 32 : 16, "text-anchor": "middle" }, g, f[0]);
    return { g: g, ln: ln, tx: tx, rest: f[1] };
  });

  // Readout
  var readout = document.createElement("div");
  readout.className = "sc-readout";
  readout.setAttribute("aria-live", "polite");
  root.appendChild(readout);

  var zs = zcol.querySelector("input");
  var zout = zcol.querySelector(".sc-zout");
  var gsel = controls.querySelector("select");
  Object.keys(galaxies).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k;
    o.textContent = galaxies[k].label;
    gsel.appendChild(o);
  });

  // Redraw the galaxy spectrum on a log flux scale, normalised to its
  // brightest point within the plotted range.
  function drawSed(type, z) {
    var n = 700,
      pts = [],
      fmax = 0;
    for (var i = 0; i <= n; i++) {
      var l = L0 * Math.pow(L1 / L0, i / n),
        f = observedSed(type, l, z);
      pts.push([X(l), f]);
      if (f > fmax) fmax = f;
    }
    var top = Math.log10(fmax) + 0.05,
      range = 2.3,
      h = SP_BOT - SP_TOP,
      d = "";
    pts.forEach(function (p, i) {
      var v = p[1] > 0 ? (top - Math.log10(p[1])) / range : 1;
      var yy = SP_TOP + h * Math.min(1, Math.max(0, v));
      d += (i ? " L" : "M") + p[0].toFixed(1) + " " + yy.toFixed(1);
    });
    sedLine.setAttribute("d", d);
    sedFill.setAttribute("d", d + " L" + X1 + " " + SP_BOT + " L" + X0 + " " + SP_BOT + " Z");
  }

  function covers(l) {
    return spec
      .filter(function (s) {
        return s[1].concat(s[3] || []).some(function (r) {
          return l >= r[0] && l <= r[1];
        });
      })
      .map(function (s) {
        return s[0];
      });
  }
  function regime(l) {
    for (var i = 0; i < regimes.length; i++) if (l < regimes[i][2]) return regimes[i][0].split("  ")[0].toLowerCase();
    return "mid-infrared";
  }
  function line(name, l) {
    var c = covers(l);
    return name + " at " + l.toFixed(2) + " µm (" + regime(l) + "): " + (c.length ? c.join(", ") : "no spectroscopic survey shown");
  }
  function update() {
    var z = +zs.value;
    zout.textContent = z.toFixed(2);
    drawSed(gsel.value, z);
    fl.forEach(function (f) {
      var l = f.rest * (1 + z),
        x = X(l),
        vis = l >= L0 && l <= L1;
      f.g.setAttribute("opacity", vis ? 1 : 0);
      if (vis) {
        f.ln.setAttribute("x1", x);
        f.ln.setAttribute("x2", x);
        f.tx.setAttribute("x", Math.min(Math.max(x, 30), 650));
      }
    });
    readout.textContent = "";
    [line("Hα", 0.6563 * (1 + z)), line("[OII]", 0.3727 * (1 + z))].forEach(function (t) {
      var p = document.createElement("div");
      p.textContent = t;
      readout.appendChild(p);
    });
  }
  zs.addEventListener("input", update);
  gsel.addEventListener("change", update);
  update();
})();
