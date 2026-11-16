---
layout: page
title: useful
permalink: /useful/
description: Interactive tools and widgets for cosmology and galaxy surveys.
nav: true
nav_order: 7
_styles: >
  .useful-item { margin: 0 0 2.75rem 0; }
  .useful-item h3 { font-size: 1.35rem; margin-top: 0.5rem; margin-bottom: 0.6rem; }
  .useful-item p { margin-bottom: 0.6rem; }
  .useful-item figure { margin-bottom: 0; }
  .useful-item .more { font-weight: 500; }
---

<div class="row align-items-center useful-item">
  <div class="col-md-5 mb-3 mb-md-0">
    <a href="{{ '/lsslider/' | relative_url }}">
    {% include figure.liquid loading="eager" path="assets/img/useful/lsslider.png" alt="Monopole, quadrupole and hexadecapole of the galaxy power spectrum predicted by a one-loop EFT model" class="img-fluid rounded z-depth-1" sizes="(min-width: 768px) 360px, 95vw" %}
    </a>
  </div>
  <div class="col-md-7" markdown="1">

### Galaxy clustering slider

How the redshift-space galaxy power spectrum multipoles respond to cosmology, galaxy bias, EFT counterterms and stochastic terms, using the one-loop FOLPS model for a DESI-like luminous red galaxy sample. It runs entirely in the browser.

<a class="more" href="{{ '/lsslider/' | relative_url }}">Open the widget →</a>

  </div>
</div>

<div class="row align-items-center useful-item">
  <div class="col-md-5 mb-3 mb-md-0">
    <a href="{{ '/survey-coverage/' | relative_url }}">
    {% include figure.liquid loading="eager" path="assets/img/useful/survey_coverage.png" alt="Wavelength coverage of spectroscopic and imaging surveys, with an example galaxy spectrum and redshift slider" class="img-fluid rounded z-depth-1" sizes="(min-width: 768px) 360px, 95vw" %}
    </a>
  </div>
  <div class="col-md-7" markdown="1">

### Survey wavelength coverage

Where modern spectroscopic and imaging surveys observe, from the UV to the mid-infrared, with a redshift slider showing which surveys cover Hα and [OII].

<a class="more" href="{{ '/survey-coverage/' | relative_url }}">Open the widget →</a>

  </div>
</div>
