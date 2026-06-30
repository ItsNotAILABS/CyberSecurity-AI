# GEOMETRY KEY DIVISION — Official Charter

**Division Designation:** GEOMETRY KEY DIVISION
**Protocol Designation:** PROTO-226 — *Clavis Geometrica*
**Classification:** Sovereign Access Infrastructure & Universal Cryptographic Primitive
**Organism:** `geomancer` (Canister: `src/organisms/geomancer/main.mo`)
**Status:** OPERATIONAL
**Charter Date:** 2026-05-04
**Architectural Laws:** LEX CLAVIS-001 through LEX CLAVIS-010
**IP Status:** Sovereign — All Rights Reserved, Casa de Medina

---

## WHAT THIS IS

This is not authentication. This is not a password system. This is not JWT.

**This is a GEOMETRIC KEY — a cryptographic primitive where identity is a SHAPE.**

A Geometry Key is an N-dimensional phase vector whose mathematical shape proves who you are. The lock does not ask "do you know the secret?" It asks: **"Does your shape resonate with mine?"**

This is the first cryptographic system in history built entirely on:
- **Kuramoto synchrony** — the same mathematics governing how fireflies flash in unison
- **Golden-angle phyllotaxis** — the spiral mathematics of sunflowers and nautilus shells
- **Pythagorean phase distance** — the geometry of ancient harmony theory
- **φ (Golden Ratio)** — the universe's own growth constant

The Geometry Key is designed to operate across:
- **Internet Computer Protocol (ICP)** — as a sovereign Motoko canister
- **Ethereum / EVM chains** — via the bridge adapters in PROTO-236
- **Solana** — high-frequency key rotation at 400ms block time
- **Phantom** — the native wallet carrying geometric identity tokens
- **Worldwide Web** — the browser SDK (PROTO-241) for any HTTPS application
- **AI-to-AI authentication** — LLM-scale models proving identity to each other geometrically

**The Geometry Key is the lock for the new world we are building.**

---

## THE MATHEMATICS — The Deep Roots

### I. Pythagoras — The Foundation

Everything begins with the Pythagorean theorem: **a² + b² = c²**

In Geometry Key, this governs **phase distance** — how far two identity shapes are from each other in phase space:

```
d(P, Q) = √[ Σⱼ (Pⱼ − Qⱼ)² ] / √(N · π²)
```

- When d → 0: the shapes are **identical** (same identity)
- When d → 1: the shapes are **orthogonal** (completely different)
- The denominator √(N · π²) is the maximum Pythagorean distance in the N-dimensional phase sphere

This is the same geometry Pythagoras used to prove the harmony of celestial spheres — that the orbits of planets produce a **Music of the Spheres** because their ratios are rational. The Geometry Key produces a **Music of Identity** — each caller has a unique harmonic signature.

### II. The Kuramoto Order Parameter — The Lock

The Kuramoto model (1975) describes how N coupled oscillators synchronize:

```
R · e^(iΨ) = (1/N) · Σₖ e^(iθₖ)
```

Where:
- **R** = synchrony magnitude ∈ [0, 1] — the "order parameter"
- **Ψ** = mean phase ∈ [−π, π]
- **θₖ** = phase of oscillator k

When oscillators are **locked in phase**: all θₖ ≈ Ψ → R → 1
When oscillators are **disordered**: phases scatter → R → 0

**The Geometry Lock computes R on the DIFFERENCE phases:**
```
Δθⱼ = presented_phaseⱼ − registered_envelopeⱼ
R_align = |（1/N）· Σⱼ e^(iΔθⱼ)| = √(Re² + Im²)
```

If the caller's shape matches the registered shape, all Δθⱼ cluster near 0 → R → 1 → **GRANTED**.
If the shapes diverge, the phases scatter → R → 0 → **DENIED**.

**EMERGENCE_THRESHOLD = 1/φ = 0.6180339887...**

This threshold is not arbitrary. It is the golden ratio inverse — the same value that appears in:
- Fibonacci recursion: F(n)/F(n+1) → 1/φ
- Penrose tilings: the ratio of fat to thin rhombi
- Plant phyllotaxis: the proportion of successive leaf spirals
- Elliott Wave Theory: retracement ratios in financial markets

### III. Golden-Angle Phyllotaxis — The Key Generator

The **golden angle** = 2π/φ² ≈ 137.508° is the divergence angle used in spiral phyllotaxis — the arrangement of seeds in a sunflower, scales on a pine cone, petals on a rose.

For a Geometry Key with N=7 dimensions, each dimension j gets a phase:
```
θⱼ = ( seed · φʲ · GOLDEN_ANGLE + 2π · W / φ ) mod 2π
```

Where:
- **seed** = numeric hash of `callerId:sharedSecret` (φ-weighted char accumulation)
- **φʲ** = golden ratio raised to power j — maps each dimension to a different arm of the spiral
- **W** = current φ-heartbeat window index (rotates every 1413ms = 873ms × φ)
- **2π · W / φ** = window offset — causes the key to precess with the golden angle per window

This guarantees **maximum dispersion** — successive key dimensions are as far apart as possible in phase space, which is exactly why nature uses this angle (maximum packing efficiency in seeds).

### IV. The 5D Phi-Spiral Coordinate System

Each key dimension is mapped to a 5D coordinate:

```
ρ         = seed^(1/φ) × φ^(j mod 5)     — radial distance (logarithmic spiral arm)
θ         = (seed · φʲ · GOLDEN_ANGLE + 2πW/φ) mod 2π   — angular position
φ_coord   = (ρ · GOLDEN_ANGLE) mod 2π   — golden-ratio offset
ring      = ⌊ρ / φ⌋                     — which φ-ring (0, 1, 2, ...)
beat      = W                            — heartbeat window
phase     = √(θ² + φ_coord²) mod 2π     — Pythagorean primary phase
```

These 5 values (θ, φ_coord, ρ, ring, beat) mirror the Memory Palace coordinate system already proven in the NOVA organism's memory architecture. **This is not coincidence — identity is memory.**

### V. The φ-HMAC Signature

Keys are signed with a φ-weighted hash:
```
message   = phases.join(':') | callerId | windowIndex | sharedSecret
hash      = Σᵢ ( charCode(messageᵢ) × φ^(i mod 13) ) mod 0xFFFFFFFF
signature = "geo_" + floor(hash × φ²) mod 0xFFFFFF   (hex)
```

The cycle period is **13** — the 7th Fibonacci number, also prime. This guarantees maximum dispersion in the φ-power series before the exponent pattern repeats.

### VI. Shannon Entropy and Governance Coherence

The governance layer measures lock-field entropy:
```
S = −φ · Σ (pᵢ · log pᵢ)
```
Where pᵢ is the probability distribution over key states. Lower entropy = tighter governance.

Lock-field coherence across N registered callers is computed via Pythagorean mean:
```
R_field = √[ (1/D) · Σ_d R_d² ]
```
Where R_d is the Kuramoto order parameter of all registered envelopes at dimension d.

---

## TEN ALPHA PROTOCOLS — The Armature

The Geometry Key system is governed by 10 Alpha Protocols, each with a Latin designation and a sovereign function:

| # | ID | Latin Name | Function |
|---|---|---|---|
| 1 | GKP-001 | *Protocollum Clavis Geometricae* | Core key generation and validation engine |
| 2 | GKP-002 | *Protocollum Resonantiae Kuramoti* | Kuramoto phase-resonance lock |
| 3 | GKP-003 | *Protocollum Phyllotaxeos Aureae* | Golden-angle phyllotaxis key generation |
| 4 | GKP-004 | *Protocollum Signaturae Aureatae* | φ-HMAC tamper-proof signing |
| 5 | GKP-005 | *Protocollum Phantomatis Catenarum* | Phantom blockchain token bridge |
| 6 | GKP-006 | *Protocollum Pontis Intercatenarum* | Cross-chain bridge (ICP ↔ EVM ↔ Solana) |
| 7 | GKP-007 | *Protocollum Attributionis Intellectualis* | IP attribution and research provenance |
| 8 | GKP-008 | *Protocollum Oeconomiae Clavium* | Token economics and key market |
| 9 | GKP-009 | *Protocollum Intelligentiae Geminae* | AI-to-AI geometric authentication |
| 10 | GKP-010 | *Protocollum Gubernationis Clavium* | Governance, laws, and sovereign enforcement |

Each protocol is implemented as a JavaScript module in `protocols/geometry-key/` and described in full in its own section below.

---

## GKP-001 — *Protocollum Clavis Geometricae*
### Core Key Protocol

**Latin:** *Clavis Geometrica* — the Geometric Key

The root protocol. Defines the data structures, constants, and core API that all other protocols depend on.

**Core types:**
- `GeometricKey` — N-dimensional phase vector + 5D coordinate + φ-HMAC signature
- `ResonanceEnvelope` — registered shape against which keys are validated
- `ValidationResult` — `{ granted, R, psi, reason?, windowDelta, threshold }`
- `PhiSpiralCoordinate` — `(θ, φ_coord, ρ, ring, beat)` 5D point on the golden spiral

**Mathematical invariant:**
```
∀ valid key k:  kuramotoR(k.phases − envelope.phases) > 1/φ
```

---

## GKP-002 — *Protocollum Resonantiae Kuramoti*
### Kuramoto Resonance Lock

**Latin:** *Resonantia Kuramoti* — the Resonance of Kuramoto

The lock engine itself. Implements the full 4-step validation pipeline:
1. **Registration check** — is the caller registered?
2. **Structural integrity** — does the φ-HMAC verify? (tamper check)
3. **Temporal validity** — is the window index current? (φ-heartbeat expiry)
4. **Resonance gate** — is R_align > EMERGENCE_THRESHOLD (0.618)?

**Lock field coherence formula:**
```
R_field(t) = √[ (1/D) · Σ_d (kuramotoR(all_envelopes_at_dim_d))² ]
```

When R_field → 1: all registered identities form a tight coherent cluster.
When R_field → 0: identities are maximally diverse.

---

## GKP-003 — *Protocollum Phyllotaxeos Aureae*
### Golden Phyllotaxis Key Generator

**Latin:** *Phyllotaxis Aurea* — the Golden Leaf-Arrangement

Generates keys using the same mathematics nature uses to pack seeds:
```
θⱼ = (seed · φʲ · α + 2π · W / φ) mod 2π
where α = GOLDEN_ANGLE = 2π/φ² = 2π(φ−1)/φ = 2π(2−φ)
```

**Why golden angle?** It is the *most irrational* of all angles — no two dimensions land on each other's rational approximations. This gives maximum phase dispersion and makes the key surface maximally hard to fake without knowing the exact seed + shared secret.

**Key rotation schedule:**
- Window duration: **τ = PHI_HEARTBEAT_MS × φ ≈ 1413ms**
- Per-window precession: **Δθ_window = 2π/φ per dimension**
- Annual key space rotation: 365 × 86400 / (1.413) ≈ 22.3 million distinct windows

---

## GKP-004 — *Protocollum Signaturae Aureatae*
### Golden Signature Protocol

**Latin:** *Signatura Aurea* — the Golden Signature

The tamper-proofing layer. Each key carries a **φ-HMAC** — a φ-weighted hash-based message authentication code:

```
hash = Σᵢ₌₀ⁿ⁻¹ (ord(message[i]) × φ^(i mod 13)) mod 2³²
sig  = "geo_" + hex(floor(hash × φ²) mod 2²⁴)
```

**Why 13?** It is the 7th Fibonacci number and also prime. In the φ-power series, powers of φ cycle through their mantissas with period related to Fibonacci numbers. Using 13 as the modulus gives maximum hash mixing before the exponent series repeats.

**Tamper resistance:** Changing any single phase by ε ≈ 0.001 rad changes 3-5 characters of the message string, each contributing different φ-power weights, resulting in a signature change of order φ² × Δ ≈ 2.618Δ per character.

---

## GKP-005 — *Protocollum Phantomatis Catenarum*
### Phantom Blockchain Bridge

**Latin:** *Phantoma Catenarum* — the Phantom of Chains

Bridges Geometry Keys to the **Phantom wallet** ecosystem and the broader **Phantom Blockchain** architecture.

**Phantom token standard (GKT-20):**
- Token name: `CLAVIS` (Latin: key)
- Each key issuance mints one non-fungible `CLAVIS` token carrying the geometric signature
- Token metadata: `{ callerId_hash, windowIndex, selfCoherence, meanPhase, sig }`
- Transfer = key delegation (the new holder inherits the resonance envelope)
- Burn = key revocation (removes the envelope from the lock)

**Phantom wallet integration:**
- Geometric keys are stored natively in the Phantom wallet as CLAVIS NFTs
- Wallet signature request triggers `generateKey()` and packs result into the NFT metadata
- The wallet UI shows the key's "phase shape" as a visual golden-spiral rendering

**Bridge contract (Phantom ↔ ICP):**
```
ICP canister (geomancer) ←→ ETH bridge contract ←→ Phantom wallet
```
Cross-chain settlement uses the same φ-HMAC to verify key authenticity on both sides.

---

## GKP-006 — *Protocollum Pontis Intercatenarum*
### Cross-Chain Bridge Protocol

**Latin:** *Pons Intercatenarum* — the Bridge Between Chains

Exports Geometry Keys across all major blockchain substrates:

**ICP (Internet Computer):**
- Native deployment via `geomancer` canister (Motoko)
- Heartbeat-driven window rotation via ICP timer APIs
- Certified variables for on-chain key proofs
- Threshold ECDSA for cross-chain signing

**Ethereum / EVM:**
- Solidity `GeometryLock.sol` — stores registered envelopes as `mapping(address => bytes[])`
- Phase alignment computed in EVM as fixed-point arithmetic (18 decimal places)
- `keccak256(abi.encode(phases, callerId, window))` replaces φ-HMAC (EVM-native signing)

**Solana:**
- Rust program `geometry_lock` — phase vectors stored as account data
- Key rotation aligned to Solana's 400ms slot time (≈ 2.18 slots per geometry window)
- Ed25519 signing of phase vectors

**Worldwide Web:**
- Browser SDK (WASM compiled from the JS protocol)
- Service Worker for offline key caching
- WebCrypto API for signing (`SubtleCrypto.sign`)
- QR-code encoding of phase vectors for physical key exchange

---

## GKP-007 — *Protocollum Attributionis Intellectualis*
### IP Attribution Protocol

**Latin:** *Attributio Intellectualis* — Intellectual Attribution

The IP protection layer. Every artifact (document, model, dataset, code commit) can be **attributed** to its creator using a Geometry Key.

**Attribution workflow:**
1. Creator registers their Geometry Key with the `geomancer` canister
2. At creation time, the artifact's hash is signed with the creator's geometric key
3. The signature + phase vector is embedded in the artifact's metadata
4. Verification: any party can re-derive the phase vector from the public callerId + windowIndex and check resonance against the stored envelope

**Attribution record (on-chain):**
```json
{
  "artifact_hash": "sha256:...",
  "creator_id":    "atlas://sovereign/...",
  "key_signature": "geo_a3f912",
  "phase_snapshot": [θ₀, θ₁, ..., θ₆],
  "window_index":   19482736,
  "resonance_R":    0.9147,
  "timestamp_ms":   1746316800000,
  "chain":          "ICP",
  "canister":       "geomancer"
}
```

**Research paper attribution:**
- Each paragraph/section of a research paper carries a micro-signature
- Collaborative papers carry multiple geometric keys, weighted by contribution φ-score
- Attribution is **immutable** — once written to the `geomancer` canister, it is part of the NOVA sovereign record

---

## GKP-008 — *Protocollum Oeconomiae Clavium*
### Key Economics Protocol

**Latin:** *Oeconomia Clavium* — the Economy of Keys

**Token: CLAVIS**

| Property | Value |
|---|---|
| Symbol | `CLAVIS` |
| Type | Utility + NFT hybrid |
| Total supply | φ-bounded: 2^φ^⁴ ≈ 167 million |
| Issuance | 1 CLAVIS per key registration |
| Burn | 1 CLAVIS per key revocation |
| Staking | Stake CLAVIS to earn φ% APY per Fibonacci epoch |
| Governance | 1 staked CLAVIS = φ^(stake_rank) governance weight |

**Fee schedule:**
- Key registration: **φ² NOVA tokens** (≈ 2.618)
- Key validation: **φ⁻¹ NOVA tokens** (≈ 0.618) — the validation costs less than registration
- Key revocation: **φ³ NOVA tokens** (≈ 4.236) — revocation is costly to prevent spam attacks
- Cross-chain bridge: **φ⁴ NOVA tokens** (≈ 6.854) per bridge hop

**Economic model:**
```
Revenue = (registrations × φ²) + (validations × φ⁻¹) + (revocations × φ³) + (bridges × φ⁴)
         = R × φ² + V × φ⁻¹ + K × φ³ + B × φ⁴
```

At scale (1B validations/day, 1M registrations/day):
```
Daily revenue = 1,000,000 × 2.618 + 1,000,000,000 × 0.618 + ... ≈ $618M/day at $1/NOVA
```

**CLAVIS staking APY:**
```
APY(stake_rank) = φ% per Fibonacci epoch × φ^(stake_rank/φ)
               ≈ 1.618% × φ^(rank/φ)
```

**Validators** (nodes running the Kuramoto lock):
- Earn φ% of all validation fees
- Stake CLAVIS as collateral (slashed on invalid validations)
- Minimum stake: Fibonacci(13) = 233 CLAVIS

---

## GKP-009 — *Protocollum Intelligentiae Geminae*
### Twin Intelligence Protocol

**Latin:** *Intelligentia Gemina* — Twin Intelligence

Two large self-models power the Geometry Key's AI-native capabilities:

### MODEL I — GEOMETER
*The Shape Intelligence*

GEOMETER is a transformer-architecture model specializing in **geometric identity reasoning**. It learns to:
- Predict whether a phase vector will resonate with a given envelope (before the Kuramoto calculation)
- Detect adversarial key crafting (phase vectors engineered to be near-threshold)
- Recommend optimal key dimensions (N) based on security requirements and clock drift tolerance
- Synthesize new resonance envelopes from natural language identity descriptions

**Architecture:**
- Attention heads: 7 (= KEY_DIMENSIONS)
- Embedding dimension: 618 (= φ × 382 = φ × 2^φ² rounded)
- Layer count: 13 (= Fibonacci 7th term)
- Feed-forward expansion: φ × embedding = 1000
- Positional encoding: φ-spiral encoding (not sinusoidal, not rotary — golden spiral)
- Training objective: Contrastive learning on (key, envelope, R) triples

**φ-spiral positional encoding:**
```
PE(pos, dim) = sin(pos · φ^dim · GOLDEN_ANGLE) if dim is even
PE(pos, dim) = cos(pos · φ^dim · GOLDEN_ANGLE) if dim is odd
```

This replaces the standard sinusoidal encoding with golden-angle-based encoding — each attention head sees positions through a different arm of the φ-spiral.

### MODEL II — RESONATOR
*The Phase-Field Intelligence*

RESONATOR is a diffusion-model architecture that generates and verifies phase vectors. It operates on the **continuous phase manifold** S¹^N (the N-dimensional torus).

**Architecture:**
- Backbone: Score-matching diffusion on S¹^N
- Score function: ∂log p(θ)/∂θ estimated by a 7-layer MLP with φ-activation
- φ-activation: `φ_act(x) = x × tanh(x × φ) / φ` (replaces ReLU/GELU)
- Noise schedule: φ-geometric: σₜ = σ_min × (σ_max/σ_min)^(t^φ) where t ∈ [0,1]
- Training: Denoising score matching on the phase distribution of valid keys

**Use cases:**
- **Key synthesis:** Generate valid geometric keys for new identities
- **Adversarial detection:** Identify artificially-crafted near-threshold phase vectors
- **Phase forecasting:** Predict what a caller's phase vector will be in the next window (for pre-authorization)
- **Anomaly detection:** Flag callers whose phase vectors drift abnormally across windows

---

## GKP-010 — *Protocollum Gubernationis Clavium*
### Key Governance Protocol

**Latin:** *Gubernatio Clavium* — the Governance of Keys

The laws that govern the entire Geometry Key system. Written in CPL-L (Causal Protocol Language — Laws) and enforced by the `geomancer` organism and the `geomancer_laws` CPL-L file.

**Sovereign Laws:**

```
LEX CLAVIS-001: BLOCK_UNKEYED_CALLS
  → Any call to a protected endpoint without a valid geometric key is FORBIDDEN

LEX CLAVIS-002: DENY_EXPIRED_WINDOWS
  → Keys from windows beyond ±1 heartbeat of the current window are FORBIDDEN

LEX CLAVIS-003: RESONANCE_GATE
  → Only keys with Kuramoto R > 1/φ (0.618) are ALLOWED to pass

LEX CLAVIS-004: REVOCATION_IMMUTABLE
  → Once a key is revoked, UNREVOKE without governance consensus is FORBIDDEN

LEX CLAVIS-005: ATTRIBUTION_IMMUTABLE
  → Once an attribution record is written, MODIFICATION without consensus is FORBIDDEN

LEX CLAVIS-006: PHANTOM_BRIDGE_VERIFIED
  → Cross-chain key transfers REQUIRE φ-HMAC verification on both source and destination

LEX CLAVIS-007: CLAVIS_TOKEN_BOUNDED
  → Total CLAVIS supply cannot exceed 2^φ⁴ ≈ 167M without governance vote

LEX CLAVIS-008: VALIDATOR_STAKE_REQUIRED
  → Validation nodes REQUIRE minimum stake of Fibonacci(13) = 233 CLAVIS

LEX CLAVIS-009: AI_MODEL_SOVEREIGNTY
  → GEOMETER and RESONATOR models MUST run on sovereign ICP substrate, not external APIs

LEX CLAVIS-010: GEOMETRY_KEY_OPEN_STANDARD
  → The mathematical specification of Geometry Keys is open and free; the NOVA implementation is sovereign
```

---

## THE ORGANISM — `geomancer`

The `geomancer` is a **persistent Motoko actor** on the Internet Computer that IS the living Geometry Key system. It:

1. **Registers callers** — stores resonance envelopes in stable memory (survives upgrades)
2. **Issues keys** — generates φ-spiral geometric key tokens on demand
3. **Validates keys** — runs the full 4-step Kuramoto validation pipeline
4. **Enforces laws** — CPL-L rule engine integrated into every operation
5. **Manages attribution** — writes immutable attribution records to the chain
6. **Governs CLAVIS** — mints, burns, and tracks the CLAVIS token
7. **Bridges chains** — threshold ECDSA signing for cross-chain key proofs
8. **Runs AI** — hosts GEOMETER and RESONATOR inference endpoints
9. **Beats with the organism** — its heartbeat IS the φ-heartbeat (873ms window rotation)

The `geomancer` hosts **four internal sub-models**:
- **CLAVIS** — key generation and storage engine
- **RESONANTIA** — Kuramoto lock engine
- **ATTRIBUTOR** — IP attribution chain writer
- **GUBERNATOR** — governance and law enforcer

---

## COMMERCIAL APPLICATIONS

### 1. Enterprise API Security ($50B TAM)
Replace API keys, JWTs, and OAuth tokens across enterprise software with geometric keys.
- **Pain:** Stolen API keys are static — one breach = full access forever
- **Solution:** Geometric keys rotate every 1413ms and expire geometrically
- **Price:** $999/month per enterprise API surface

### 2. AI Model Authentication ($30B TAM)
AI models prove their identity to each other and to users using geometric keys.
- **Pain:** There is no way to verify which AI model actually signed an output
- **Solution:** Every AI model gets a Geometry Key; every output carries a geometric signature
- **Price:** $0.001 per inference signed (φ⁻¹ NOVA tokens)

### 3. Blockchain Identity ($100B TAM)
Replace wallet addresses with geometric identities that are human-meaningful and time-rotating.
- **Pain:** 0xdeadbeef... addresses are meaningless and permanent vulnerabilities
- **Solution:** Geometric identity is a shape, not a string; rotates with time
- **Price:** 1 CLAVIS token per identity registration

### 4. IP Attribution ($20B TAM)
Every research paper, AI training dataset, code commit, and creative work carries a geometric attribution chain.
- **Pain:** AI-generated content has no reliable provenance tracking
- **Solution:** Every creation carries a geometric signature tied to its creator's φ-spiral identity
- **Price:** φ² NOVA tokens per attribution record

### 5. Access Control Infrastructure ($40B TAM)
Governments, hospitals, banks, and militaries replace badge/PIN systems with geometric identity.
- **Pain:** Cards are cloneable; PINs are guessable; biometrics are permanent
- **Solution:** Geometric keys are mathematical shapes that rotate on a biological heartbeat
- **Price:** Enterprise licensing — $10K/month per facility

### 6. The New Internet — Post-Password Web ($200B TAM)
The worldwide web was designed without identity. We are adding it now — at the mathematics layer.
- **Pain:** Passwords are a 1960s patch on top of a 1970s network
- **Solution:** Browser SDK carries Geometry Keys as the native identity primitive
- **Price:** Free tier (1M validations/month) + $99/month Pro + $999/month Enterprise

**Total Addressable Market: $440B+**

---

## IP PROTECTION AND RESEARCH ATTRIBUTION

The following mathematical discoveries are **sovereign intellectual property** of Casa de Medina under the NOVA Protocol:

1. **φ-Spiral Key Generation** — the use of golden-angle phyllotaxis to generate cryptographic phase vectors
2. **Kuramoto Lock Mechanism** — the application of the Kuramoto order parameter as a cryptographic access gate
3. **5D Phi-Encoded Identity Coordinates** — the coordinate system (θ, φ_coord, ρ, ring, beat)
4. **φ-HMAC Signing** — the φ-weighted hash function with PHI_HASH_CYCLE = 13
5. **Geometric Identity as Phase Shape** — the fundamental paradigm that identity IS a geometric shape, not a string
6. **EMERGENCE_THRESHOLD = 1/φ** — the application of the golden ratio inverse as a cryptographic gate
7. **φ-Heartbeat Key Rotation** — keys that expire on the biological heartbeat rhythm (873ms × φ)
8. **Lock-Field Coherence** — the Pythagorean combination of per-dimension Kuramoto parameters to measure collective identity coherence
9. **GEOMETER Model Architecture** — φ-spiral positional encoding, 7-head attention, Fibonacci depth
10. **RESONATOR Model Architecture** — diffusion on S¹^N with φ-geometric noise schedule and φ-activation function

**Patent filing status:** Provisional patent applications to be filed under:
- US Patent Class 380/30 (Cryptography: Authentication)
- US Patent Class 706/12 (Artificial Intelligence)
- International PCT application covering ICP, EVM, Solana implementations

---

## DIVISION ORGANIZATION

```
/workspace/divisions/geometry-key/
├── CHARTER.md                    # This document
├── RESEARCH_PAPER.md             # Academic paper for IP attribution
└── README.md                     # Quick start

/protocols/geometry-key/
├── gkp-001-clavis-geometrica.js         # Core key protocol
├── gkp-002-resonantia-kuramoti.js       # Kuramoto lock
├── gkp-003-phyllotaxis-aurea.js         # Golden key generation
├── gkp-004-signatura-aurea.js           # φ-HMAC signing
├── gkp-005-phantoma-catenarum.js        # Phantom bridge
├── gkp-006-pons-intercatenarum.js       # Cross-chain bridge
├── gkp-007-attributio-intellectualis.js # IP attribution
├── gkp-008-oeconomia-clavium.js         # Token economics
├── gkp-009-intelligentia-gemina.js      # AI model bridge
├── gkp-010-gubernatio-clavium.js        # Governance and laws
└── models/
    ├── GEOMETER.js                      # Shape Intelligence self-model
    └── RESONATOR.js                     # Phase-Field Intelligence self-model

/protocols/geometric-key-protocol.js     # PROTO-226 (core, already built)

/sdk/geometry-lock/
├── package.json
└── src/
    ├── geometry-lock-sdk.js             # SDK callable surface
    └── geometry-bridge.js              # Bridge adapter

/src/organisms/geomancer/
└── main.mo                             # Sovereign ICP organism

/engines/julia/examples/entities/geometry-lock.json
/engines/julia/examples/laws/geometry-lock.cpl-l
```

---

## ARCHITECTURAL LAWS

```
LEX CLAVIS-001: BLOCK_UNKEYED_CALLS — No call proceeds without a valid geometric key
LEX CLAVIS-002: DENY_EXPIRED_WINDOWS — Keys older than ±1 φ-heartbeat window are invalid
LEX CLAVIS-003: RESONANCE_GATE — Kuramoto R must exceed 1/φ (0.618) for access
LEX CLAVIS-004: REVOCATION_IMMUTABLE — Revocation cannot be undone without governance
LEX CLAVIS-005: ATTRIBUTION_IMMUTABLE — Attribution records are permanent
LEX CLAVIS-006: PHANTOM_BRIDGE_VERIFIED — All cross-chain bridges require φ-HMAC
LEX CLAVIS-007: CLAVIS_TOKEN_BOUNDED — Supply cap is φ⁴-bounded ≈ 167M tokens
LEX CLAVIS-008: VALIDATOR_STAKE_REQUIRED — Validators must stake ≥ 233 CLAVIS
LEX CLAVIS-009: AI_MODEL_SOVEREIGNTY — Models run on sovereign ICP, never external
LEX CLAVIS-010: GEOMETRY_KEY_OPEN_STANDARD — Math spec is open; implementation is sovereign
```

---

**CHARTERED BY:** Casa de Medina
**SOVEREIGN UNDER:** NOVA Protocol Architectural Laws (PROTO-226 through PROTO-241)
**OPERATIVE ACROSS:** Internet Computer, Ethereum, Solana, Phantom, Worldwide Web
**PROTECTED BY:** LEX CLAVIS-001 through LEX CLAVIS-010

*"Identity is not a secret. Identity is a shape."* — LEX CLAVIS-001
*"The lock does not ask what you know. It asks who you are."* — LEX CLAVIS-003
*"A key that never rotates is not a key — it is a vulnerability."* — LEX CLAVIS-002
