# Kerr Geometry Open Problems Archive — Notion-Ready Edition

**Status snapshot:** April 2026  
**Scope:** vacuum and near-vacuum Kerr / near-Kerr problems in mathematical general relativity  
**Format:** designed for direct import into Notion as a single page

## How to use this page in Notion
- Import this `.md` file into Notion, or paste the whole document into a blank page.
- Convert the **Problem Index** table into a database if you want filters by cluster, status, or difficulty.
- Each problem uses the same template:
  - **Statement**
  - **Math required**
  - **Why it matters**
  - **Completion criteria**
  - **Implications if solved**

## Suggested database properties
`ID` · `Title` · `Cluster` · `Status` · `Difficulty` · `Keywords` · `Primary regime` · `Needs linear input?` · `Needs nonlinear input?`

## Cluster guide
- **Exterior stability**: global exterior dynamics, decay, scattering, radiation
- **Interior / SCC**: Cauchy horizon, blue-shift, extendibility, singularity structure
- **Extremal / near-extremal**: zero surface gravity, Aretakis effects, throat limits
- **Rigidity / uniqueness**: stationary characterization, hidden symmetry, near-Kerr recognition
- **Spectral / scattering**: quasinormal modes, resolvents, inverse problems, excitation

## Problem Index

| ID | Title | Cluster | Status |
|---|---|---|---|
| K-001 | Full nonlinear stability of subextremal Kerr | Exterior stability | Partial |
| K-002 | Uniform nonlinear stability as a→M− | Exterior stability | Open |
| K-003 | Nonlinear asymptotic completeness near Kerr | Exterior stability | Partial |
| K-004 | Peeling and polyhomogeneous null infinity for near-Kerr | Exterior stability | Open |
| K-005 | Sharp nonlinear Price law for curvature | Exterior stability | Partial |
| K-006 | Kerr stability with BMS charges and nonlinear memory | Exterior stability | Open |
| K-007 | Einstein–Maxwell stability near Kerr | Exterior stability | Partial |
| K-008 | Full stability of asymptotically flat Kerr–Newman | Exterior stability | Partial |
| K-009 | Einstein–massive Klein–Gordon near Kerr endstates | Exterior stability | Open |
| K-010 | Nonlinear superradiant endstates in Kerr–AdS | Exterior stability | Partial |
| K-011 | Spin fields on dynamical near-Kerr backgrounds | Exterior stability | Partial |
| K-012 | Low-regularity Kerr stability threshold | Exterior stability | Open |
| K-013 | Formation plus relaxation to Kerr | Exterior stability | Open |
| K-014 | Nonlinear decay versus resonance expansions | Exterior stability | Open |
| K-101 | Strong Cosmic Censorship threshold for Kerr interiors | Interior / SCC | Partial |
| K-102 | Derive the interior theorem directly from exterior data | Interior / SCC | Open |
| K-103 | Vacuum curvature blow-up rates on the Kerr Cauchy horizon | Interior / SCC | Open |
| K-104 | Generic C²- or Lipschitz-inextendibility of near-Kerr MGHDs | Interior / SCC | Open |
| K-105 | Critical horizon-decay exponent controlling extendibility | Interior / SCC | Partial |
| K-106 | Genericity of lower bounds for linearized-gravity interior instability | Interior / SCC | Open |
| K-107 | Scattering map to the Cauchy horizon for linearized gravity | Interior / SCC | Partial |
| K-108 | Strong Cosmic Censorship in rotating Λ>0 backgrounds | Interior / SCC | Conditional |
| K-109 | Near-extremal interior scaling laws | Interior / SCC | Open |
| K-110 | Bifurcation-sphere stability and full interior series completion | Interior / SCC | Partial |
| K-111 | Global interior boundary type: null versus spacelike pieces | Interior / SCC | Open |
| K-112 | Teukolsky interior asymptotics beyond the current state of the art | Interior / SCC | Partial |
| K-201 | Nonlinear codimension-1 stability of extremal Kerr with horizon hair | Extremal / near-extremal | Open |
| K-202 | Full linear theory for extremal Kerr (spin 2) | Extremal / near-extremal | Partial |
| K-203 | Nonlinear fate of Aretakis instability | Extremal / near-extremal | Open |
| K-204 | Uniform estimates in the surface-gravity limit κ→0 | Extremal / near-extremal | Open |
| K-205 | Rigorous near-horizon scattering theory for NHEK | Extremal / near-extremal | Open |
| K-206 | Extremal interior SCC and Cauchy-horizon regularity | Extremal / near-extremal | Open |
| K-207 | Extremal tail asymptotics versus conserved charges | Extremal / near-extremal | Partial |
| K-208 | Near-extremal QNM accumulation and branch-cut structure | Extremal / near-extremal | Open |
| K-209 | Codimension and modulation theory for extremal endstates | Extremal / near-extremal | Open |
| K-301 | Global Kerr uniqueness without analyticity | Rigidity / uniqueness | Partial |
| K-302 | Rigidity for extremal horizons | Rigidity / uniqueness | Open |
| K-303 | Quantitative Kerr characterization via the Mars–Simon tensor | Rigidity / uniqueness | Partial |
| K-304 | Near-Kerr implies Kerr with computable constants | Rigidity / uniqueness | Open |
| K-305 | Kerr characterization from horizon intrinsic data | Rigidity / uniqueness | Partial |
| K-306 | Hidden symmetries under perturbation | Rigidity / uniqueness | Open |
| K-307 | Photon-region and trapping stability in dynamical near-Kerr spacetimes | Rigidity / uniqueness | Open |
| K-308 | Rigidity and uniqueness with matter: full Kerr–Newman regime | Rigidity / uniqueness | Partial |
| K-401 | QNM completeness for Kerr ringdown expansions | Spectral / scattering | Open |
| K-402 | Nonlinear QNMs from full Einstein evolution | Spectral / scattering | Partial |
| K-403 | Scattering theory for linearized gravity on Kerr | Spectral / scattering | Partial |
| K-404 | Zero-frequency structure and tail universality | Spectral / scattering | Partial |
| K-405 | Inverse scattering for Kerr parameters | Spectral / scattering | Open |
| K-406 | Spectral stability and pseudospectrum of Kerr QNMs | Spectral / scattering | Open |
| K-407 | QNM excitation factors and universality theorems | Spectral / scattering | Open |

---

## Detailed Problems

## K-001 — Full nonlinear stability of subextremal Kerr

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Prove that asymptotically flat vacuum initial data sufficiently close to a Kerr slice with |a|<M evolve to a spacetime with complete future null infinity, a regular event horizon, and quantitative convergence to a nearby Kerr metric modulo gauge and parameter modulation.

**Math required**  
Geometric analysis of Einstein vacuum equations; null structure equations; gauge fixing; weighted Sobolev spaces; vector-field and r^p methods; trapping/superradiance control; modulation of mass and angular momentum.

**Why it matters**  
This is the main Kerr stability conjecture in the physically relevant asymptotically flat vacuum setting.

**Completion criteria**  
A complete answer must specify the initial-data topology, prove global exterior existence, identify the final Kerr parameters, establish quantitative decay rates in a fixed gauge, and control all nonlinear error terms for the full subextremal range.

**Implications if solved**  
Would settle the core exterior black-hole stability problem for rotating vacuum black holes and give the exterior half of a precise cosmic censorship picture.

---

## K-002 — Uniform nonlinear stability as a→M−

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Prove a version of Kerr stability whose constants and decay estimates remain uniform, or quantitatively controlled, as the spin approaches extremality.

**Math required**  
Degenerate redshift analysis; near-horizon scaling; semiclassical control near the photon region; uniform weighted energies in the surface-gravity parameter κ.

**Why it matters**  
Near-extremal Kerr is the transition region between the standard subextremal theory and the qualitatively different extremal regime.

**Completion criteria**  
A complete answer must track dependence on ε=1−|a|/M in all coercive estimates and separate unavoidable degeneracies from removable technical losses.

**Implications if solved**  
Would bridge ordinary Kerr stability to extremal dynamics and sharpen what actually fails as κ→0.

---

## K-003 — Nonlinear asymptotic completeness near Kerr

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Construct a nonlinear scattering map between near-Kerr initial data and asymptotic radiation data at null infinity plus final Kerr parameters.

**Math required**  
Hyperboloidal or conformal compactification techniques; nonlinear scattering theory; Bondi framework; constraint propagation; inverse problems for radiation fields.

**Why it matters**  
This is the cleanest theorem-level formulation of relaxation to Kerr plus radiation.

**Completion criteria**  
A complete answer must define the forward and inverse scattering maps in explicit function spaces and prove existence, uniqueness, and continuous dependence modulo symmetries.

**Implications if solved**  
Would make the Kerr endstate picture mathematically precise and usable for waveform extraction and uniqueness questions.

---

## K-004 — Peeling and polyhomogeneous null infinity for near-Kerr

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Prove a sharp asymptotic expansion for curvature and connection coefficients at future null infinity for nonlinear near-Kerr evolutions.

**Math required**  
Null foliation geometry; transport equations; conformal compactification; asymptotic expansions; weighted regularity along null hypersurfaces.

**Why it matters**  
Decay alone does not determine the detailed asymptotic geometry; peeling data encode physically meaningful radiation structure.

**Completion criteria**  
A complete answer must provide the expansion order, the gauge, the leading coefficients as functionals of data, and rigorous remainder bounds.

**Implications if solved**  
Would clarify radiation memory, asymptotic charges, and how Kerr asymptotics differ from generic asymptotically flat vacua.

---

## K-005 — Sharp nonlinear Price law for curvature

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Prove optimal late-time inverse-power decay for gauge-invariant curvature quantities and relevant metric coefficients in nonlinear near-Kerr evolution.

**Math required**  
Sharp r^p hierarchies; resonance/low-frequency analysis; nonlinear bootstrap estimates; Bianchi equations; asymptotic mode coupling.

**Why it matters**  
Sharp tails control how exterior decay feeds into interior instability and into the interpretation of ringdown signals.

**Completion criteria**  
A complete answer must state exact exponents, identify generic nonvanishing leading coefficients, and prove matching upper and lower bounds.

**Implications if solved**  
Would connect linear tail predictions to the full Einstein dynamics and feed directly into SCC formulations.

---

## K-006 — Kerr stability with BMS charges and nonlinear memory

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Build a Kerr stability theorem that simultaneously controls Bondi mass/angular momentum aspects, BMS ambiguities, and nonlinear memory observables.

**Math required**  
Bondi-Sachs expansions; asymptotic symmetries; flux laws; gauge fixing at null infinity; nonlinear radiation estimates.

**Why it matters**  
A stability theorem should describe not only decay, but also the asymptotic observables seen by distant detectors.

**Completion criteria**  
A complete answer must define charges and memory in the chosen regularity class, prove their finiteness and flux laws, and show consistency with the final Kerr parameters.

**Implications if solved**  
Would connect rigorous black-hole PDE theory to the clean mathematical structure behind gravitational-wave observables.

---

## K-007 — Einstein–Maxwell stability near Kerr

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Prove asymptotic stability for coupled gravitational and electromagnetic perturbations near a rotating black-hole endstate.

**Math required**  
Coupled hyperbolic systems; gravito-electromagnetic gauge fixing; Teukolsky-type equations with coupling; conserved fluxes for charge and angular momentum.

**Why it matters**  
Realistic black-hole models often involve coupled fields, and the Einstein–Maxwell system is the next natural extension of the vacuum problem.

**Completion criteria**  
A complete answer must identify the final stationary family, derive quantitative decay for the coupled fields, and prove orbital stability in a precise topology.

**Implications if solved**  
Would open a path toward the full Kerr–Newman stability program.

---

## K-008 — Full stability of asymptotically flat Kerr–Newman

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Prove linear and then nonlinear stability of the full subextremal Kerr–Newman family without small-charge or slow-rotation assumptions.

**Math required**  
Non-selfadjoint spectral theory; coupled gravito-EM perturbation equations; physical-space energy estimates; nonlinear modulation of mass, charge, and spin.

**Why it matters**  
Kerr–Newman is the natural stationary Einstein–Maxwell black-hole family and a major benchmark after Kerr.

**Completion criteria**  
A complete answer must treat the full subextremal parameter range a^2+Q^2<M^2 and produce decay to linearized or nonlinear Kerr–Newman modulo gauge and parameter shifts.

**Implications if solved**  
Would give a coupled-field analogue of the Kerr stability theorem and reshape the Einstein–Maxwell scattering picture.

---

## K-009 — Einstein–massive Klein–Gordon near Kerr endstates

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Classify whether small Einstein–massive KG perturbations near Kerr disperse to Kerr, form long-lived clouds, or trigger nonlinear superradiant phenomena.

**Math required**  
Massive wave spectral theory; quasi-bound states; nonlinear bifurcation; dispersive estimates with trapping and superradiance.

**Why it matters**  
Massive fields are the canonical place where the clean vacuum dispersive picture may fail.

**Completion criteria**  
A complete answer must give a theorem-level dynamical classification with explicit parameter regimes and asymptotic alternatives.

**Implications if solved**  
Would clarify the long-time dynamics of rotating black holes coupled to realistic matter models.

---

## K-010 — Nonlinear superradiant endstates in Kerr–AdS

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Determine the theorem-level nonlinear endstate for small perturbations of Kerr–AdS in the presence of reflecting infinity and superradiance.

**Math required**  
AdS boundary value problems; long-time nonlinear dynamics; spectral instability; stable trapping; matched asymptotics.

**Why it matters**  
Kerr–AdS is the canonical setting where rotation, confinement, and superradiance collide.

**Completion criteria**  
A complete answer must prove either instability or convergence to a precisely identified stationary or time-periodic family under explicit boundary conditions.

**Implications if solved**  
Would clarify one of the most dramatic known departures from the asymptotically flat Kerr story.

---

## K-011 — Spin fields on dynamical near-Kerr backgrounds

**Cluster:** Exterior stability  
**Status:** Partial  

**Statement**  
Prove robust decay and Morawetz estimates for spin 1 and spin 2 fields on time-dependent metrics that stay close to Kerr within a nonlinear bootstrap regime.

**Math required**  
Physical-space decay without exact separability; perturbative microlocal analysis; nonstationary commutator methods.

**Why it matters**  
Nonlinear Einstein proofs require estimates on fields propagating on dynamical, not exactly stationary, backgrounds.

**Completion criteria**  
A complete answer must give coercive estimates compatible with nonlinear closure and quantify all losses due to the time-dependent background.

**Implications if solved**  
Would remove a major technical bottleneck between linear theory and a full nonlinear Kerr theorem.

---

## K-012 — Low-regularity Kerr stability threshold

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Find the minimal differentiability and asymptotic-flatness assumptions under which a Kerr stability theorem can hold.

**Math required**  
Low-regularity hyperbolic PDE; rough wave gauges; bilinear and null-structure estimates under weak decay; weighted Sobolev spaces.

**Why it matters**  
Current high-regularity proofs are powerful but not obviously close to the true threshold.

**Completion criteria**  
A complete answer must give a stability theorem at explicit regularity N and falloff δ, or produce a sharp obstruction below that threshold.

**Implications if solved**  
Would reveal how robust the Kerr stability mechanism really is.

---

## K-013 — Formation plus relaxation to Kerr

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Prove a global theorem in which generic asymptotically flat vacuum data form a black hole and the exterior subsequently relaxes to Kerr with quantitative radiation control.

**Math required**  
Trapped-surface formation; global causal geometry; continuation criteria; matching formation and relaxation regimes.

**Why it matters**  
This would turn the standard numerical-relativity narrative into a theorem.

**Completion criteria**  
A complete answer must specify an open class of initial data, prove black-hole formation, establish complete null infinity, and show quantitative Kerr asymptotics outside the hole.

**Implications if solved**  
Would unite collapse theory and Kerr stability into one coherent mathematical picture.

---

## K-014 — Nonlinear decay versus resonance expansions

**Cluster:** Exterior stability  
**Status:** Open  

**Statement**  
Relate late-time nonlinear Einstein dynamics near Kerr to a rigorous resonance/QNM plus tail expansion.

**Math required**  
Resonance theory; meromorphic resolvents; nonlinear normal forms; late-time asymptotics.

**Why it matters**  
Linear ringdown expansions are useful, but the theorem-level nonlinear version is still missing.

**Completion criteria**  
A complete answer must state when resonance expansions are asymptotic or convergent and bound the nonlinear remainder in explicit norms.

**Implications if solved**  
Would connect PDE stability theory directly to mathematical models of ringdown.

---

## K-101 — Strong Cosmic Censorship threshold for Kerr interiors

**Cluster:** Interior / SCC  
**Status:** Partial  

**Statement**  
Determine the strongest regularity class in which the maximal globally hyperbolic development of generic near-Kerr vacuum data is inextendible across the Cauchy horizon.

**Math required**  
Interior Einstein dynamics; blue-shift amplification; weak null singularities; regularity-sensitive extension theory.

**Why it matters**  
For Kerr, C^0-extendibility and stronger inextendibility can coexist, so the regularity threshold matters.

**Completion criteria**  
A complete answer must state genericity precisely, identify both any weak extendibility and any stronger inextendibility, and prove the relevant blow-up or continuity mechanisms.

**Implications if solved**  
Would sharpen Strong Cosmic Censorship specifically for rotating vacuum black holes.

---

## K-102 — Derive the interior theorem directly from exterior data

**Cluster:** Interior / SCC  
**Status:** Open  

**Statement**  
Remove interior auxiliary assumptions by proving the Kerr interior Cauchy-horizon picture directly from asymptotically flat exterior Cauchy data and exterior decay.

**Math required**  
Matching gauges across the event horizon; transfer of Price-law decay into the interior; nonlinear continuation.

**Why it matters**  
The cleanest SCC theorem should begin with ordinary exterior initial data, not data already prescribed inside the black hole.

**Completion criteria**  
A complete answer must derive the needed horizon asymptotics from exterior estimates and then prove the interior extension or singularity conclusions.

**Implications if solved**  
Would connect the exterior and interior Kerr programs into one theorem chain.

---

## K-103 — Vacuum curvature blow-up rates on the Kerr Cauchy horizon

**Cluster:** Interior / SCC  
**Status:** Open  

**Statement**  
Prove sharp quantitative blow-up rates for curvature or gauge-invariant gravitational quantities along the Kerr Cauchy horizon for generic perturbations.

**Math required**  
Nonlinear Bianchi analysis; Teukolsky asymptotics; blue-shift energy estimates; tetrad regularity.

**Why it matters**  
SCC is not just about whether blow-up occurs, but about which geometric quantities diverge and how fast.

**Completion criteria**  
A complete answer must provide matching upper and lower blow-up rates in a regular frame and show generic nonvanishing of leading coefficients.

**Implications if solved**  
Would make the weak-null-singularity picture quantitative instead of merely qualitative.

---

## K-104 — Generic C²- or Lipschitz-inextendibility of near-Kerr MGHDs

**Cluster:** Interior / SCC  
**Status:** Open  

**Statement**  
Show that although C^0 extensions can exist, generic near-Kerr vacuum developments admit no extension with enough regularity to preserve a meaningful Einstein evolution across the Cauchy horizon.

**Math required**  
Curvature lower bounds; regularity comparison; extension theory; blow-up of connection or curvature invariants.

**Why it matters**  
This is the strongest currently plausible version of SCC for Kerr-type interiors.

**Completion criteria**  
A complete answer must specify the regularity class, prove generic blow-up of the corresponding geometric quantity, and rule out every extension in that class.

**Implications if solved**  
Would restore deterministic predictability at the correct mathematical regularity level.

---

## K-105 — Critical horizon-decay exponent controlling extendibility

**Cluster:** Interior / SCC  
**Status:** Partial  

**Statement**  
Identify the exact exterior decay rate along the event horizon that separates weaker extendibility from stronger blow-up at the Cauchy horizon.

**Math required**  
Price-law asymptotics; transport into the interior; threshold Sobolev estimates; logarithmic corrections.

**Why it matters**  
Interior regularity is driven by exterior tails, so there should be a sharp threshold law.

**Completion criteria**  
A complete answer must prove both directions of the threshold and exhibit sharpness by examples or counterexamples.

**Implications if solved**  
Would turn SCC for Kerr into a threshold phenomenon tied directly to exterior decay.

---

## K-106 — Genericity of lower bounds for linearized-gravity interior instability

**Cluster:** Interior / SCC  
**Status:** Open  

**Statement**  
Prove that the nontrivial lower-bound assumptions appearing in linearized-gravity blue-shift instability results are generic for exterior initial data.

**Math required**  
Linearized-gravity scattering; horizon charges; genericity arguments in infinite-dimensional data spaces.

**Why it matters**  
Instability theorems are strongest when their hypotheses are shown to hold for open dense or full-measure sets of data.

**Completion criteria**  
A complete answer must specify the data topology and prove generic nonvanishing of the instability-triggering quantity.

**Implications if solved**  
Would turn conditional interior blow-up statements into genuinely generic ones.

---

## K-107 — Scattering map to the Cauchy horizon for linearized gravity

**Cluster:** Interior / SCC  
**Status:** Partial  

**Statement**  
Construct a precise scattering map from exterior or horizon data to asymptotic data at the Kerr Cauchy horizon for gravitational perturbations.

**Math required**  
Teukolsky separation; physical-space asymptotics; scattering operators in non-globally-hyperbolic regions; gauge reconstruction.

**Why it matters**  
The Cauchy horizon is best understood through a precise data-to-asymptotics map.

**Completion criteria**  
A complete answer must define the map in explicit norms and prove sharp asymptotic formulas, including generic leading coefficients.

**Implications if solved**  
Would clarify how exterior information is reprocessed by the blue-shift region.

---

## K-108 — Strong Cosmic Censorship in rotating Λ>0 backgrounds

**Cluster:** Interior / SCC  
**Status:** Conditional  

**Statement**  
Determine the correct SCC threshold for Kerr–de Sitter or Kerr–Newman–de Sitter, especially near extremality, where quasinormal-mode decay may compete with blue-shift.

**Math required**  
Spectral-gap estimates; de Sitter horizon boundary conditions; Sobolev regularity at the Cauchy horizon; coupled gravito-electromagnetic systems.

**Why it matters**  
Positive cosmological constant changes both decay and interior amplification, so SCC can look different than in the asymptotically flat case.

**Completion criteria**  
A complete answer must connect spectral decay rates to extension regularity and prove either violation or restoration of SCC in a stated class.

**Implications if solved**  
Would clarify one of the most delicate modern versions of SCC.

---

## K-109 — Near-extremal interior scaling laws

**Cluster:** Interior / SCC  
**Status:** Open  

**Statement**  
Find universal scaling relations for interior blow-up, weak singularity structure, and regularity thresholds as the Kerr spin approaches extremality.

**Math required**  
Matched asymptotics between throat and bulk interior; scaling analysis in ε=1−|a|/M; uniform energy estimates.

**Why it matters**  
Near-extremal interiors are where ordinary blue-shift theory meets extremal degeneracy.

**Completion criteria**  
A complete answer must quantify how the relevant norms or exponents depend on ε and identify any limiting profile.

**Implications if solved**  
Would connect interior SCC with extremal black-hole theory.

---

## K-110 — Bifurcation-sphere stability and full interior series completion

**Cluster:** Interior / SCC  
**Status:** Partial  

**Statement**  
Complete the geometric analysis of the perturbed Kerr interior all the way to the bifurcation sphere and global Cauchy-horizon structure.

**Math required**  
Double-null interior geometry; regularity propagation to bifurcate sets; characteristic PDE methods.

**Why it matters**  
The interior picture is not complete until the full boundary geometry is understood, not just a local Cauchy-horizon segment.

**Completion criteria**  
A complete answer must classify all future interior boundary pieces and prove regularity statements up to the bifurcation region.

**Implications if solved**  
Would finish the geometric part of the vacuum rotating interior program.

---

## K-111 — Global interior boundary type: null versus spacelike pieces

**Cluster:** Interior / SCC  
**Status:** Open  

**Statement**  
Determine whether generic near-Kerr collapse leads only to a null weak singularity near the Cauchy horizon or also to a spacelike terminal singular boundary.

**Math required**  
Global causal geometry; focusing; continuation/breakdown criteria; mixed null/spacelike boundary analysis.

**Why it matters**  
This is the large-scale geometric version of the SCC problem inside rotating black holes.

**Completion criteria**  
A complete answer must prove existence or absence of each boundary type for a generic class of near-Kerr data.

**Implications if solved**  
Would reveal the global shape of the singular future boundary in rotating collapse.

---

## K-112 — Teukolsky interior asymptotics beyond the current state of the art

**Cluster:** Interior / SCC  
**Status:** Partial  

**Statement**  
Extend precise interior asymptotics to both spin signs, prove genericity of leading coefficients, and reconstruct metric perturbations in a regular gauge suited for SCC.

**Math required**  
Teukolsky equations; mode asymptotics; gauge reconstruction; regular frame analysis at the Cauchy horizon.

**Why it matters**  
Teukolsky asymptotics are currently one of the cleanest windows into gravitational interior instability.

**Completion criteria**  
A complete answer must cover both radiative scalars, reconstruction, and blow-up consequences in metric-level norms.

**Implications if solved**  
Would make the link between spin-field asymptotics and geometric inextendibility much tighter.

---

## K-201 — Nonlinear codimension-1 stability of extremal Kerr with horizon hair

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Prove that a codimension-1 family of perturbations of extremal Kerr stays globally close to an extremal endstate while exhibiting Aretakis-type horizon growth in transversal derivatives.

**Math required**  
Degenerate horizon geometry; conserved charges; nonlinear modulation with reduced parameter freedom; null structure at κ=0.

**Why it matters**  
Extremal Kerr is expected to be stable only in a codimension-1 sense, not in the same way as subextremal Kerr.

**Completion criteria**  
A complete answer must identify the stable manifold, prove global exterior control, describe the final extremal parameters, and quantify the horizon growth.

**Implications if solved**  
Would define the correct nonlinear stability statement for extremal rotating black holes.

---

## K-202 — Full linear theory for extremal Kerr (spin 2)

**Cluster:** Extremal / near-extremal  
**Status:** Partial  

**Statement**  
Develop a complete boundedness, decay, and instability theory for linearized vacuum Einstein perturbations of extremal Kerr.

**Math required**  
Degenerate vector-field method; zero-energy analysis; extremal Teukolsky theory; gauge-invariant reconstruction.

**Why it matters**  
The linear theory is the mandatory first step before any nonlinear extremal theorem.

**Completion criteria**  
A complete answer must separate decay away from the horizon from conserved or growing horizon quantities and handle gauge issues explicitly.

**Implications if solved**  
Would become the linear backbone of extremal Kerr dynamics.

---

## K-203 — Nonlinear fate of Aretakis instability

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Determine whether generic small perturbations of extremal Kerr settle to subextremal Kerr, remain extremal with horizon hair, or develop a stronger nonlinear instability.

**Math required**  
Nonlinear continuation near degenerate horizons; parameter drift; horizon-local blow-up criteria; conserved-charge dynamics.

**Why it matters**  
The key physical question is whether the linear Aretakis effect survives, saturates, or resolves nonlinearly.

**Completion criteria**  
A complete answer must prove one of the possible nonlinear outcomes for a generic class of perturbations and quantify the transition mechanism.

**Implications if solved**  
Would tell us whether extremality is dynamically fragile or structurally persistent.

---

## K-204 — Uniform estimates in the surface-gravity limit κ→0

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Develop estimates for wave and gravitational fields that remain meaningful as the subextremal surface gravity tends to zero.

**Math required**  
Uniform microlocal analysis; two-scale near-horizon asymptotics; replacement for standard redshift positivity.

**Why it matters**  
Every near-extremal problem ultimately runs into constants that blow up as κ→0.

**Completion criteria**  
A complete answer must state explicit κ-dependence in the coercive and decay estimates and identify the limiting operator or geometry.

**Implications if solved**  
Would unify subextremal and extremal analysis instead of treating them as disconnected cases.

---

## K-205 — Rigorous near-horizon scattering theory for NHEK

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Construct a mathematically precise scattering theory for the near-horizon extremal Kerr limit and prove convergence from rescaled near-extremal Kerr dynamics.

**Math required**  
Geometric blow-up limits; near-horizon analysis; scattering on non-asymptotically-flat geometries; matched expansions.

**Why it matters**  
The near-horizon extremal geometry is the natural local model controlling many extremal phenomena.

**Completion criteria**  
A complete answer must prove operator and solution convergence under rescaling and define a genuine scattering theory in the limit geometry.

**Implications if solved**  
Would isolate the intrinsic throat dynamics responsible for extremal instabilities.

---

## K-206 — Extremal interior SCC and Cauchy-horizon regularity

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Determine the interior stability or instability picture for extremal Kerr and identify the correct extendibility threshold across its inner horizon structure.

**Math required**  
Degenerate interior analysis; coupling of horizon and interior asymptotics; extremal transport estimates.

**Why it matters**  
The extremal interior is much less understood than the subextremal one and may not fit the usual weak-null-singularity paradigm.

**Completion criteria**  
A complete answer must specify the relevant extremal horizon geometry, the extension class, and the precise blow-up or continuity mechanism.

**Implications if solved**  
Would complete the extremal analogue of SCC.

---

## K-207 — Extremal tail asymptotics versus conserved charges

**Cluster:** Extremal / near-extremal  
**Status:** Partial  

**Statement**  
Prove sharp late-time asymptotics for waves and spin fields on extremal Kerr in terms of both infinity charges and horizon Aretakis charges.

**Math required**  
Low-frequency asymptotics; time inversion; charge extraction; mode coupling in degenerate horizon settings.

**Why it matters**  
In extremal geometry, the horizon itself stores conserved information that changes the tail law.

**Completion criteria**  
A complete answer must give leading terms, error bounds, and genericity of nonzero coefficients in the exterior and on the horizon.

**Implications if solved**  
Would quantify exactly how extremal tails differ from subextremal Price laws.

---

## K-208 — Near-extremal QNM accumulation and branch-cut structure

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Classify what happens to Kerr quasinormal modes and low-frequency singular structure as the black hole approaches extremality.

**Math required**  
Semiclassical resonance theory; branch-cut analysis; near-throat scaling; non-selfadjoint perturbation theory.

**Why it matters**  
Ringdown behavior near extremality depends sensitively on spectral accumulation and low-energy structure.

**Completion criteria**  
A complete answer must identify resonance trajectories, any limiting continuum or branch phenomena, and the corresponding time-domain consequences.

**Implications if solved**  
Would resolve a major uncertainty in near-extremal black-hole spectroscopy.

---

## K-209 — Codimension and modulation theory for extremal endstates

**Cluster:** Extremal / near-extremal  
**Status:** Open  

**Statement**  
Build a nonlinear stable-manifold/modulation framework showing precisely which perturbations converge to extremal versus subextremal Kerr endstates.

**Math required**  
Invariant manifold theory in PDE; modulation equations; degenerate parameter dynamics; constraint control.

**Why it matters**  
The phrase 'codimension-1 extremal stability' needs a concrete theorem-level dynamical meaning.

**Completion criteria**  
A complete answer must define the stable manifold, prove transversality, and describe the flow off the manifold.

**Implications if solved**  
Would turn the current conjectural picture of extremal dynamics into a structured phase portrait.

---

## K-301 — Global Kerr uniqueness without analyticity

**Cluster:** Rigidity / uniqueness  
**Status:** Partial  

**Statement**  
Prove that any smooth stationary asymptotically flat vacuum black-hole exterior satisfying natural nondegeneracy assumptions is Kerr, without analyticity assumptions.

**Math required**  
Rigidity theory; Carleman unique continuation; stationary reduction; horizon geometry; elliptic-hyperbolic coupled systems.

**Why it matters**  
This is the stationary counterpart to the dynamical Kerr stability problem.

**Completion criteria**  
A complete answer must state a sharp hypothesis set and prove a global isometry to a Kerr exterior.

**Implications if solved**  
Would finish the classical uniqueness story in the physically natural smooth category.

---

## K-302 — Rigidity for extremal horizons

**Cluster:** Rigidity / uniqueness  
**Status:** Open  

**Statement**  
Extend black-hole rigidity and axisymmetry results to extremal stationary horizons where nondegeneracy assumptions fail.

**Math required**  
Degenerate horizon geometry; near-horizon expansion; unique continuation in degenerate settings; Killing field extension.

**Why it matters**  
Extremal horizons fall outside some of the standard rigidity machinery.

**Completion criteria**  
A complete answer must prove the existence of the needed symmetry or identify a counterexample under natural hypotheses.

**Implications if solved**  
Would clarify whether extremal stationary black holes are as rigid as their nonextremal counterparts.

---

## K-303 — Quantitative Kerr characterization via the Mars–Simon tensor

**Cluster:** Rigidity / uniqueness  
**Status:** Partial  

**Statement**  
Turn the invariant characterization of Kerr by vanishing Mars–Simon tensor into a stable quantitative theorem with explicit constants.

**Math required**  
Invariant tensors; stationary Einstein equations; elliptic estimates; quantitative rigidity.

**Why it matters**  
An exact characterization is powerful, but a stability theorem needs quantitative control.

**Completion criteria**  
A complete answer must bound distance to Kerr in terms of an explicit norm of the Mars–Simon tensor and recover the nearby parameters effectively.

**Implications if solved**  
Would produce a practical near-Kerr recognition theorem.

---

## K-304 — Near-Kerr implies Kerr with computable constants

**Cluster:** Rigidity / uniqueness  
**Status:** Open  

**Statement**  
Upgrade perturbative uniqueness theorems near Kerr so that the hypotheses are checkable geometric inequalities with explicit constants.

**Math required**  
Perturbative uniqueness; unique continuation; invariant boundary data; effective estimates.

**Why it matters**  
Current near-Kerr rigidity results are often too implicit for direct geometric use.

**Completion criteria**  
A complete answer must state finite, computable conditions implying exact Kerrness and give quantitative parameter control.

**Implications if solved**  
Would make rigidity much more usable for both analysis and numerical relativity.

---

## K-305 — Kerr characterization from horizon intrinsic data

**Cluster:** Rigidity / uniqueness  
**Status:** Partial  

**Statement**  
Find minimal intrinsic conditions on a horizon cross-section that force the ambient vacuum spacetime to be locally Kerr.

**Math required**  
Isolated-horizon formalism; Petrov type D conditions; geometric PDE on two-spheres; local-to-global extension.

**Why it matters**  
This asks how much of Kerr is encoded directly on the horizon.

**Completion criteria**  
A complete answer must identify intrinsic horizon data and prove a local or global reconstruction theorem to Kerr.

**Implications if solved**  
Would give a horizon-based recognition principle for the Kerr geometry.

---

## K-306 — Hidden symmetries under perturbation

**Cluster:** Rigidity / uniqueness  
**Status:** Open  

**Statement**  
Determine whether near-Kerr spacetimes admit robust approximate hidden symmetries strong enough to reproduce useful Carter-type commutators or conserved quantities.

**Math required**  
Killing tensors and Killing–Yano structures; perturbation theory of integrable systems; commutator algebra for PDE estimates.

**Why it matters**  
Kerr owes much of its analytic tractability to hidden symmetry and separability.

**Completion criteria**  
A complete answer must either construct approximate symmetry operators with usable error control or prove a no-go theorem.

**Implications if solved**  
Would reveal whether Kerr’s special integrable structure survives in a useful approximate sense under perturbation.

---

## K-307 — Photon-region and trapping stability in dynamical near-Kerr spacetimes

**Cluster:** Rigidity / uniqueness  
**Status:** Open  

**Statement**  
Show that the normally hyperbolic trapped set of Kerr persists, in a quantitatively useful sense, under dynamical perturbations compatible with nonlinear stability.

**Math required**  
Dynamical systems near trapped sets; semiclassical propagation; microlocal resolvent estimates; time-dependent geometry.

**Why it matters**  
Trapping is one of the main analytic obstacles in every decay estimate on Kerr.

**Completion criteria**  
A complete answer must prove persistence of the trapped structure and derive Morawetz or resolvent consequences from it.

**Implications if solved**  
Would provide a geometric backbone for robust decay theory on dynamical near-Kerr backgrounds.

---

## K-308 — Rigidity and uniqueness with matter: full Kerr–Newman regime

**Cluster:** Rigidity / uniqueness  
**Status:** Partial  

**Statement**  
Prove the full stationary uniqueness and perturbative rigidity theory for Kerr–Newman without smallness assumptions.

**Math required**  
Einstein–Maxwell stationary reduction; coupled invariant tensors; horizon regularity; unique continuation.

**Why it matters**  
Kerr–Newman is the natural charged rotating family, but its full rigidity theory is still not as complete as one would like.

**Completion criteria**  
A complete answer must characterize the full stationary family under natural hypotheses and support the coupled dynamical theory.

**Implications if solved**  
Would unify the stationary Einstein–Maxwell black-hole classification.

---

## K-401 — QNM completeness for Kerr ringdown expansions

**Cluster:** Spectral / scattering  
**Status:** Open  

**Statement**  
Prove or refute a mathematically precise completeness statement for Kerr quasinormal modes plus tails in late-time expansions of wave or gravitational fields.

**Math required**  
Meromorphic continuation of resolvents; contour deformation; branch-cut analysis; asymptotic expansions for non-selfadjoint operators.

**Why it matters**  
This is the clean mathematical version of the folklore claim that ringdown is 'a sum of QNMs'.

**Completion criteria**  
A complete answer must define the function space, the notion of completeness or asymptotic completeness, and the tail remainder precisely.

**Implications if solved**  
Would settle one of the central structural questions behind black-hole spectroscopy.

---

## K-402 — Nonlinear QNMs from full Einstein evolution

**Cluster:** Spectral / scattering  
**Status:** Partial  

**Statement**  
Derive theorem-level nonlinear ringdown expansions directly from near-Kerr Einstein dynamics, including quadratic or higher corrections to linear QNM behavior.

**Math required**  
Second-order perturbation theory; nonlinear normal forms; matched asymptotics; control of nonlinear waveform remainders.

**Why it matters**  
Observational ringdown analysis increasingly depends on knowing when linear mode models are justified and when nonlinear corrections matter.

**Completion criteria**  
A complete answer must bound the difference between the full Einstein waveform and a stated nonlinear QNM model over an explicit time interval.

**Implications if solved**  
Would bridge rigorous PDE theory and high-precision black-hole spectroscopy.

---

## K-403 — Scattering theory for linearized gravity on Kerr

**Cluster:** Spectral / scattering  
**Status:** Partial  

**Statement**  
Construct a complete gauge-invariant scattering theory for linearized vacuum Einstein perturbations on Kerr, paralleling the scalar-wave case.

**Math required**  
Gauge fixing; Teukolsky-to-metric reconstruction; horizon and infinity radiation fields; asymptotic completeness for constrained systems.

**Why it matters**  
Decay results are stronger when organized into a full scattering theory.

**Completion criteria**  
A complete answer must define the scattering states, wave operators, and asymptotic completeness modulo stationary/gauge modes.

**Implications if solved**  
Would give the definitive linearized-gravity input for both exterior stability and interior genericity problems.

---

## K-404 — Zero-frequency structure and tail universality

**Cluster:** Spectral / scattering  
**Status:** Partial  

**Statement**  
Relate the low-energy resolvent structure of Kerr operators to universal late-time tail laws, including logarithmic singularities and their coefficients.

**Math required**  
Low-energy microlocal analysis; Tauberian arguments; asymptotic inversion of Laplace/Fourier transforms.

**Why it matters**  
The tail law is a spectral statement in disguise.

**Completion criteria**  
A complete answer must provide explicit resolvent expansions and derive the corresponding time-domain asymptotics with sharp remainders.

**Implications if solved**  
Would unify QNM language and Price-law language in a single framework.

---

## K-405 — Inverse scattering for Kerr parameters

**Cluster:** Spectral / scattering  
**Status:** Open  

**Statement**  
Determine whether scattering data for a natural field equation uniquely and stably determine the Kerr mass and spin.

**Math required**  
Inverse scattering; geometric optics; spectral invariants; uniqueness and stability estimates for parameter recovery.

**Why it matters**  
The forward scattering map on Kerr is rich enough that one expects inverse geometric information to be hidden in it.

**Completion criteria**  
A complete answer must specify the data set, prove uniqueness of (M,a), and give quantitative stability estimates.

**Implications if solved**  
Would turn black-hole scattering into a geometric inverse problem with direct interpretive value.

---

## K-406 — Spectral stability and pseudospectrum of Kerr QNMs

**Cluster:** Spectral / scattering  
**Status:** Open  

**Statement**  
Quantify how Kerr resonances and pseudospectra move under small perturbations of the geometry or operator and identify transient-growth mechanisms associated with non-normality.

**Math required**  
Pseudospectral theory; non-selfadjoint semiclassics; resolvent norm growth; perturbation of resonances.

**Why it matters**  
QNMs are not enough by themselves if non-normal transient amplification dominates some time windows.

**Completion criteria**  
A complete answer must give either stability theorems or explicit instability mechanisms for resonance motion and pseudospectral growth under a stated perturbation class.

**Implications if solved**  
Would sharpen the mathematical meaning of mode stability in non-selfadjoint black-hole problems.

---

## K-407 — QNM excitation factors and universality theorems

**Cluster:** Spectral / scattering  
**Status:** Open  

**Statement**  
Prove rigorous bounds and genericity results for how strongly specific Kerr quasinormal modes are excited by broad classes of initial data.

**Math required**  
Green-function residues; asymptotics of radial and angular mode solutions; contour methods; genericity in data spaces.

**Why it matters**  
Even if modes exist, one still needs to know which ones are actually visible for generic perturbations.

**Completion criteria**  
A complete answer must bound excitation coefficients in terms of initial-data norms and prove generic nonzero excitation for specified mode families.

**Implications if solved**  
Would make the interpretive link between mathematical modes and observed ringdown structure much sharper.

---

## Recommended page structure inside Notion

For the cleanest workspace, split this archive into:
1. **Landing page** — overview, reading guide, flagship problems
2. **Problem database** — one entry per problem with filters and tags
3. **Reference library** — core papers grouped by exterior, interior, extremal, rigidity, spectral
4. **Research log** — status notes, partial progress, toy models, links to papers or proofs

## Three flagship problems to pin at the top
- **K-001** Full nonlinear stability of subextremal Kerr
- **K-101** Strong Cosmic Censorship threshold for Kerr interiors
- **K-201** Nonlinear codimension-1 stability of extremal Kerr

## Short note on status labels
- **Open** = no theorem in the stated form is currently known
- **Partial** = important special cases, reductions, or adjacent results exist
- **Conditional** = the problem is reduced to a specific missing input or threshold theorem
