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
  svg.setAttribute("viewBox", "0 0 680 600");
  svg.setAttribute("width", "100%");
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    "Wavelength coverage of spectroscopic and imaging surveys from 0.3 to 5.5 microns, with redshifted spectral features"
  );
  root.appendChild(svg);

  // Axis and grid
  [0.3, 0.4, 0.5, 0.7, 1, 1.5, 2, 3, 4, 5].forEach(function (t) {
    mk("line", { x1: X(t), y1: 42, x2: X(t), y2: 510, class: "sc-grid" });
    mk("text", { x: X(t), y: 528, "text-anchor": "middle", class: "sc-ts" }, null, String(t));
  });
  [0.38, 0.75, 2.5].forEach(function (b) {
    mk("line", { x1: X(b), y1: 42, x2: X(b), y2: 510, class: "sc-boundary" });
  });
  mk("line", { x1: X0, y1: 510, x2: X1, y2: 510, class: "sc-axis" });

  // Regime strip, with a visible-light rainbow above the optical block
  for (var k = 0; k < 24; k++) {
    var a = 0.38 * Math.pow(0.75 / 0.38, k / 24);
    var b = 0.38 * Math.pow(0.75 / 0.38, (k + 1) / 24);
    mk("rect", {
      x: X(a),
      y: 538,
      width: X(b) - X(a) + 0.4,
      height: 4,
      fill: "hsl(" + Math.round(275 - (275 * k) / 23) + ",75%,55%)",
    });
  }
  mk("text", { x: 8, y: 553, "dominant-baseline": "central", class: "sc-th" }, null, "Regime");
  regimes.forEach(function (r) {
    var g = mk("g", { class: "sc-regime sc-" + r[3] });
    mk("rect", { x: X(r[1]) + 0.5, y: 542, width: X(r[2]) - X(r[1]) - 1, height: 22, rx: 3 }, g);
    mk("text", { x: (X(r[1]) + X(r[2])) / 2, y: 553, "text-anchor": "middle", "dominant-baseline": "central" }, g, r[0]);
  });
  mk("text", { x: 420, y: 588, "text-anchor": "middle", class: "sc-ts" }, null, "Observed wavelength (µm)");

  // Spectroscopic surveys
  mk("text", { x: 8, y: 58, class: "sc-th" }, null, "Spectroscopy");
  mk("text", { x: 180, y: 58, "text-anchor": "end", class: "sc-ts" }, null, "R");
  var y = 64;
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

  // Redshifted features
  var fl = feats.map(function (f) {
    var g = mk("g", { class: "sc-feat sc-feat-" + f[2] });
    var ln = mk("line", { y1: 40, y2: 510 }, g);
    var tx = mk("text", { y: f[3] ? 32 : 16, "text-anchor": "middle" }, g, f[0]);
    return { g: g, ln: ln, tx: tx, rest: f[1] };
  });

  // Controls
  var controls = document.createElement("div");
  controls.className = "sc-controls";
  controls.innerHTML =
    '<label for="sc-z">Redshift</label>' + '<input type="range" id="sc-z" min="0" max="4" step="0.05" value="1">' + '<span class="sc-zout"></span>';
  root.appendChild(controls);
  var readout = document.createElement("div");
  readout.className = "sc-readout";
  readout.setAttribute("aria-live", "polite");
  root.appendChild(readout);

  var zs = controls.querySelector("input");
  var zout = controls.querySelector(".sc-zout");

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
    zout.textContent = "z = " + z.toFixed(2);
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
  update();
})();
