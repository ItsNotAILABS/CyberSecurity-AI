# ══════════════════════════════════════════════════════════════════════════════
# resonance-field.jl — Geometry Lock Resonance Field Engine (Julia Backend)
#
# This is the Julia substrate for the Porta lock organism.
# Julia handles the real-time resonance field computation:
#   - Continuous Kuramoto order parameter tracking
#   - Lock-field coherence monitoring
#   - Phase-space geometry and differential equations
#   - Clifford torus memory field topology
#
# Why Julia?
#   Julia is the correct substrate for continuous mathematics.
#   Kuramoto equations are ordinary differential equations.
#   Phase dynamics are differential geometry on S¹ᴺ.
#   Julia's multiple dispatch and SIMD vectorization make it 10-100x
#   faster than Python for these computations.
#
# Mathematical model:
#   The Kuramoto model is a system of N coupled ODEs:
#     dθᵢ/dt = ωᵢ + (K/N)·Σⱼ sin(θⱼ − θᵢ)
#   The order parameter R measures synchrony:
#     R·e^(iΨ) = (1/N)·Σ e^(iθⱼ)
#
# Casa de Medina — Architectos de Architectura Inteligente
# ══════════════════════════════════════════════════════════════════════════════

module ResonanceField

# ─── Golden Constants ────────────────────────────────────────────────────────

const PHI               = 1.6180339887498948482
const PHI2              = PHI * PHI
const PHI3              = PHI2 * PHI
const PHI4              = PHI3 * PHI
const PHI_INV           = 1.0 / PHI
const GOLDEN_ANGLE      = 2π / PHI2                  # ≈ 2.3999 rad
const TWO_PI            = 2π
const PHI_HEARTBEAT_MS  = 873.0                      # 540 × φ
const WINDOW_DURATION_MS= PHI_HEARTBEAT_MS * PHI     # ≈ 1413ms
const EMERGENCE_THRESHOLD = PHI_INV                  # 0.6180339887
const KEY_DIMENSIONS    = 8                          # 8D phase vectors
const PHI_HASH_CYCLE    = 13                         # Fibonacci 7th, prime

# ─── Kuramoto Mathematics ─────────────────────────────────────────────────────

"""
    kuramoto_R(phases)

Kuramoto order parameter R·e^(iΨ) = (1/N)·Σ e^(iθⱼ).

Returns (R, Ψ) where:
  R = √(re² + im²)    ← Pythagorean theorem in ℂ
  Ψ = atan2(im, re)   ← mean phase
"""
function kuramoto_R(phases::AbstractVector{Float64})::Tuple{Float64, Float64}
    isempty(phases) && return (0.0, 0.0)
    N  = length(phases)
    re = sum(cos, phases) / N
    im = sum(sin, phases) / N
    R  = sqrt(re^2 + im^2)          # Pythagorean: a² + b² = c²
    Ψ  = atan(im, re)
    (R, Ψ)
end


"""
    phase_alignment(phases1, phases2)

Kuramoto R of difference phases: R_align = kuramotoR(phases1 − phases2).
R_align → 1: in resonance.
R_align → 0: orthogonal.
"""
function phase_alignment(p1::AbstractVector{Float64}, p2::AbstractVector{Float64})::Float64
    N    = min(length(p1), length(p2))
    diff = [p1[j] - p2[j] for j ∈ 1:N]
    R, _ = kuramoto_R(diff)
    R
end


"""
    pythagorean_distance(p1, p2)

Normalised Pythagorean distance in N-dim phase space.
d = √[Σ(Pⱼ−Qⱼ)²] / √(N·π²)  ∈ [0,1]
"""
function pythagorean_distance(p1::AbstractVector{Float64}, p2::AbstractVector{Float64})::Float64
    N = min(length(p1), length(p2))
    N == 0 && return 1.0
    sq_sum = sum((p1[j] - p2[j])^2 for j ∈ 1:N)
    sqrt(sq_sum / (N * π^2))
end


# ─── Kuramoto ODE System ──────────────────────────────────────────────────────

"""
    KuramotoSystem

A system of N coupled Kuramoto oscillators with natural frequencies ω
and coupling strength K.

dθᵢ/dt = ωᵢ + (K/N)·Σⱼ sin(θⱼ − θᵢ)
"""
struct KuramotoSystem
    N          :: Int
    ω          :: Vector{Float64}    # natural frequencies
    K          :: Float64            # coupling strength
    K_threshold:: Float64            # K_c = 2/π·g(0) (mean-field critical coupling)

    function KuramotoSystem(N::Int; K::Float64 = PHI, seed::Int = 42)
        # Natural frequencies: φ-scaled around 1/φ
        ω = [PHI_INV + (i - N÷2) * GOLDEN_ANGLE / N for i ∈ 1:N]
        # Critical coupling (mean-field result): K_c = 2/πg(0)
        # For uniform distribution on [-Δω/2, Δω/2]: K_c = 2Δω/π
        Δω        = maximum(ω) - minimum(ω)
        K_threshold = 2Δω / π
        new(N, ω, K, K_threshold)
    end
end


"""
    kuramoto_deriv!(dθ, θ, sys, t)

In-place derivative for the Kuramoto ODE.
dθᵢ/dt = ωᵢ + (K/N)·Σⱼ sin(θⱼ − θᵢ)
"""
function kuramoto_deriv!(dθ::Vector{Float64}, θ::Vector{Float64},
                          sys::KuramotoSystem, t::Float64)
    K = sys.K
    N = sys.N
    ω = sys.ω
    for i ∈ 1:N
        coupling = (K / N) * sum(sin(θ[j] - θ[i]) for j ∈ 1:N)
        dθ[i] = ω[i] + coupling
    end
end


"""
    integrate_euler(sys, θ₀, T, dt)

Simple Euler integration of the Kuramoto ODE.
Returns (θ_final, R_trajectory, Ψ_trajectory).
"""
function integrate_euler(sys::KuramotoSystem, θ₀::Vector{Float64},
                          T::Float64, dt::Float64 = 0.01)
    θ           = copy(θ₀)
    dθ          = zeros(sys.N)
    steps       = round(Int, T / dt)
    R_traj      = zeros(steps)
    Ψ_traj      = zeros(steps)

    for step ∈ 1:steps
        kuramoto_deriv!(dθ, θ, sys, step * dt)
        θ .+= dθ .* dt
        # Wrap to [0, 2π)
        @. θ = mod(θ, TWO_PI)
        R_traj[step], Ψ_traj[step] = kuramoto_R(θ)
    end

    (θ, R_traj, Ψ_traj)
end


# ─── Lock-Field Coherence ─────────────────────────────────────────────────────

"""
    lock_field_coherence(envelopes)

Lock-field coherence across all registered callers.
R_field = √[(1/D)·Σ_d R_d²]   (Pythagorean mean of per-dim Kuramoto Rs)

R_field → 1: tight identity cluster
R_field → 0: maximally diverse callers
"""
function lock_field_coherence(envelopes::Vector{Vector{Float64}})::Tuple{Float64, Float64}
    length(envelopes) < 2 && return (length(envelopes) == 1 ? (1.0, 0.0) : (0.0, 0.0))

    D         = length(envelopes[1])
    sum_R2    = 0.0
    psi_sum   = 0.0

    for d ∈ 1:D
        dim_phases = [e[d] for e ∈ envelopes if d ≤ length(e)]
        R, psi     = kuramoto_R(dim_phases)
        sum_R2    += R^2
        psi_sum   += psi
    end

    R_field   = sqrt(sum_R2 / D)
    psi_field = psi_sum / D
    (R_field, psi_field)
end


# ─── φ-Geometric Noise Schedule ──────────────────────────────────────────────

"""
    phi_sigma(t, σ_min, σ_max)

φ-geometric noise schedule.
σ(t) = σ_min × (σ_max/σ_min)^(t^φ)   t ∈ [0,1]

Used by RESONATOR for phase-field diffusion.
"""
function phi_sigma(t::Float64, σ_min::Float64 = 0.01, σ_max::Float64 = π)::Float64
    σ_min * (σ_max / σ_min)^(t^PHI)
end

"""
    phi_sigma_deriv(t, σ_min, σ_max)

Derivative of the φ-geometric noise schedule.
dσ/dt = σ(t) × log(σ_max/σ_min) × φ × t^(φ−1)
"""
function phi_sigma_deriv(t::Float64, σ_min::Float64 = 0.01, σ_max::Float64 = π)::Float64
    σ = phi_sigma(t, σ_min, σ_max)
    σ * log(σ_max / σ_min) * PHI * max(t, 1e-8)^(PHI - 1)
end


# ─── Clifford Torus Topology ─────────────────────────────────────────────────

"""
    clifford_embed(θ₁, θ₂)

Embed a point (θ₁, θ₂) ∈ S¹ × S¹ into R⁴ via the Clifford torus.
Point = (cos θ₁, sin θ₁, cos θ₂, sin θ₂) / √2

The Clifford torus has:
  - Flat metric (zero Gaussian curvature)
  - Equal principal curvatures (both = 1/√2)
  - Pythagorean geodesic distance: d = √((θ₁_a−θ₁_b)² + (θ₂_a−θ₂_b)²)
"""
function clifford_embed(θ₁::Float64, θ₂::Float64)::NTuple{4, Float64}
    inv_sqrt2 = 1.0 / sqrt(2.0)
    (
        inv_sqrt2 * cos(θ₁),
        inv_sqrt2 * sin(θ₁),
        inv_sqrt2 * cos(θ₂),
        inv_sqrt2 * sin(θ₂),
    )
end

"""
    clifford_distance(θ₁_a, θ₂_a, θ₁_b, θ₂_b)

Geodesic distance on the Clifford torus.
d = √((θ₁_a−θ₁_b)² + (θ₂_a−θ₂_b)²)   (Pythagorean — flat metric)
"""
function clifford_distance(θ₁_a::Float64, θ₂_a::Float64,
                            θ₁_b::Float64, θ₂_b::Float64)::Float64
    sqrt((θ₁_a - θ₁_b)^2 + (θ₂_a - θ₂_b)^2)  # Pythagorean
end


# ─── Solfeggio Frequency Analysis ────────────────────────────────────────────

"""
    solfeggio_resonance(f1_hz, f2_hz)

Resonance between two solfeggio frequencies.
R_sol = |cos(2π × (f1 − f2) × τ)|
where τ = PHI_HEARTBEAT_MS / 1000 seconds
"""
function solfeggio_resonance(f1_hz::Float64, f2_hz::Float64)::Float64
    τ = PHI_HEARTBEAT_MS / 1000.0
    abs(cos(2π * (f1_hz - f2_hz) * τ))
end


"""
    harmonic_ratio(f1_hz, f2_hz)

Pythagorean harmonic interval ratio analysis.
Returns (ratio, log2_ratio, nearest_interval_name).
"""
function harmonic_ratio(f1_hz::Float64, f2_hz::Float64)
    ratio     = f1_hz / f2_hz
    log_ratio = abs(log2(ratio))

    intervals = [
        (0.0,    "Unison"),
        (1.0,    "Octave"),
        (1.585,  "Fifth"),
        (2.0,    "Double Octave"),
        (2.322,  "Fourth"),
        (2.585,  "Major Third"),
    ]

    best_dist     = Inf
    best_interval = "Unknown"
    for (ref, name) ∈ intervals
        d = abs(log_ratio - ref)
        if d < best_dist
            best_dist     = d
            best_interval = name
        end
    end

    harmony = exp(-best_dist * PHI)  # φ-decay from perfect interval
    (ratio, log_ratio, best_interval, harmony)
end


# ─── Phase-Space Geometry ────────────────────────────────────────────────────

"""
    phi_spiral_phase(seed, window_idx, dim)

Golden-angle phyllotaxis phase for a given seed, window, and dimension.
θⱼ = (seed × φʲ × α + 2π × W / φ) mod 2π
"""
function phi_spiral_phase(seed::Float64, window_idx::Int, dim::Int)::Float64
    window_offset = TWO_PI * window_idx / PHI
    mod(seed * PHI^dim * GOLDEN_ANGLE + window_offset, TWO_PI)
end


"""
    generate_phase_vector(seed, window_idx, dims = KEY_DIMENSIONS)

Generate a full φ-spiral phase vector.
"""
function generate_phase_vector(seed::Float64, window_idx::Int,
                                dims::Int = KEY_DIMENSIONS)::Vector{Float64}
    [phi_spiral_phase(seed, window_idx, d) for d ∈ 0:(dims-1)]
end


# ─── Field Health Report ──────────────────────────────────────────────────────

"""
    field_health_report(envelopes, tier_freqs)

Comprehensive field health report.
Returns a NamedTuple with all field metrics.
"""
function field_health_report(envelopes::Vector{Vector{Float64}},
                              tier_freqs::Vector{Float64} = Float64[])
    R_field, Ψ_field = lock_field_coherence(envelopes)
    healthy           = R_field ≥ EMERGENCE_THRESHOLD

    # Per-caller self-coherence
    self_Rs = [first(kuramoto_R(e)) for e ∈ envelopes]
    mean_R  = isempty(self_Rs) ? 0.0 : sum(self_Rs) / length(self_Rs)

    # Solfeggio field harmony (if tier_freqs provided)
    sol_harmony = 0.0
    if length(tier_freqs) ≥ 2
        pairs    = [(tier_freqs[i], tier_freqs[j])
                    for i ∈ 1:length(tier_freqs)
                    for j ∈ (i+1):length(tier_freqs)]
        sol_harmony = isempty(pairs) ? 0.0 : sum(solfeggio_resonance(p...) for p ∈ pairs) / length(pairs)
    end

    (
        R_field       = R_field,
        psi_field     = Ψ_field,
        healthy       = healthy,
        caller_count  = length(envelopes),
        mean_self_R   = mean_R,
        sol_harmony   = sol_harmony,
        threshold     = EMERGENCE_THRESHOLD,
        phi            = PHI,
        golden_angle   = GOLDEN_ANGLE,
    )
end

end  # module ResonanceField


# ─── Main (when run standalone) ──────────────────────────────────────────────

if abspath(PROGRAM_FILE) == @__FILE__
    using .ResonanceField

    println("🌀 ResonanceField Engine — Julia substrate")
    println("φ = $(PHI)")
    println("EMERGENCE_THRESHOLD = $(EMERGENCE_THRESHOLD)")
    println("GOLDEN_ANGLE = $(GOLDEN_ANGLE) rad")
    println()

    # Demo: 5 callers, generate phase vectors, compute field health
    println("── Generating 5 caller phase vectors ──")
    seeds = [1.618, 2.718, 3.141, 1.414, 2.236]
    envelopes = [generate_phase_vector(s, 100) for s ∈ seeds]
    tier_freqs = [396.0, 417.0, 528.0, 639.0, 741.0]

    for (i, e) ∈ enumerate(envelopes)
        R, Ψ = kuramoto_R(e)
        println("  Caller $i | R=$(@sprintf("%.4f", R)) | Ψ=$(@sprintf("%.4f", Ψ))")
    end

    println()
    report = field_health_report(envelopes, tier_freqs)
    println("── Field Health Report ──")
    println("  R_field     = $(@sprintf("%.4f", report.R_field))")
    println("  healthy     = $(report.healthy)")
    println("  mean_self_R = $(@sprintf("%.4f", report.mean_self_R))")
    println("  sol_harmony = $(@sprintf("%.4f", report.sol_harmony))")

    println()
    println("── Kuramoto ODE Integration (N=5, T=10s) ──")
    sys = KuramotoSystem(5; K=PHI)
    θ₀  = [2π * rand() for _ ∈ 1:5]
    θ_f, R_traj, _ = integrate_euler(sys, θ₀, 10.0, 0.01)
    R_final, _ = kuramoto_R(θ_f)
    println("  Initial R = $(@sprintf("%.4f", first(R_traj)))")
    println("  Final   R = $(@sprintf("%.4f", R_final))")
    println("  Above threshold = $(R_final > EMERGENCE_THRESHOLD)")
end
