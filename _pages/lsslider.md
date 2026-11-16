---
layout: page
title: galaxy clustering slider
permalink: /lsslider/
description:
nav: false
_styles: >
  #lsslider { margin: 1.5rem 0; font-size: 0.9rem; }
  #lsslider svg { display: block; font-family: inherit; overflow: visible; }
  #lsslider .ls-main { display: flex; gap: 24px; align-items: flex-start; }
  #lsslider .ls-chart { flex: 1 1 60%; min-width: 0; }
  #lsslider .ls-side { flex: 0 0 280px; position: sticky; top: 72px; }
  @media (max-width: 767px) { #lsslider .ls-main { flex-direction: column; } #lsslider .ls-side { flex-basis: auto; width: 100%; position: static; } }
  #lsslider .ls-grid { stroke: var(--global-divider-color); stroke-width: 0.5; }
  #lsslider .ls-frame { fill: none; stroke: var(--global-text-color-light); stroke-width: 0.5; }
  #lsslider .ls-zero { stroke: var(--global-text-color-light); stroke-width: 0.75; stroke-dasharray: 2 3; }
  #lsslider .ls-tick { font-size: 11px; fill: var(--global-text-color-light); }
  #lsslider .ls-ylab, #lsslider .ls-xlab { font-size: 13px; fill: var(--global-text-color); }
  #lsslider .ls-tag { font-size: 12px; font-weight: 500; }
  #lsslider .ls-cur { fill: none; stroke-width: 2; stroke-linejoin: round; }
  #lsslider .ls-ref { fill: none; stroke: var(--global-text-color-light); stroke-width: 1.25; stroke-dasharray: 4 3; }
  #lsslider .ls-legend { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 6px; font-size: 0.8rem; color: var(--global-text-color-light); }
  #lsslider .ls-legend svg { display: inline-block; vertical-align: middle; margin-right: 4px; color: var(--global-text-color); }
  #lsslider .ls-tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
  #lsslider .ls-tab { background: none; border: 1px solid var(--global-divider-color); border-radius: 4px; padding: 2px 8px; color: var(--global-text-color-light); font-size: 0.8rem; cursor: pointer; }
  #lsslider .ls-tab[aria-selected="true"] { border-color: var(--global-theme-color); color: var(--global-theme-color); }
  #lsslider .ls-gnote { font-size: 0.8rem; color: var(--global-text-color-light); margin: 0 0 8px 0; line-height: 1.4; }
  #lsslider .ls-row { display: block; margin: 0 0 10px 0; font-weight: normal; }
  #lsslider .ls-rowhead { display: flex; justify-content: space-between; }
  #lsslider .ls-name { color: var(--global-text-color); }
  #lsslider .ls-name[title] { cursor: help; }
  #lsslider .ls-val { font-variant-numeric: tabular-nums; color: var(--global-text-color-light); }
  #lsslider input[type="range"] { width: 100%; margin: 2px 0 0 0; accent-color: var(--global-theme-color); cursor: pointer; }
  #lsslider .ls-actions { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
  #lsslider .ls-reset { background: none; border: 1px solid var(--global-divider-color); border-radius: 4px; padding: 2px 10px; color: var(--global-text-color); font-size: 0.8rem; cursor: pointer; }
  #lsslider .ls-hint { font-size: 0.75rem; color: var(--global-text-color-light); }
---

How does the galaxy power spectrum respond to cosmology, galaxy bias and small-scale physics? The panels below show the monopole, quadrupole and hexadecapole of the redshift-space power spectrum of a DESI-like luminous red galaxy sample at z = 0.5, predicted by the one-loop effective field theory model [FOLPS](https://github.com/cosmodesi/FolpsD). Drag the sliders on the right to change the parameters; the dashed line shows the fiducial model for comparison. The tabs switch between cosmological parameters, galaxy bias, EFT counterterms, and stochastic and Fingers-of-God terms.

<div id="lsslider" data-src="{{ '/assets/json/lsslider_folps.json' | relative_url }}"></div>

<script src="{{ '/assets/js/lsslider.js' | relative_url }}" defer></script>

**How it works.** The model is evaluated entirely in your browser. For a fixed cosmology, the multipoles are an exact polynomial in the bias, counterterm and stochastic parameters, so they can be written as a sum of 17 template spectra weighted by combinations of those parameters. The templates depend on cosmology and on the Fingers-of-God damping; they were computed offline with [desilike](https://github.com/cosmodesi/desilike) on a set of training cosmologies and are emulated here with a polynomial fit, compressed with principal components.

**Caveats.** Within the slider ranges, the emulator typically reproduces the full model to about 0.1%, with errors of up to a few percent of the monopole amplitude for unusual parameter combinations; outside the ranges it is not valid. The nuisance parameters use the "physical" basis of the DESI full-shape analyses, in which the bias parameters are rescaled by powers of σ<sub>8</sub>(z) and the counterterms by the linear bias, so their numerical values are not directly comparable to other conventions. The neutrino mass (0.06 eV) and the dark energy equation of state (w = −1) are kept fixed.
