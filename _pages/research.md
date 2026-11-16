---
layout: page
title: research
permalink: /research/
description: 
nav: true
nav_order: 1
_styles: >
  .research-intro { margin-bottom: 2rem; }
  .research-line { margin: 0 0 2.75rem 0; }
  .research-line h3 { font-size: 1.35rem; margin-top: 0.5rem; margin-bottom: 0.6rem; }
  .research-line p { margin-bottom: 0.6rem; }
  .research-line figure { margin-bottom: 0; }
  .research-line .more { font-weight: 500; }
  .research-credit { font-size: 0.8rem; color: var(--global-text-color-light); margin-top: 0.35rem; }
---

<div class="research-intro" markdown="1">

Galaxy surveys map the positions of millions of galaxies across cosmic time, and in doing so they record the expansion history of the Universe and the way structure has grown within it. My research combines theory, simulations and data from the leading surveys of this decade (mainly the [Dark Energy Spectroscopic Instrument](https://www.desi.lbl.gov), DESI, and the [Vera C. Rubin Observatory](https://rubinobservatory.org)) to test the ΛCDM model and look for signs of new physics: the nature of dark energy, the growth of cosmic structure, and the properties of neutrinos and other light relics.

Below is a short summary of the main research lines of my group. Each one links to a list of selected publications.

</div>

<div class="row align-items-center research-line">
  <div class="col-md-5 mb-3 mb-md-0">
    {% include figure.liquid loading="eager" path="assets/img/research/research_w0wa.png" alt="Constraints on the dark energy equation of state parameters w0 and wa from DESI, CMB and supernovae" class="img-fluid rounded z-depth-1" sizes="(min-width: 768px) 360px, 95vw" %}
    <div class="research-credit">Dark energy constraints from DESI DR2 BAO combined with CMB and supernovae. Credit: DESI Collaboration (2025).</div>
  </div>
  <div class="col-md-7" markdown="1">

### The nature of dark energy

Baryon acoustic oscillations (BAO) are a standard ruler imprinted in the distribution of galaxies, and DESI uses them to measure the expansion history of the Universe with sub-percent precision. Combined with the CMB and type Ia supernovae, DESI now shows a 2.8–4.2σ preference for dark energy that evolves over time. We are interested in improving the precision and accuracy of BAO analyses and in exploring the implications of these results for the physics of dark energy.

<a class="more" href="{{ '/research/dark-energy/' | relative_url }}">Selected publications →</a>

  </div>
</div>

<div class="row align-items-center research-line">
  <div class="col-md-5 order-md-last mb-3 mb-md-0">
    {% include figure.liquid loading="lazy" path="assets/img/research/research_emulator.png" alt="Neural networks trained on N-body simulations predict the galaxy power spectrum" class="img-fluid rounded z-depth-1" sizes="(min-width: 768px) 360px, 95vw" %}
    <div class="research-credit">Neural networks trained on N-body simulations learn how clustering statistics depend on cosmology.</div>
  </div>
  <div class="col-md-7" markdown="1">

### AI-powered models of galaxy clustering

A great deal of the cosmological information in a galaxy survey lives on small, non-linear scales, where perturbation theory breaks down and most analyses throw the data away. We build simulation-based models that can access these scales: machine-learning emulators trained on suites of high-fidelity N-body simulations that predict clustering observables deep into the non-linear regime. Applied to BOSS, this approach roughly halved the uncertainty on the growth rate of structure compared to the standard analysis, and we are now extending it to DESI.

<a class="more" href="{{ '/research/ai-modelling/' | relative_url }}">Selected publications →</a>

  </div>
</div>

<div class="row align-items-center research-line">
  <div class="col-md-5 mb-3 mb-md-0">
    {% include figure.liquid loading="lazy" path="assets/img/research/research_densitysplit.png" alt="Illustration of density-split clustering: query points in a cosmic web coloured by local density" class="img-fluid rounded z-depth-1" sizes="(min-width: 768px) 360px, 95vw" %}
    <div class="research-credit">Density-split clustering sorts the cosmic web into environments, from voids to clusters (illustration).</div>
  </div>
  <div class="col-md-7" markdown="1">

### Beyond two-point statistics

Gravity makes the late-time Universe non-Gaussian, so the power spectrum alone can no longer describe it. We develop and apply summary statistics that capture this extra information, such as density-split clustering (a method we introduced in 2021), cosmic voids, Minkowski functionals and the wavelet scattering transform. A key part of this work is making these statistics robust to the observational systematics of real surveys, with the goal of a sub-percent measurement of the growth rate fσ<sub>8</sub> from DESI.

<a class="more" href="{{ '/research/beyond-2pt/' | relative_url }}">Selected publications →</a>

  </div>
</div>
