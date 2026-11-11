---
layout: page
title: survey coverage
permalink: /survey-coverage/
description:
nav: false
_styles: >
  #survey-coverage { margin: 1.5rem 0; }
  #survey-coverage svg { display: block; font-family: inherit; }
  #survey-coverage .sc-t { font-size: 14px; fill: var(--global-text-color); }
  #survey-coverage .sc-th { font-size: 14px; font-weight: 500; fill: var(--global-text-color); }
  #survey-coverage .sc-ts { font-size: 12px; fill: var(--global-text-color-light); }
  #survey-coverage a.sc-link { cursor: pointer; }
  #survey-coverage a.sc-link text { fill: var(--global-theme-color); }
  #survey-coverage a.sc-link:hover text, #survey-coverage a.sc-link:focus text { text-decoration: underline; }
  #survey-coverage .sc-grid { stroke: var(--global-divider-color); stroke-width: 0.5; }
  #survey-coverage .sc-axis { stroke: var(--global-text-color-light); stroke-width: 0.5; }
  #survey-coverage .sc-boundary { stroke: var(--global-text-color-light); stroke-width: 0.75; stroke-dasharray: 2 4; }
  #survey-coverage .sc-spec { fill: #1d9e75; }
  #survey-coverage .sc-spec-dashed { fill: none; stroke: #1d9e75; stroke-width: 1; stroke-dasharray: 3 2; }
  #survey-coverage .sc-phot { fill: #ba7517; }
  #survey-coverage .sc-spec.sc-planned { fill-opacity: 0.3; stroke: #1d9e75; stroke-width: 1; stroke-dasharray: 3 2; }
  #survey-coverage .sc-phot.sc-planned { fill-opacity: 0.3; stroke: #ba7517; stroke-width: 1; stroke-dasharray: 3 2; }
  #survey-coverage .sc-sed { fill: none; stroke: var(--global-text-color); stroke-width: 1.2; stroke-linejoin: round; }
  #survey-coverage .sc-sed-fill { fill: var(--global-text-color); opacity: 0.07; }
  #survey-coverage .sc-atm { fill: #378add; fill-opacity: 0.3; stroke: #378add; stroke-width: 0.75; }
  #survey-coverage .sc-feat line { stroke-width: 1.5; stroke-dasharray: 4 3; }
  #survey-coverage .sc-feat text { font-size: 12px; fill: var(--global-text-color-light); }
  #survey-coverage .sc-feat-line line { stroke: #d85a30; }
  #survey-coverage .sc-feat-cont line { stroke: #7f77dd; }
  #survey-coverage .sc-regime rect { stroke-width: 0.5; }
  #survey-coverage .sc-regime text { font-size: 12px; }
  #survey-coverage .sc-uv rect { fill: #eeedfe; stroke: #534ab7; } #survey-coverage .sc-uv text { fill: #3c3489; }
  #survey-coverage .sc-opt rect { fill: #f1efe8; stroke: #5f5e5a; } #survey-coverage .sc-opt text { fill: #444441; }
  #survey-coverage .sc-nir rect { fill: #faece7; stroke: #993c1d; } #survey-coverage .sc-nir text { fill: #712b13; }
  #survey-coverage .sc-mir rect { fill: #fcebeb; stroke: #a32d2d; } #survey-coverage .sc-mir text { fill: #791f1f; }
  #survey-coverage .sc-c5 rect { fill: #e1f5ee; stroke: #0f6e56; } #survey-coverage .sc-c5 text { fill: #085041; }
  #survey-coverage .sc-c6 rect { fill: #e6f1fb; stroke: #185fa5; } #survey-coverage .sc-c6 text { fill: #0c447c; }
  html[data-theme="dark"] #survey-coverage .sc-c5 rect { fill: #085041; stroke: #5dcaa5; } html[data-theme="dark"] #survey-coverage .sc-c5 text { fill: #9fe1cb; }
  html[data-theme="dark"] #survey-coverage .sc-c6 rect { fill: #0c447c; stroke: #85b7eb; } html[data-theme="dark"] #survey-coverage .sc-c6 text { fill: #b5d4f4; }
  html[data-theme="dark"] #survey-coverage .sc-uv rect { fill: #3c3489; stroke: #afa9ec; } html[data-theme="dark"] #survey-coverage .sc-uv text { fill: #cecbf6; }
  html[data-theme="dark"] #survey-coverage .sc-opt rect { fill: #444441; stroke: #b4b2a9; } html[data-theme="dark"] #survey-coverage .sc-opt text { fill: #d3d1c7; }
  html[data-theme="dark"] #survey-coverage .sc-nir rect { fill: #712b13; stroke: #f0997b; } html[data-theme="dark"] #survey-coverage .sc-nir text { fill: #f5c4b3; }
  html[data-theme="dark"] #survey-coverage .sc-mir rect { fill: #791f1f; stroke: #f09595; } html[data-theme="dark"] #survey-coverage .sc-mir text { fill: #f7c1c1; }
  #survey-coverage .sc-controls select { background: var(--global-bg-color); color: var(--global-text-color); border: 1px solid var(--global-divider-color); border-radius: 4px; padding: 2px 6px; }
  #survey-coverage .sc-controls label { margin: 0; }
  #survey-coverage .sc-controls { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 0.9rem; color: var(--global-text-color-light); }
  #survey-coverage .sc-main { display: flex; align-items: stretch; gap: 8px; }
  #survey-coverage .sc-chart { flex: 1; min-width: 0; }
  #survey-coverage .sc-zcol { flex: 0 0 64px; }
  #survey-coverage .sc-zsticky { position: sticky; top: 72px; height: min(75vh, 640px, calc((100vw - 110px) * 1.05)); display: flex; flex-direction: column; align-items: center; font-size: 0.8rem; color: var(--global-text-color-light); }
  #survey-coverage .sc-zsticky label { margin: 0; }
  #survey-coverage .sc-zout { font-size: 1rem; font-weight: 500; color: var(--global-text-color); margin-bottom: 6px; }
  #survey-coverage .sc-zbody { flex: 1; display: flex; gap: 4px; min-height: 0; }
  #survey-coverage .sc-zbody input { writing-mode: vertical-lr; direction: rtl; height: 100%; width: 22px; margin: 0; accent-color: var(--global-theme-color); cursor: pointer; }
  #survey-coverage .sc-zticks { display: flex; flex-direction: column; justify-content: space-between; padding: 6px 0; line-height: 1; }
  #survey-coverage .sc-readout { margin-top: 8px; font-size: 0.9rem; line-height: 1.7; color: var(--global-text-color-light); }
  #survey-coverage .sc-note { margin-top: 4px; font-size: 0.8rem; color: var(--global-text-color-light); }
---

Where do today's surveys observe? The chart below places the main surveys on a common axis, one part of the spectrum at a time. Use the **View** menu to switch between optical and infrared, ultraviolet, X-ray, radio (21 cm) and microwave (CMB); each view uses its natural unit (wavelength, photon energy or frequency). Drag the redshift slider on the right to move an example spectrum and its key features (emission lines in orange, continuum features in purple) across the bands, and the text below the chart lists which surveys cover the main lines at that redshift. The **Spectrum** menu switches between source types, such as star-forming and quiescent galaxies, quasars, obscured AGN, galaxy clusters or the CMB itself. The blue strip at the bottom shows how much light gets through Earth's atmosphere, which is why X-ray and most ultraviolet and mid-infrared work has to be done from space.

<div id="survey-coverage"></div>

<script src="{{ '/assets/js/survey-coverage.js' | relative_url }}" defer></script>

**How to read it.** Continuous bars are spectroscopic or wide-band coverage; separate blocks with alternating shading are individual filters or frequency bands. The column next to each name gives a key number for that view: the resolving power R in the optical and UV, the observing mode in X-rays, the 21 cm redshift range in the radio, and the number of bands or the target line in the microwave. Faded, outlined bars are planned or under construction. In the optical view, the dashed Euclid NISP outline is the blue grism (deep fields only) and the darker SPHEREx segment marks its higher-resolution bands above 3.8 µm.

**Caveats.** The example spectra are simple toy models (blackbodies, power laws, Gaussian lines, simple absorption), plotted as νFν on a log scale. The atmospheric transmission curves are approximate (Mauna Kea-like in the optical and infrared, Atacama-like in the microwave) and show where the windows are. Filter and grating edges are approximate, set roughly where throughput falls off. The regime boundaries are conventions: 2.5 µm is the ground-based near-/mid-infrared split, while space missions such as JWST and SPHEREx call everything up to 5 µm "near-infrared".
