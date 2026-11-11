// Interactive coverage of astronomical surveys across the spectrum.
// Renders into <div id="survey-coverage"> on the survey-coverage page.
//
// Each "view" (optical/IR, UV, X-ray, radio, microwave) has its own axis
// (in its natural unit), survey rows, redshifted features, illustrative
// spectra and ground-based atmospheric transmission.
(function () {
  var root = document.getElementById("survey-coverage");
  if (!root) return;

  var NS = "http://www.w3.org/2000/svg";
  var X0 = 190,
    X1 = 650,
    SP_TOP = 46, // spectrum panel
    SP_BOT = 140,
    ROWS_TOP = 168, // first survey row
    ATM_H = 34; // atmosphere strip height

  // ---------------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------------
  function step(x, c, w) {
    return 1 / (1 + Math.exp(-(x - c) / w));
  }
  function bb(l, T) {
    // lambda * B_lambda (l in micron), normalised to 1 at its peak
    var lp = 3670 / T;
    function f(x) {
      return Math.pow(x, -4) / (Math.exp(14388 / (x * T)) - 1);
    }
    return f(l) / f(lp);
  }
  function lines(x, list) {
    // multiplicative Gaussian lines in log(x): [centre, amplitude, width (dex)]
    var lg = Math.log10(x),
      m = 1;
    list.forEach(function (ln) {
      var d = (lg - Math.log10(ln[0])) / ln[2];
      m += ln[1] * Math.exp(-0.5 * d * d);
    });
    return m;
  }
  function absorb(x, bands, t) {
    // multiply transmission t by smooth-edged absorption bands [start, end, depth]
    bands.forEach(function (b) {
      var e = Math.min(0.01 * b[0], (b[1] - b[0]) / 4);
      t *= 1 - b[2] * step(x, b[0], e) * (1 - step(x, b[1], e));
    });
    return t;
  }
  function row(name, ranges, info, url, extra) {
    var r = { n: name, r: ranges, i: info || "", u: url || "" };
    for (var k in extra || {}) r[k] = extra[k];
    return r;
  }
  var PLANNED = { p: true };

  // ---------------------------------------------------------------------------
  // Optical / IR / UV galaxy models (rest frame, lambda F_lambda, micron).
  // Simple analytic toy models, not fits to real templates.
  // ---------------------------------------------------------------------------
  var N = 0.004, // display width of narrow lines (dex)
    B = 0.012; // broad lines
  var galaxies = {
    sf: {
      label: "Star-forming galaxy",
      f: function (l) {
        var c = bb(l, 15000) + 0.6 * bb(l, 4500) + 0.4 * bb(l, 300);
        c *= 0.8 + 0.2 * step(l, 0.4, 0.004);
        return (
          c *
          lines(l, [
            [0.1216, 6, N],
            [0.1549, 0.4, N],
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
      label: "Quiescent galaxy (LRG-like)",
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
  function opticalSed(type, lobs, z) {
    var l = lobs / (1 + z),
      f = galaxies[type].f(l);
    if (l < 0.0912) f *= type === "qso" ? 0.3 : 0.05; // Lyman limit
    if (l < 0.1216) f *= Math.exp(-0.0036 * Math.pow(lobs / 0.1216, 3.46)); // Lyα forest (mean IGM)
    return f;
  }
  function galaxySpectra(scale) {
    // scale converts the view's unit to micron
    var out = {};
    Object.keys(galaxies).forEach(function (k) {
      out[k] = {
        label: galaxies[k].label,
        f: function (v, z) {
          return opticalSed(k, v * scale, z);
        },
      };
    });
    return out;
  }

  // Illustrative ground-based transmission, optical/IR (Mauna Kea-like), micron
  function atmOptical(l) {
    var t = step(l, 0.34, 0.012); // ozone / Rayleigh UV cutoff
    t = absorb(
      l,
      [
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
      ],
      t
    );
    if (l > 4.45) t *= 0.75; // M-band thermal background and water
    return t;
  }
  // Illustrative mm/submm transmission (Atacama-like), GHz
  function atmMm(v) {
    var t = Math.exp(-v / 900); // water-vapour continuum
    return absorb(
      v,
      [
        [50, 70, 1],
        [116, 120, 0.7],
        [178, 189, 1],
        [318, 328, 0.9],
        [365, 390, 0.9],
        [440, 455, 0.8],
        [530, 590, 1],
        [740, 765, 0.9],
        [960, 1000, 0.9],
      ],
      t
    );
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------
  var VIEWS = [
    {
      key: "opt",
      label: "Optical and infrared",
      axis: "Observed wavelength (µm)",
      unit: "µm",
      dec: 2,
      v0: 0.3,
      v1: 5.5,
      dir: 1,
      toUm: 1,
      ticks: [0.3, 0.4, 0.5, 0.7, 1, 1.5, 2, 3, 4, 5],
      zMax: 4,
      zStep: 0.05,
      z: 1,
      boundaries: [0.38, 0.75, 2.5],
      regimes: [
        ["UV", 0.3, 0.38, "uv"],
        ["Optical", 0.38, 0.75, "opt"],
        ["Near-infrared  (J H K)", 0.75, 2.5, "nir"],
        ["Mid-infrared  (L M)", 2.5, 5.5, "mir"],
      ],
      sections: [
        {
          title: "Spectroscopy",
          info: "R",
          style: "bar",
          readout: true,
          rows: [
            row("HETDEX", [[0.35, 0.55]], "~800", "https://hetdex.org/"),
            row("SDSS/BOSS", [[0.36, 1.04]], "~2000", "https://www.sdss4.org/surveys/boss/"),
            row("DESI", [[0.36, 0.98]], "2000–5500", "https://www.desi.lbl.gov/"),
            row("4MOST", [[0.37, 0.95]], "~6500", "https://www.4most.eu/"),
            row("Subaru PFS", [[0.38, 1.26]], "2300–5000", "https://pfs.naoj.org/"),
            row("VLT MOONS", [[0.64, 1.8]], "4000–9000", "https://vltmoons.org/"),
            row("Gaia BP/RP", [[0.33, 1.05]], "30–100", "https://www.cosmos.esa.int/web/gaia"),
            row("Euclid NISP", [[1.206, 1.892]], "~450", "https://www.esa.int/Science_Exploration/Space_Science/Euclid", {
              d: [[0.926, 1.366]],
            }),
            row("Roman grism", [[1.0, 1.93]], "~460", "https://roman.gsfc.nasa.gov/"),
            row("Roman prism", [[0.75, 1.8]], "70–170", "https://roman.gsfc.nasa.gov/"),
            row(
              "SPHEREx",
              [
                [0.75, 3.82],
                [3.82, 5.0],
              ],
              "40–130",
              "https://spherex.caltech.edu/"
            ),
          ],
        },
        {
          title: "Imaging",
          info: "",
          style: "blocks",
          rows: [
            row(
              "SDSS",
              [
                [0.3, 0.4],
                [0.38, 0.55],
                [0.54, 0.7],
                [0.68, 0.84],
                [0.8, 1.08],
              ],
              "ugriz",
              "https://www.sdss.org/"
            ),
            row(
              "DES",
              [
                [0.4, 0.55],
                [0.56, 0.71],
                [0.7, 0.86],
                [0.83, 1.0],
                [0.95, 1.06],
              ],
              "grizY",
              "https://www.darkenergysurvey.org/"
            ),
            row(
              "HSC",
              [
                [0.4, 0.55],
                [0.54, 0.7],
                [0.69, 0.85],
                [0.85, 0.93],
                [0.94, 1.07],
              ],
              "grizy",
              "https://hsc.mtk.nao.ac.jp/ssp/"
            ),
            row(
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
              "https://rubinobservatory.org/"
            ),
            row(
              "Euclid",
              [
                [0.55, 0.9],
                [0.95, 1.21],
                [1.17, 1.57],
                [1.52, 2.02],
              ],
              "VIS+YJH",
              "https://www.esa.int/Science_Exploration/Space_Science/Euclid"
            ),
            row(
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
              "https://roman.gsfc.nasa.gov/"
            ),
            row(
              "VISTA VHS",
              [
                [1.17, 1.33],
                [1.49, 1.78],
                [1.99, 2.3],
              ],
              "JHKs",
              "https://www.eso.org/public/teles-instr/paranal-observatory/surveytelescopes/vista/"
            ),
            row(
              "unWISE",
              [
                [2.75, 3.87],
                [4.0, 5.3],
              ],
              "W1 W2",
              "https://unwise.me/"
            ),
          ],
        },
      ],
      // [label, rest value, kind, label tier, fixed (does not redshift)]
      feats: [
        ["Lyα", 0.1216, "line", 0],
        ["[OII]", 0.3727, "line", 1],
        ["4000Å", 0.4, "cont", 0],
        ["Hα", 0.6563, "line", 1],
        ["1.6µm bump", 1.6, "cont", 0],
      ],
      readout: [
        ["Hα", 0.6563],
        ["[OII]", 0.3727],
      ],
      spectra: galaxySpectra(1),
      atm: atmOptical,
      atmNote: "ground transmission",
    },
    {
      key: "uv",
      label: "Ultraviolet",
      axis: "Observed wavelength (nm)",
      unit: "nm",
      dec: 0,
      v0: 90,
      v1: 450,
      dir: 1,
      toUm: 0.001,
      ticks: [100, 150, 200, 300, 400],
      zMax: 4,
      zStep: 0.05,
      z: 1,
      boundaries: [200, 380],
      regimes: [
        ["Far-UV", 90, 200, "uv"],
        ["Near-UV", 200, 380, "c6"],
        ["Optical", 380, 450, "opt"],
      ],
      sections: [
        {
          title: "Spectroscopy",
          info: "R",
          style: "bar",
          readout: true,
          rows: [
            row("HST/COS", [[90, 320]], "1.5k–20k", "https://www.stsci.edu/hst/instrumentation/cos"),
            row("UVEX", [[115, 265]], "> 1000", "https://www.uvex.caltech.edu/", PLANNED),
            row(
              "CSST slitless",
              [
                [255, 400],
                [400, 450],
              ],
              "~200",
              "",
              PLANNED
            ),
            row("Gaia BP/RP", [[330, 450]], "30–100", "https://www.cosmos.esa.int/web/gaia"),
            row("DESI", [[360, 450]], "2000–5500", "https://www.desi.lbl.gov/"),
          ],
        },
        {
          title: "Imaging",
          info: "",
          style: "blocks",
          rows: [
            row(
              "GALEX",
              [
                [134, 179],
                [177, 283],
              ],
              "FUV NUV",
              "https://www.galex.caltech.edu/"
            ),
            row(
              "UVEX",
              [
                [139, 190],
                [203, 270],
              ],
              "FUV NUV",
              "https://www.uvex.caltech.edu/",
              PLANNED
            ),
            row(
              "Swift UVOT",
              [
                [160, 226],
                [200, 250],
                [225, 295],
              ],
              "3 UV bands",
              "https://swift.gsfc.nasa.gov/"
            ),
            row(
              "CSST",
              [
                [255, 320],
                [320, 400],
              ],
              "NUV u",
              "",
              PLANNED
            ),
            row(
              "Rubin LSST",
              [
                [320, 400],
                [400, 450],
              ],
              "u g",
              "https://rubinobservatory.org/"
            ),
            row(
              "SDSS",
              [
                [300, 400],
                [380, 450],
              ],
              "u g",
              "https://www.sdss.org/"
            ),
          ],
        },
      ],
      feats: [
        ["Lyman limit", 91.2, "cont", 0],
        ["Lyα", 121.6, "line", 1],
        ["CIV", 154.9, "line", 0],
        ["MgII", 279.8, "line", 1],
        ["[OII]", 372.7, "line", 0],
      ],
      readout: [
        ["Lyα", 121.6],
        ["CIV", 154.9],
      ],
      spectra: galaxySpectra(0.001),
      atm: function (v) {
        return atmOptical(v / 1000);
      },
      atmNote: "ground transmission",
    },
    {
      key: "xray",
      label: "X-ray",
      axis: "Observed photon energy (keV)",
      unit: "keV",
      dec: 2,
      v0: 0.1,
      v1: 12,
      dir: -1,
      ticks: [0.1, 0.2, 0.5, 1, 2, 5, 10],
      zMax: 4,
      zStep: 0.05,
      z: 1,
      boundaries: [2],
      regimes: [
        ["Soft X-ray", 0.1, 2, "c5"],
        ["Hard X-ray", 2, 12, "c6"],
      ],
      sections: [
        {
          title: "Missions",
          info: "Mode",
          style: "bar",
          readout: true,
          rows: [
            row("eROSITA (eRASS)", [[0.2, 8]], "all-sky", "https://www.mpe.mpg.de/eROSITA"),
            row("ROSAT (RASS)", [[0.1, 2.4]], "all-sky", "https://www.mpe.mpg.de/ROSAT"),
            row("Einstein Probe", [[0.5, 4]], "wide-field", "https://ep.bao.ac.cn/"),
            row("XMM-Newton", [[0.2, 12]], "pointed", "https://www.cosmos.esa.int/web/xmm-newton"),
            row("Chandra", [[0.1, 10]], "pointed", "https://chandra.harvard.edu/"),
            row("XRISM", [[0.3, 12]], "pointed", "https://xrism.isas.jaxa.jp/en/"),
            row("NewAthena", [[0.2, 12]], "pointed", "https://www.cosmos.esa.int/web/athena", PLANNED),
          ],
        },
      ],
      feats: [
        ["O VII", 0.574, "line", 1],
        ["Fe Kα", 6.4, "line", 0],
      ],
      readout: [
        ["Fe Kα", 6.4],
        ["O VII", 0.574],
      ],
      spectra: {
        agn: {
          label: "AGN (unobscured)",
          f: function (E, z) {
            var Er = E * (1 + z);
            var c = Math.pow(Er, 0.1) * (1 + 0.6 * Math.exp(-Er / 0.3)); // Γ ≈ 1.9 plus soft excess
            return c * lines(Er, [[6.4, 0.8, 0.006]]) * Math.exp(-0.03 * Math.pow(E, -2.6));
          },
        },
        obsc: {
          label: "AGN (obscured)",
          f: function (E, z) {
            var Er = E * (1 + z);
            var c = Math.pow(Er, 0.1) * (Math.exp(-24 * Math.pow(Er, -2.6)) + 0.02); // N_H ~ 1e23 cm^-2 + scattered light
            return c * lines(Er, [[6.4, 3, 0.006]]) * Math.exp(-0.03 * Math.pow(E, -2.6));
          },
        },
        cluster: {
          label: "Galaxy cluster (kT = 5 keV)",
          f: function (E, z) {
            var Er = E * (1 + z);
            var c = Er * Math.exp(-Er / 5);
            return (
              c *
              lines(Er, [
                [1.0, 0.6, 0.03],
                [6.7, 1.5, 0.006],
              ]) *
              Math.exp(-0.03 * Math.pow(E, -2.6))
            );
          },
        },
      },
      atm: function () {
        return 0;
      },
      atmNote: "opaque: space only",
    },
    {
      key: "radio",
      label: "Radio (21 cm)",
      axis: "Observed frequency (MHz)",
      unit: "MHz",
      dec: 0,
      v0: 40,
      v1: 3000,
      dir: -1,
      ticks: [50, 100, 200, 500, 1000, 2000],
      zMax: 20,
      zStep: 0.1,
      z: 1,
      boundaries: [300],
      regimes: [
        ["VHF (metre waves)", 40, 300, "c5"],
        ["UHF (decimetre waves)", 300, 3000, "c6"],
      ],
      sections: [
        {
          title: "21 cm and EoR",
          info: "HI z",
          style: "bar",
          readout: true,
          rows: [
            row("CHIME", [[400, 800]], "0.8–2.5", "https://chime-experiment.ca/"),
            row("HIRAX", [[400, 800]], "0.8–2.5", "https://hirax.ukzn.ac.za/", PLANNED),
            row("CHORD", [[300, 1500]], "0–3.7", "https://www.chord-observatory.ca/", PLANNED),
            row("HERA", [[50, 250]], "4.7–27", "https://reionization.org/"),
            row(
              "LOFAR",
              [
                [40, 90],
                [110, 240],
              ],
              "5–34",
              "https://www.astron.nl/telescopes/lofar/"
            ),
            row("MWA", [[70, 300]], "3.7–19", "https://www.mwatelescope.org/"),
            row("SKA-Low", [[50, 350]], "3–27", "https://www.skao.int/", PLANNED),
          ],
        },
        {
          title: "HI and continuum",
          info: "HI z",
          style: "blocks",
          readout: true,
          rows: [
            row(
              "MeerKAT",
              [
                [544, 1088],
                [856, 1712],
                [1750, 3000],
              ],
              "0–1.6",
              "https://www.sarao.ac.za/"
            ),
            row("ASKAP", [[700, 1800]], "0–1.0", "https://www.csiro.au/en/about/facilities-collections/atnf/askap-radio-telescope"),
            row("FAST", [[1050, 1450]], "0–0.35", "https://fast.bao.ac.cn/"),
            row("VLA (VLASS)", [[2000, 3000]], "continuum", "https://science.nrao.edu/vlass"),
            row(
              "SKA-Mid",
              [
                [350, 1050],
                [950, 1760],
              ],
              "0–3",
              "https://www.skao.int/",
              PLANNED
            ),
          ],
        },
      ],
      feats: [["HI 21 cm", 1420.4, "line", 0]],
      readout: [["HI 21 cm", 1420.4]],
      spectra: {
        sfg: {
          label: "Star-forming galaxy",
          f: function (v, z) {
            var vr = v * (1 + z);
            var c = vr * (Math.pow(vr / 1400, -0.75) + 0.1 * Math.pow(vr / 1400, -0.1)); // synchrotron + free-free
            return c * lines(vr, [[1420.4, 3, 0.003]]);
          },
        },
      },
      atm: function (v) {
        return step(v, 15, 3); // ionosphere blocks below ~10 MHz
      },
      atmNote: "ground transmission",
    },
    {
      key: "mm",
      label: "Microwave (CMB)",
      axis: "Observed frequency (GHz)",
      unit: "GHz",
      dec: 0,
      v0: 20,
      v1: 1000,
      dir: -1,
      ticks: [20, 30, 50, 100, 200, 300, 500, 1000],
      zMax: 8,
      zStep: 0.05,
      z: 3,
      boundaries: [30, 300],
      regimes: [
        ["cm", 20, 30, "c6"],
        ["Millimetre", 30, 300, "c5"],
        ["Submillimetre", 300, 1000, "nir"],
      ],
      sections: [
        {
          title: "CMB experiments",
          info: "Bands",
          style: "blocks",
          rows: [
            row(
              "Planck",
              [
                [27, 33],
                [39.6, 48.4],
                [63, 77],
                [84, 116],
                [120, 166],
                [182, 252],
                [297, 409],
                [458, 632],
                [720, 994],
              ],
              "9",
              "https://www.cosmos.esa.int/web/planck"
            ),
            row(
              "ACT",
              [
                [77, 112],
                [124, 172],
                [182, 277],
              ],
              "3",
              "https://act.princeton.edu/"
            ),
            row(
              "SPT-3G",
              [
                [80, 110],
                [125, 170],
                [190, 260],
              ],
              "3",
              "https://pole.uchicago.edu/"
            ),
            row(
              "Simons Obs.",
              [
                [24, 30],
                [30, 48],
                [77, 106],
                [124, 166],
                [195, 260],
                [256, 310],
              ],
              "6",
              "https://simonsobservatory.org/"
            ),
            row("LiteBIRD", [[34, 448]], "15", "https://www.isas.jaxa.jp/en/missions/spacecraft/future/litebird.html", PLANNED),
          ],
        },
        {
          title: "Intensity mapping",
          info: "Line, z",
          style: "bar",
          readout: true,
          rows: [
            row("COMAP", [[26, 34]], "CO 2.4–3.4", "https://comap.caltech.edu/"),
            row("CONCERTO", [[125, 305]], "[CII] 5–14", "https://mission.lam.fr/concerto/"),
            row("FYST EoR-Spec", [[210, 420]], "[CII] 3.5–8", "https://www.ccatobservatory.org/", PLANNED),
          ],
        },
      ],
      feats: [
        ["CMB peak", 160.2, "cont", 1, true],
        ["tSZ null", 217, "cont", 0, true],
        ["CO(1–0)", 115.27, "line", 0],
        ["CO(2–1)", 230.54, "line", 1],
        ["[CII]", 1900.54, "line", 0],
      ],
      readout: [
        ["CO(1–0)", 115.27],
        ["[CII]", 1900.54],
      ],
      spectra: {
        dsfg: {
          label: "Dusty star-forming galaxy",
          f: function (v, z) {
            var vr = v * (1 + z),
              x = (0.04799 * vr) / 35; // T_dust = 35 K, beta = 1.8
            var c = Math.pow(vr / 1000, 5.8) / (Math.exp(x) - 1);
            var co = [];
            for (var J = 1; J <= 6; J++) co.push([115.27 * J, 0.6, N]);
            co.push([1900.54, 4, N]);
            return c * lines(vr, co);
          },
        },
        cmb: {
          label: "CMB blackbody (2.725 K)",
          f: function (v) {
            var x = (0.04799 * v) / 2.725;
            return Math.pow(v / 100, 4) / (Math.exp(x) - 1);
          },
        },
        tsz: {
          label: "Thermal SZ distortion |ΔI|",
          f: function (v) {
            var x = (0.04799 * v) / 2.725,
              ex = Math.exp(x);
            var g = ((Math.pow(x, 4) * ex) / Math.pow(ex - 1, 2)) * ((x * (ex + 1)) / (ex - 1) - 4);
            return Math.abs(x * g);
          },
        },
      },
      atm: atmMm,
      atmNote: "ground (Atacama-like)",
    },
  ];

  // ---------------------------------------------------------------------------
  // DOM: view and spectrum pickers on top, chart with a vertical redshift
  // slider on its right, line-coverage readout and notes below.
  // ---------------------------------------------------------------------------
  var controls = document.createElement("div");
  controls.className = "sc-controls";
  controls.innerHTML =
    '<label for="sc-view">View</label><select id="sc-view"></select>' + '<label for="sc-gal">Spectrum</label><select id="sc-gal"></select>';
  root.appendChild(controls);
  var main = document.createElement("div");
  main.className = "sc-main";
  var chart = document.createElement("div");
  chart.className = "sc-chart";
  main.appendChild(chart);
  var zcol = document.createElement("div");
  zcol.className = "sc-zcol";
  zcol.innerHTML =
    '<div class="sc-zsticky">' +
    '<label for="sc-z">Redshift</label>' +
    '<span class="sc-zout"></span>' +
    '<div class="sc-zbody">' +
    '<input type="range" id="sc-z" min="0" max="4" step="0.05" value="1" aria-orientation="vertical">' +
    '<div class="sc-zticks" aria-hidden="true"></div>' +
    "</div></div>";
  main.appendChild(zcol);
  root.appendChild(main);
  var readout = document.createElement("div");
  readout.className = "sc-readout";
  readout.setAttribute("aria-live", "polite");
  root.appendChild(readout);
  var note = document.createElement("div");
  note.className = "sc-note";
  root.appendChild(note);

  var vsel = controls.querySelector("#sc-view"),
    gsel = controls.querySelector("#sc-gal"),
    zs = zcol.querySelector("input"),
    zout = zcol.querySelector(".sc-zout"),
    zticks = zcol.querySelector(".sc-zticks");
  VIEWS.forEach(function (v, i) {
    var o = document.createElement("option");
    o.value = i;
    o.textContent = v.label;
    vsel.appendChild(o);
  });

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("role", "img");
  chart.appendChild(svg);

  function mk(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  var view, X, PLOT_BOT, fl, sedLine, sedFill;

  function fmt(v) {
    return String(+v.toPrecision(3));
  }
  function nameLabel(r, cy) {
    var parent = svg;
    if (r.u) {
      parent = mk("a", { href: r.u, target: "_blank", rel: "noopener", class: "sc-link" });
      mk("title", {}, parent, r.n + (r.p ? " (planned)" : "") + ": opens official site");
    }
    mk("text", { x: 8, y: cy, "dominant-baseline": "central", class: "sc-t" }, parent, r.n);
  }

  function render() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var v0 = view.v0,
      v1 = view.v1;
    X = function (v) {
      return X0 + ((X1 - X0) * Math.log(v / v0)) / Math.log(v1 / v0);
    };
    var nRows = 0;
    view.sections.forEach(function (s) {
      nRows += s.rows.length;
    });
    var ATM_TOP = ROWS_TOP + (nRows + view.sections.length - 1) * 22 + 8;
    PLOT_BOT = ATM_TOP + ATM_H + 8;
    var RG = PLOT_BOT + 32;
    svg.setAttribute("viewBox", "0 0 680 " + (RG + 58));
    svg.setAttribute("aria-label", view.label + " survey coverage with redshifted spectral features");

    // Grid, regime boundaries and axis
    view.ticks.forEach(function (t) {
      mk("line", { x1: X(t), y1: 42, x2: X(t), y2: PLOT_BOT, class: "sc-grid" });
      mk("text", { x: X(t), y: PLOT_BOT + 18, "text-anchor": "middle", class: "sc-ts" }, null, fmt(t));
    });
    view.boundaries.forEach(function (b) {
      mk("line", { x1: X(b), y1: 42, x2: X(b), y2: PLOT_BOT, class: "sc-boundary" });
    });
    mk("line", { x1: X0, y1: PLOT_BOT, x2: X1, y2: PLOT_BOT, class: "sc-axis" });

    // Regime strip, with a rainbow over any visible-light range
    if (view.toUm) {
      for (var k = 0; k < 24; k++) {
        var a = Math.max(v0, (0.38 * Math.pow(0.75 / 0.38, k / 24)) / view.toUm),
          b = Math.min(v1, (0.38 * Math.pow(0.75 / 0.38, (k + 1) / 24)) / view.toUm);
        if (b <= a) continue;
        mk("rect", {
          x: X(a),
          y: RG - 4,
          width: X(b) - X(a) + 0.4,
          height: 4,
          fill: "hsl(" + Math.round(275 - (275 * k) / 23) + ",75%,55%)",
        });
      }
    }
    mk("text", { x: 8, y: RG + 11, "dominant-baseline": "central", class: "sc-th" }, null, "Regime");
    view.regimes.forEach(function (r) {
      var g = mk("g", { class: "sc-regime sc-" + r[3] });
      mk("rect", { x: X(r[1]) + 0.5, y: RG, width: X(r[2]) - X(r[1]) - 1, height: 22, rx: 3 }, g);
      mk("text", { x: (X(r[1]) + X(r[2])) / 2, y: RG + 11, "text-anchor": "middle", "dominant-baseline": "central" }, g, r[0]);
    });
    mk("text", { x: 420, y: RG + 46, "text-anchor": "middle", class: "sc-ts" }, null, view.axis);

    // Spectrum panel (path filled in by update())
    mk("text", { x: 8, y: SP_TOP + 34, class: "sc-th" }, null, "Example");
    mk("text", { x: 8, y: SP_TOP + 52, class: "sc-th" }, null, "spectrum");
    mk("text", { x: 8, y: SP_TOP + 70, class: "sc-ts" }, null, "illustrative, νFν");
    mk("line", { x1: X0, y1: SP_BOT, x2: X1, y2: SP_BOT, class: "sc-grid" });
    sedFill = mk("path", { class: "sc-sed-fill" });
    sedLine = mk("path", { class: "sc-sed" });

    // Survey sections
    var y = ROWS_TOP;
    view.sections.forEach(function (sec, si) {
      if (si) y += 22;
      mk("text", { x: 8, y: y - 6, class: "sc-th" }, null, sec.title);
      mk("text", { x: 180, y: y - 6, "text-anchor": "end", class: "sc-ts" }, null, sec.info);
      sec.rows.forEach(function (r) {
        var cy = y + 11,
          bar = sec.style === "bar",
          cls = (bar ? "sc-spec" : "sc-phot") + (r.p ? " sc-planned" : "");
        nameLabel(r, cy);
        mk("text", { x: 180, y: cy, "dominant-baseline": "central", "text-anchor": "end", class: "sc-ts" }, null, r.i);
        (r.d || []).forEach(function (rg) {
          mk("rect", { x: X(rg[0]), y: cy - 6, width: X(rg[1]) - X(rg[0]), height: 12, rx: 2, class: "sc-spec-dashed" });
        });
        r.r.forEach(function (rg, i) {
          var a = Math.max(rg[0], v0),
            b = Math.min(rg[1], v1);
          if (b <= a) return;
          var gap = bar ? 0 : 0.5;
          mk("rect", {
            x: X(a) + gap,
            y: cy - 6,
            width: Math.max(1, X(b) - X(a) - 2 * gap),
            height: 12,
            rx: 2,
            class: cls,
            opacity: bar ? (i ? 0.95 : 0.7) : i % 2 ? 0.95 : 0.6,
          });
        });
        y += 22;
      });
    });

    // Atmospheric transmission strip (static)
    mk("text", { x: 8, y: ATM_TOP + 12, "dominant-baseline": "central", class: "sc-th" }, null, "Atmosphere");
    mk("text", { x: 8, y: ATM_TOP + 28, "dominant-baseline": "central", class: "sc-ts" }, null, view.atmNote);
    var d = "M" + X0 + " " + (ATM_TOP + ATM_H);
    for (var i = 0; i <= 600; i++) {
      var v = v0 * Math.pow(v1 / v0, i / 600);
      d += " L" + X(v).toFixed(1) + " " + (ATM_TOP + ATM_H * (1 - view.atm(v))).toFixed(1);
    }
    d += " L" + X1 + " " + (ATM_TOP + ATM_H) + " Z";
    mk("path", { d: d, class: "sc-atm" });
    mk("line", { x1: X0, y1: ATM_TOP + ATM_H, x2: X1, y2: ATM_TOP + ATM_H, class: "sc-grid" });

    // Redshifted (or fixed) spectral features
    fl = view.feats.map(function (f) {
      var g = mk("g", { class: "sc-feat sc-feat-" + f[2] });
      var ln = mk("line", { y1: 40, y2: PLOT_BOT }, g);
      var tx = mk("text", { y: f[3] ? 32 : 16, "text-anchor": "middle" }, g, f[0]);
      return { g: g, ln: ln, tx: tx, rest: f[1], fixed: !!f[4] };
    });

    // Controls that depend on the view
    gsel.innerHTML = "";
    Object.keys(view.spectra).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k;
      o.textContent = view.spectra[k].label;
      gsel.appendChild(o);
    });
    zs.max = view.zMax;
    zs.step = view.zStep;
    zs.value = view.z;
    zticks.innerHTML = "";
    for (var t = 4; t >= 0; t--) {
      var sp = document.createElement("span");
      sp.textContent = fmt((view.zMax * t) / 4);
      zticks.appendChild(sp);
    }
    var planned = view.sections.some(function (s) {
      return s.rows.some(function (r) {
        return r.p;
      });
    });
    note.textContent = planned ? "Faded, outlined bars are planned or under construction." : "";
  }

  // ---------------------------------------------------------------------------
  // Updates on slider / spectrum change
  // ---------------------------------------------------------------------------
  function observed(rest, z) {
    return rest * Math.pow(1 + z, view.dir);
  }
  function drawSed(z) {
    var f = view.spectra[gsel.value].f,
      n = 700,
      pts = [],
      fmax = 0;
    for (var i = 0; i <= n; i++) {
      var v = view.v0 * Math.pow(view.v1 / view.v0, i / n),
        y = f(v, z);
      if (!isFinite(y) || y < 0) y = 0;
      pts.push([X(v), y]);
      if (y > fmax) fmax = y;
    }
    var top = Math.log10(fmax) + 0.05,
      range = 2.3,
      h = SP_BOT - SP_TOP,
      d = "";
    pts.forEach(function (p, i) {
      var u = p[1] > 0 ? (top - Math.log10(p[1])) / range : 1;
      var yy = SP_TOP + h * Math.min(1, Math.max(0, u));
      d += (i ? " L" : "M") + p[0].toFixed(1) + " " + yy.toFixed(1);
    });
    sedLine.setAttribute("d", d);
    sedFill.setAttribute("d", d + " L" + X1 + " " + SP_BOT + " L" + X0 + " " + SP_BOT + " Z");
  }
  function covers(v) {
    var out = [];
    view.sections.forEach(function (s) {
      if (!s.readout) return;
      s.rows.forEach(function (r) {
        var name = r.n + (r.p ? " (planned)" : "");
        var hit = r.r.concat(r.d || []).some(function (rg) {
          return v >= rg[0] && v <= rg[1];
        });
        if (hit && out.indexOf(name) < 0) out.push(name);
      });
    });
    return out;
  }
  function regime(v) {
    for (var i = 0; i < view.regimes.length; i++) {
      var r = view.regimes[i];
      if (v >= r[1] && v < r[2]) return r[0].split(/  | \(/)[0];
    }
    return null;
  }
  function readoutLine(name, v) {
    var where = name + " at " + v.toFixed(view.dec) + " " + view.unit;
    if (v < view.v0 || v > view.v1) return where + ": outside this view";
    var c = covers(v),
      reg = regime(v);
    return where + (reg ? " (" + reg + ")" : "") + ": " + (c.length ? c.join(", ") : "none of the surveys shown");
  }
  function update() {
    var z = +zs.value;
    view.z = z;
    zout.textContent = z.toFixed(2);
    drawSed(z);
    fl.forEach(function (f) {
      var v = f.fixed ? f.rest : observed(f.rest, z),
        vis = v >= view.v0 && v <= view.v1;
      f.g.setAttribute("opacity", vis ? 1 : 0);
      if (vis) {
        var x = X(v);
        f.ln.setAttribute("x1", x);
        f.ln.setAttribute("x2", x);
        f.tx.setAttribute("x", Math.min(Math.max(x, 30), 650));
      }
    });
    readout.textContent = "";
    view.readout.forEach(function (r) {
      var p = document.createElement("div");
      p.textContent = readoutLine(r[0], observed(r[1], z));
      readout.appendChild(p);
    });
  }

  var zsticky = zcol.querySelector(".sc-zsticky");
  function fitSlider() {
    zsticky.style.maxHeight = chart.getBoundingClientRect().height + "px";
  }
  window.addEventListener("resize", fitSlider);

  function setView(i) {
    view = VIEWS[i];
    render();
    update();
    fitSlider();
  }
  vsel.addEventListener("change", function () {
    setView(+vsel.value);
  });
  gsel.addEventListener("change", update);
  zs.addEventListener("input", update);
  setView(0);
})();
