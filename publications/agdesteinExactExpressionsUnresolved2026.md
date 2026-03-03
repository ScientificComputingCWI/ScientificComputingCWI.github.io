---
title: "Exact expressions for the unresolved stress in a finite-volume based large-eddy simulation"
date: "2026-07-01"
authors: "Syver Døving Agdestein, Roel Verstappen, Benjamin Sanderse"
---

# Exact expressions for the unresolved stress in a finite-volume based large-eddy simulation

Syver Døving Agdestein, Roel Verstappen, Benjamin Sanderse

[Paper](https://doi.org/10.1016/j.jcp.2026.114810)

[Preprint](https://arxiv.org/abs/2507.17051)

[Code](https://github.com/agdestein/ExactClosure.jl)

[Code (Zenodo archive)](https://zenodo.org/records/16267799)

## Abstract

In this article we propose new discretization-informed expressions for the
residual stress tensor (RST) in a finite-volume based large-eddy simulation
(LES-FVM). In addition to the classical RST $\overline{u u} - \bar{u} \bar{u}$
resulting from the non-commutation between filtering and the nonlinear stress,
our RST also contains contributions from the numerical flux, discrete
divergence, and pressure terms. Unlike the classical RST, our proposed RST is
non-symmetric and non-local. The proposed form of the RST is important for
generating appropriate reference data for LES closure modeling. Based on DNS
results of the 1D Burgers and 3D incompressible Navier-Stokes equations, we
show that the discretization-induced parts of the RST play an important role in
the LES-FVM equation for common LES filter widths. When the discrete
contribution is included, our RST expression gives zero a-posteriori error in
LES, while existing RST expressions give errors that increase over time. For a
Smagorinsky model, we show that the Smagorinsky coefficient is higher when
fitted to our new RST than when fitted to the classical RST and gives improved
results.
