---
title: "Software"
---

# Software developed in the Scientific Computing Group


## Neural networks for ODEs (including closure modeling for turbulent flows)
- [NeuralClosureTutorials](https://github.com/agdestein/NeuralClosureTutorials): Neural closure modeling tutorials from the 2023 SciML semester programme.
- [IncompressibleNavierStokes.jl](https://agdestein.github.io/IncompressibleNavierStokes.jl/dev/): Incompressible Navier-Stokes solver in Julia with neural networks to model turbulence.
- [DEEPDIP project](https://github.com/DEEPDIP-project): Project to integrate neural networks in physics applications through SciML libraries. In particular, the [CNODE](https://github.com/DEEPDIP-project/CoupledNODE.jl) is a coupling library in which multiple coupled ODEs with neural networks in the right-hand side can be learned from data.
- [Energy-conserving neural networks](https://github.com/DEEPDIP-project/ECNCM_1D)
- [Neural closure models](https://github.com/HugoMelchers/neural-closure-models)

## General 2D/3D Navier-Stokes solvers
- [IncompressibleNavierStokes.jl](https://agdestein.github.io/IncompressibleNavierStokes.jl/dev/): Incompressible Navier-Stokes solver in Julia.
- [INS2D](https://github.com/bsanderse/INS2D): Incompressible Navier-Stokes solver in MATLAB.
- [Spectral solver](https://github.com/agdestein/NeuralClosureTutorials/blob/main/tutorials/navier_stokes_spectral.md): spectral solver.

![Screenshot of our incompressible Navier-Stokes solver in Julia](/INS_screenshot.png)

## 1D compressible flow solvers
- [HELMEOS](https://github.com/rbklein/HELMEOS): An entropy stable solver for the compressible Euler equations using a real gas equations of state based on the Helmholtz free energy.
- [SPADES](https://github.com/rbklein/SPADES): An entropy stable solver for the shallow water equations as part of our collaboration with [Inria MEMPHIS team](https://team.inria.fr/memphis/).

## Reduced-order models
- [INS2D](https://github.com/bsanderse/INS2D): Incompressible Navier-Stokes solver with energy-conserving POD-Galerkin.

## Uncertainty quantification
- [EasySurrogate](https://github.com/wedeling/EasySurrogate): Toolkit for creating surrogate models.
- [EasyVVUQ](https://github.com/UCL-CCS/EasyVVUQ): Toolkit for Verification, Validation and Uncertainty Quantification.
- [UQ4WIND](https://github.com/bsanderse/uq4wind): Uncertainty quantification for aeroelastic wind turbine calculations, based on the [UQLab](https://www.uqlab.com/) tools.
