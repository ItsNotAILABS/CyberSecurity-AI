"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                      HARMONIC INTELLIGENCE                                   ║
║   Kuramoto Oscillators, Wave Interference, Resonance Networks               ║
╚══════════════════════════════════════════════════════════════════════════════╝

Intelligence emerges from synchronized oscillations:

1. KURAMOTO MODEL — Coupled Oscillator Synchronization
   dθᵢ/dt = ωᵢ + (K/N)·Σⱼ sin(θⱼ - θᵢ)
   
   - Each oscillator has natural frequency ωᵢ
   - Coupling strength K determines synchronization
   - Order parameter R measures global coherence
   - Phase transition at critical coupling Kc

2. ORDER PARAMETER — Collective Synchronization
   R·e^(iΨ) = (1/N)·Σⱼ e^(iθⱼ)
   
   - R → 0: incoherent (random phases)
   - R → 1: synchronized (locked phases)
   - R = φ⁻¹ ≈ 0.618: emergence threshold

3. WAVE INTERFERENCE — Constructive/Destructive Patterns
   I = I₁ + I₂ + 2√(I₁I₂)·cos(Δφ)
   
   - Constructive when Δφ = 0 (in phase)
   - Destructive when Δφ = π (anti-phase)
   - Standing waves create stable structures

4. RESONANCE NETWORKS — Frequency Matching
   - Natural frequencies attract
   - Entrainment locks disparate frequencies
   - φ-ratio frequencies have special properties

5. COLLECTIVE INTELLIGENCE — Emergent Computation
   - Swarm behavior from local rules
   - Global coherence from local coupling
   - Intelligence emerges at critical synchronization

Casa de Medina — Architectos de Architectura Inteligente
"""

module HarmonicIntelligence

using LinearAlgebra
using Statistics

export KuramotoOscillator, OscillatorNetwork, OrderParameter
export WaveSource, InterferencePattern, StandingWave
export ResonanceNetwork, FrequencyCluster
export HarmonicIntelligenceSystem
export kuramoto_step!, compute_order_parameter, measure_coherence
export create_interference_pattern, find_resonances
export emergence_threshold, synchronization_transition
export collective_compute, swarm_decision

# ═══════════════════════════════════════════════════════════════════════════════
#  CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

const PHI = (1 + sqrt(5)) / 2
const PHI_INV = 1.0 / PHI
const PHI2 = PHI * PHI

# Emergence threshold: R = 1/φ ≈ 0.618
# Below this, system is incoherent
# Above this, collective behavior emerges
const EMERGENCE_THRESHOLD = PHI_INV

# Critical coupling for Kuramoto model: Kc ≈ 2/(π·g(0))
# where g(ω) is the frequency distribution
const CRITICAL_COUPLING_FACTOR = 2.0 / π

# ═══════════════════════════════════════════════════════════════════════════════
#  KURAMOTO OSCILLATORS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Kuramoto Oscillator — Phase oscillator with coupling

dθ/dt = ω + Σⱼ Kⱼ·sin(θⱼ - θ)
"""
struct KuramotoOscillator
    id::Int
    phase::Float64          # Current phase (0 to 2π)
    natural_frequency::Float64  # ω: natural oscillation rate
    coupling_strength::Float64  # K: how strongly it couples to others
    
    function KuramotoOscillator(id::Int; natural_frequency::Float64=1.0, coupling_strength::Float64=1.0)
        phase = rand() * 2π  # Random initial phase
        new(id, phase, natural_frequency, coupling_strength)
    end
end

"""
Order Parameter — Measures collective synchronization

R·e^(iΨ) = (1/N)·Σⱼ e^(iθⱼ)

- R: synchronization magnitude (0 = random, 1 = locked)
- Ψ: mean phase angle
"""
struct OrderParameter
    R::Float64      # Magnitude [0, 1]
    Psi::Float64    # Mean phase angle
    Re::Float64     # Real component
    Im::Float64     # Imaginary component
    
    function OrderParameter(phases::Vector{Float64})
        N = length(phases)
        if N == 0
            return new(0.0, 0.0, 0.0, 0.0)
        end
        
        # Compute complex order parameter
        Re = sum(cos.(phases)) / N
        Im = sum(sin.(phases)) / N
        
        R = sqrt(Re^2 + Im^2)
        Psi = atan(Im, Re)
        
        new(R, Psi, Re, Im)
    end
end

"""
Oscillator Network — Collection of coupled oscillators
"""
mutable struct OscillatorNetwork
    oscillators::Vector{KuramotoOscillator}
    coupling_matrix::Matrix{Float64}  # Kᵢⱼ: coupling from j to i
    phases::Vector{Float64}           # Current phases
    frequencies::Vector{Float64}      # Natural frequencies
    global_coupling::Float64          # Global coupling strength
    
    function OscillatorNetwork(n::Int; frequency_spread::Float64=0.5, coupling::Float64=1.0)
        oscillators = [KuramotoOscillator(i, 
            natural_frequency=1.0 + (rand() - 0.5) * frequency_spread,
            coupling_strength=coupling) for i in 1:n]
        
        # All-to-all coupling (can be modified for network structure)
        coupling_matrix = ones(n, n) * coupling / n
        for i in 1:n
            coupling_matrix[i, i] = 0.0  # No self-coupling
        end
        
        phases = [o.phase for o in oscillators]
        frequencies = [o.natural_frequency for o in oscillators]
        
        new(oscillators, coupling_matrix, phases, frequencies, coupling)
    end
end

"""
Perform one Kuramoto time step

dθᵢ/dt = ωᵢ + Σⱼ Kᵢⱼ·sin(θⱼ - θᵢ)
"""
function kuramoto_step!(network::OscillatorNetwork, dt::Float64)
    N = length(network.oscillators)
    new_phases = copy(network.phases)
    
    for i in 1:N
        # Natural frequency contribution
        dtheta = network.frequencies[i]
        
        # Coupling contribution
        for j in 1:N
            if i != j
                dtheta += network.coupling_matrix[i, j] * sin(network.phases[j] - network.phases[i])
            end
        end
        
        # Update phase
        new_phases[i] = mod(network.phases[i] + dtheta * dt, 2π)
    end
    
    network.phases = new_phases
    
    # Update oscillator phases
    for (i, o) in enumerate(network.oscillators)
        network.oscillators[i] = KuramotoOscillator(o.id,
            natural_frequency=o.natural_frequency,
            coupling_strength=o.coupling_strength)
    end
end

"""
Compute order parameter for network
"""
function compute_order_parameter(network::OscillatorNetwork)::OrderParameter
    OrderParameter(network.phases)
end

"""
Measure coherence — φ-weighted synchronization metric

Returns value between 0 (incoherent) and 1 (fully synchronized)
Uses emergence threshold for normalization
"""
function measure_coherence(network::OscillatorNetwork)::Float64
    op = compute_order_parameter(network)
    
    # Scale by emergence threshold
    # R/EMERGENCE_THRESHOLD maps 0.618 → 1.0
    scaled = op.R / EMERGENCE_THRESHOLD
    
    clamp(scaled, 0.0, 1.0)
end

"""
Check if network has undergone synchronization transition
"""
function synchronization_transition(network::OscillatorNetwork)::Bool
    op = compute_order_parameter(network)
    op.R > EMERGENCE_THRESHOLD
end

# ═══════════════════════════════════════════════════════════════════════════════
#  WAVE INTERFERENCE
# ═══════════════════════════════════════════════════════════════════════════════

"""
Wave Source — Point source of oscillation

A(r, t) = A₀·cos(k·r - ω·t + φ) / r
"""
struct WaveSource
    position::Vector{Float64}  # Source location
    amplitude::Float64         # A₀
    frequency::Float64         # ω
    wavelength::Float64        # λ = 2π/k
    phase::Float64             # Initial phase φ
    
    function WaveSource(position::Vector{Float64}; amplitude::Float64=1.0, 
                        frequency::Float64=1.0, phase::Float64=0.0)
        wavelength = 2π / frequency  # In simplified units
        new(position, amplitude, frequency, wavelength, phase)
    end
end

"""
Interference Pattern — Superposition of multiple waves
"""
struct InterferencePattern
    sources::Vector{WaveSource}
    constructive_points::Vector{Vector{Float64}}  # Maximum amplitude points
    destructive_points::Vector{Vector{Float64}}   # Zero amplitude points
    
    function InterferencePattern(sources::Vector{WaveSource}, grid_points::Vector{Vector{Float64}})
        # Find constructive and destructive interference points
        constructive = Vector{Float64}[]
        destructive = Vector{Float64}[]
        
        for point in grid_points
            phase_sum = 0.0
            amplitude_sum = 0.0
            
            for source in sources
                distance = norm(point - source.position)
                if distance > 0.01  # Avoid singularity
                    # Phase at this point
                    k = 2π / source.wavelength
                    wave_phase = k * distance + source.phase
                    
                    # Contribution (simplified)
                    amplitude_sum += source.amplitude * cos(wave_phase) / sqrt(distance)
                    phase_sum += wave_phase
                end
            end
            
            # Check for constructive/destructive
            if abs(amplitude_sum) > 1.5 * mean([s.amplitude for s in sources])
                push!(constructive, point)
            elseif abs(amplitude_sum) < 0.1 * mean([s.amplitude for s in sources])
                push!(destructive, point)
            end
        end
        
        new(sources, constructive, destructive)
    end
end

"""
Create interference pattern from multiple sources

I = I₁ + I₂ + 2√(I₁I₂)·cos(Δφ)
"""
function create_interference_pattern(sources::Vector{WaveSource}; 
                                      grid_size::Int=50, extent::Float64=10.0)::InterferencePattern
    # Generate grid points
    grid_points = Vector{Float64}[]
    for i in 1:grid_size
        for j in 1:grid_size
            x = (i - grid_size/2) * extent / grid_size
            y = (j - grid_size/2) * extent / grid_size
            push!(grid_points, [x, y])
        end
    end
    
    InterferencePattern(sources, grid_points)
end

"""
Standing Wave — Stationary interference pattern

Formed when two waves of equal frequency travel in opposite directions.
Creates nodes (zero amplitude) and antinodes (maximum amplitude).
"""
struct StandingWave
    wavelength::Float64
    amplitude::Float64
    nodes::Vector{Float64}      # Zero-amplitude positions
    antinodes::Vector{Float64}  # Maximum-amplitude positions
    
    function StandingWave(wavelength::Float64, amplitude::Float64, length::Float64)
        # Nodes at n·λ/2
        nodes = [n * wavelength / 2 for n in 0:floor(Int, 2 * length / wavelength)]
        
        # Antinodes at (n + 1/2)·λ/2
        antinodes = [(n + 0.5) * wavelength / 2 for n in 0:floor(Int, 2 * length / wavelength)]
        
        new(wavelength, amplitude, nodes, antinodes)
    end
end

# ═══════════════════════════════════════════════════════════════════════════════
#  RESONANCE NETWORKS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Frequency Cluster — Group of similar frequencies

Frequencies that are close tend to synchronize (entrainment).
φ-related frequencies have special resonance properties.
"""
struct FrequencyCluster
    center_frequency::Float64
    members::Vector{Float64}
    bandwidth::Float64        # Frequency spread
    phi_harmonic::Bool        # Is this a φ-harmonic cluster?
    
    function FrequencyCluster(frequencies::Vector{Float64})
        center = mean(frequencies)
        bandwidth = std(frequencies)
        
        # Check if cluster is at φ-harmonic
        phi_harmonics = [1.0, PHI, PHI2, 1/PHI, 1/PHI2]
        phi_harmonic = any([abs(center - h) < 0.1 for h in phi_harmonics])
        
        new(center, frequencies, bandwidth, phi_harmonic)
    end
end

"""
Resonance Network — Network of frequency-coupled nodes

Nodes resonate when their frequencies match or are harmonically related.
"""
struct ResonanceNetwork
    nodes::Vector{Float64}           # Node frequencies
    resonance_matrix::Matrix{Float64}  # Resonance strength between nodes
    clusters::Vector{FrequencyCluster}  # Identified frequency clusters
    
    function ResonanceNetwork(frequencies::Vector{Float64})
        N = length(frequencies)
        
        # Build resonance matrix
        # Resonance strength based on frequency ratio
        resonance_matrix = zeros(N, N)
        for i in 1:N
            for j in 1:N
                if i != j
                    ratio = frequencies[i] / frequencies[j]
                    # Strong resonance at simple ratios
                    simple_ratios = [1.0, 2.0, 0.5, 1.5, 2/3, PHI, PHI_INV]
                    min_diff = minimum([abs(ratio - r) for r in simple_ratios])
                    resonance_matrix[i, j] = exp(-min_diff * 5.0)
                end
            end
        end
        
        # Find clusters using simple threshold
        clusters = find_frequency_clusters(frequencies, 0.2)
        
        new(frequencies, resonance_matrix, clusters)
    end
end

"""
Find frequency clusters using hierarchical approach
"""
function find_frequency_clusters(frequencies::Vector{Float64}, threshold::Float64)::Vector{FrequencyCluster}
    clusters = FrequencyCluster[]
    assigned = Set{Int}()
    
    for i in 1:length(frequencies)
        if i ∉ assigned
            cluster_freqs = [frequencies[i]]
            push!(assigned, i)
            
            for j in i+1:length(frequencies)
                if j ∉ assigned
                    if abs(frequencies[j] - mean(cluster_freqs)) < threshold
                        push!(cluster_freqs, frequencies[j])
                        push!(assigned, j)
                    end
                end
            end
            
            push!(clusters, FrequencyCluster(cluster_freqs))
        end
    end
    
    clusters
end

"""
Find resonances between all nodes
"""
function find_resonances(network::ResonanceNetwork; threshold::Float64=0.5)::Vector{Tuple{Int, Int, Float64}}
    resonances = Tuple{Int, Int, Float64}[]
    N = length(network.nodes)
    
    for i in 1:N
        for j in i+1:N
            strength = network.resonance_matrix[i, j]
            if strength > threshold
                push!(resonances, (i, j, strength))
            end
        end
    end
    
    sort!(resonances, by=x->-x[3])  # Sort by strength descending
    resonances
end

# ═══════════════════════════════════════════════════════════════════════════════
#  HARMONIC INTELLIGENCE SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

"""
Harmonic Intelligence System — Complete synchronization-based intelligence

Combines:
- Kuramoto oscillators for phase synchronization
- Wave interference for pattern formation
- Resonance networks for frequency matching
- Collective computation through emergence
"""
struct HarmonicIntelligenceSystem
    oscillator_network::OscillatorNetwork
    resonance_network::ResonanceNetwork
    emergence_level::Float64  # Current level of emergent behavior
    collective_state::Vector{Float64}  # Emergent collective state
    
    function HarmonicIntelligenceSystem(n_oscillators::Int; coupling::Float64=1.0)
        osc_network = OscillatorNetwork(n_oscillators, coupling=coupling)
        res_network = ResonanceNetwork(osc_network.frequencies)
        
        emergence = measure_coherence(osc_network)
        collective = osc_network.phases
        
        new(osc_network, res_network, emergence, collective)
    end
end

"""
Check if system has reached emergence threshold

R > 1/φ indicates collective behavior has emerged
"""
function emergence_threshold(system::HarmonicIntelligenceSystem)::Bool
    system.emergence_level > EMERGENCE_THRESHOLD
end

"""
Collective computation — emergent decision making

When oscillators synchronize, their collective state
can perform computation through pattern formation.
"""
function collective_compute(system::HarmonicIntelligenceSystem, 
                           input::Vector{Float64})::Vector{Float64}
    # Input perturbs oscillator phases
    N = length(system.oscillator_network.oscillators)
    if length(input) != N
        input = resize!(copy(input), N)
    end
    
    # Perturb phases by input
    for i in 1:N
        system.oscillator_network.phases[i] = mod(
            system.oscillator_network.phases[i] + input[i] * π/4,
            2π
        )
    end
    
    # Evolve system
    for _ in 1:10
        kuramoto_step!(system.oscillator_network, 0.1)
    end
    
    # Output is collective state modulated by resonance
    output = Float64[]
    for i in 1:N
        # Combine phase with resonance strength
        res_strength = sum(system.resonance_network.resonance_matrix[i, :])
        push!(output, cos(system.oscillator_network.phases[i]) * res_strength / N)
    end
    
    output
end

"""
Swarm decision making — binary decision through synchronization

If oscillators synchronize to mean phase in [0, π) → decision A
If mean phase in [π, 2π) → decision B
"""
function swarm_decision(system::HarmonicIntelligenceSystem)::Tuple{Bool, Float64}
    op = compute_order_parameter(system.oscillator_network)
    
    # Decision based on mean phase
    decision = op.Psi < π
    
    # Confidence based on synchronization
    confidence = op.R
    
    (decision, confidence)
end

"""
Update system for one time step

Returns new emergence level
"""
function step!(system::HarmonicIntelligenceSystem, dt::Float64)::Float64
    kuramoto_step!(system.oscillator_network, dt)
    
    # Recompute emergence
    coherence = measure_coherence(system.oscillator_network)
    
    # Update collective state
    system.collective_state .= system.oscillator_network.phases
    
    coherence
end

end # module HarmonicIntelligence
