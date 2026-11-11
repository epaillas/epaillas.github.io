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
  html[data-theme="dark"] #survey-coverage .sc-uv rect { fill: #3c3489; stroke: #afa9ec; } html[data-theme="dark"] #survey-coverage .sc-uv text { fill: #cecbf6; }
  html[data-theme="dark"] #survey-coverage .sc-opt rect { fill: #444441; stroke: #b4b2a9; } html[data-theme="dark"] #survey-coverage .sc-opt text { fill: #d3d1c7; }
  html[data-theme="dark"] #survey-coverage .sc-nir rect { fill: #712b13; stroke: #f0997b; } html[data-theme="dark"] #survey-coverage .sc-nir text { fill: #f5c4b3; }
  html[data-theme="dark"] #survey-coverage .sc-mir rect { fill: #791f1f; stroke: #f09595; } html[data-theme="dark"] #survey-coverage .sc-mir text { fill: #f7c1c1; }
  #survey-coverage .sc-controls { display: flex; align-items: center; gap: 12px; margin-top: 8px; font-size: 0.9rem; color: var(--global-text-color-light); }
  #survey-coverage .sc-controls label { margin: 0; }
  #survey-coverage .sc-controls input { flex: 1; accent-color: var(--global-theme-color); }
  #survey-coverage .sc-zout { min-width: 4.5em; font-weight: 500; color: var(--global-text-color); }
  #survey-coverage .sc-readout { margin-top: 8px; font-size: 0.9rem; line-height: 1.7; color: var(--global-text-color-light); }
---

Where do today's galaxy surveys observe? The chart below places the main spectroscopic (teal) and imaging (amber) surveys on a common wavelength axis. Drag the redshift slider to move key spectral features (emission lines in orange, continuum features in purple) and see which spectroscopic surveys cover Hα and [OII] at that redshift.

<div id="survey-coverage"></div>

<script src="{{ '/assets/js/survey-coverage.js' | relative_url }}" defer></script>

**How to read it.** For spectroscopic surveys, the column on the left gives the approximate resolving power R. Imaging filters are drawn as individual blocks with alternating shading. The dashed Euclid NISP outline is the blue grism, which is used only in the deep fields. The darker SPHEREx segment marks its higher-resolution bands above 3.8 µm.

**Caveats.** Filter and grating edges are approximate (roughly where throughput falls off), not official transmission curves. The regime boundaries are conventions: 2.5 µm is the ground-based near-/mid-infrared split, while space missions such as JWST and SPHEREx call everything up to 5 µm "near-infrared". Some of the facilities shown are not yet operating.
