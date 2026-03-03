---
title: "A new data-driven energy-stable evolve-filter-relax model for turbulent flow simulation"
date: "2026-03-01"
authors: "Toby van Gastelen, Wouter Edeling, Benjamin Sanderse"
---

# A new data-driven energy-stable evolve-filter-relax model for turbulent flow simulation

Anna Ivagnes, Toby van Gastelen, Syver Døving Agdestein, Benjamin Sanderse, Giovanni Stabile, Gianluigi Rozza

[Published paper](https://doi.org/10.1016/j.cma.2025.118654)

[Preprint](https://www.arxiv.org/abs/2507.17423)

## Abstract

We present a novel approach to define the filter and relax steps in the
evolve-filter-relax (EFR) framework for simulating turbulent flows. The EFR
main advantages are its ease of implementation and computational efficiency.
However, as it only contains two parameters (one for the filter step and one
for the relax step) its flexibility is rather limited. In this work, we
propose a data-driven approach in which the optimal filter is found based on
DNS data in the frequency domain. The optimization step is computationally
efficient and only involves one-dimensional least-squares problems for each
wavenumber. Across both decaying turbulence and Kolmogorov flow, our learned
filter decisively outperforms the standard differential filter and the
Smagorinsky model, yielding significantly improved accuracy in energy spectra
and in the temporal evolution of both energy and enstrophy. In addition, the
relax parameter is determined by requiring energy and/or enstrophy
conservation, which enforces stability of the method and reduces the appearance
of numerical wiggles, especially when the filter is built in scarce data
regimes. Applying the learned filter is also more computationally efficient
compared to traditional differential filters, as it circumvents solving a
linear system.
