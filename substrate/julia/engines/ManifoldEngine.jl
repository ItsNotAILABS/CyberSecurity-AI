"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                        MANIFOLD ENGINE                                       ║
║   Differential Geometry for Consciousness and Intelligence Spaces            ║
╚══════════════════════════════════════════════════════════════════════════════╝

Consciousness and intelligence exist on MANIFOLDS — curved spaces
where the rules of Euclidean geometry don't apply.

1. TANGENT SPACES — Local Linear Approximation
   At each point p on a manifold, the tangent space TₚM
   is the best linear approximation to the curved space.
   
   Intelligence operations work in tangent space,
   then are projected back to the manifold.

2. METRIC TENSOR — How to Measure Distance
   gᵢⱼ defines the inner product on tangent spaces.
   ds² = gᵢⱼ dxⁱ dxʲ (Einstein summation)
   
   Different metrics give different notions of "close" or "similar".

3. CURVATURE — How the Space Bends
   Riemann tensor Rⁱⱼₖₗ measures intrinsic curvature.
   Ricci tensor Rᵢⱼ = Rᵏᵢₖⱼ contracts to scalar curvature.
   
   Positive curvature: sphere-like (finite, closed)
   Negative curvature: hyperbolic (infinite, open)
   Zero curvature: flat (Euclidean)

4. GEODESICS — Shortest Paths
   In curved space, "straight lines" are geodesics.
   They satisfy: d²xᵘ/ds² + Γᵘᵥω (dxᵛ/ds)(dxω/ds) = 0
   
   Thought transitions follow geodesics on the consciousness manifold.

5. PARALLEL TRANSPORT — Moving Vectors Along Paths
   How to consistently move a tangent vector along a curve.
   Essential for comparing states at different points.

Casa de Medina — Architectos de Architectura Inteligente
"""

module ManifoldEngine

using LinearAlgebra
using Statistics

export Manifold, TangentVector, MetricTensor, ChristoffelSymbols
export ConsciousnessManifold, ThoughtGeodesic, AttentionField
export create_sphere_manifold, create_hyperbolic_manifold, create_torus_manifold
export create_consciousness_manifold
export tangent_at, metric_at, christoffel_at
export geodesic_distance, geodesic_path, parallel_transport
export sectional_curvature, ricci_curvature, scalar_curvature
export exponential_map, logarithm_map, geodesic_midpoint

# ═══════════════════════════════════════════════════════════════════════════════
#  CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

const PHI = (1 + sqrt(5)) / 2
const PHI_INV = 1.0 / PHI
const PHI2 = PHI * PHI

# ═══════════════════════════════════════════════════════════════════════════════
#  MANIFOLD PRIMITIVES
# ═══════════════════════════════════════════════════════════════════════════════

"""
Tangent Vector — Element of tangent space TₚM

A tangent vector represents a direction and magnitude
at a specific point on the manifold.
"""
struct TangentVector
    point::Vector{Float64}       # Point on manifold where vector is attached
    components::Vector{Float64}  # Vector components in local coordinates
    magnitude::Float64           # ||v|| computed with metric
    
    function TangentVector(point::Vector{Float64}, components::Vector{Float64}, metric::Matrix{Float64})
        # ||v||² = gᵢⱼ vⁱ vʲ
        mag_sq = components' * metric * components
        mag = sqrt(max(mag_sq, 0.0))
        new(point, components, mag)
    end
end

"""
Metric Tensor — gᵢⱼ that defines inner products

The metric tensor tells us how to measure distances and angles
in the tangent space at each point.
"""
struct MetricTensor
    dimension::Int
    components::Function  # (point) -> Matrix{Float64}
    
    function MetricTensor(dim::Int, metric_func::Function)
        new(dim, metric_func)
    end
end

"""
Evaluate metric at a point
"""
function metric_at(metric::MetricTensor, point::Vector{Float64})::Matrix{Float64}
    metric.components(point)
end

"""
Christoffel Symbols — Γᵘᵥω that encode connection

These tell us how coordinates change as we move along the manifold.
Γᵘᵥω = (1/2) gᵘσ (∂gσᵥ/∂xω + ∂gσω/∂xᵥ - ∂gᵥω/∂xσ)
"""
struct ChristoffelSymbols
    dimension::Int
    symbols::Function  # (point) -> Array{Float64, 3}
    
    function ChristoffelSymbols(dim::Int, christoffel_func::Function)
        new(dim, christoffel_func)
    end
end

"""
Evaluate Christoffel symbols at a point
"""
function christoffel_at(cs::ChristoffelSymbols, point::Vector{Float64})::Array{Float64, 3}
    cs.symbols(point)
end

"""
Manifold — Abstract curved space

A manifold is locally Euclidean but globally can have complex topology.
"""
struct Manifold
    dimension::Int
    metric::MetricTensor
    christoffel::ChristoffelSymbols
    topology::Symbol  # :sphere, :hyperbolic, :torus, :euclidean, :consciousness
    curvature_sign::Int  # +1 positive, 0 flat, -1 negative
    
    function Manifold(dim::Int, metric::MetricTensor, christoffel::ChristoffelSymbols,
                      topology::Symbol, curvature_sign::Int)
        new(dim, metric, christoffel, topology, curvature_sign)
    end
end

# ═══════════════════════════════════════════════════════════════════════════════
#  STANDARD MANIFOLDS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Create sphere manifold (S²) — Positive curvature

The 2-sphere with radius R.
Metric in spherical coordinates (θ, φ):
ds² = R²(dθ² + sin²θ dφ²)
"""
function create_sphere_manifold(radius::Float64=1.0)::Manifold
    # Metric tensor for sphere
    function sphere_metric(point::Vector{Float64})::Matrix{Float64}
        θ = point[1]
        R2 = radius^2
        [R2 0.0; 0.0 R2 * sin(θ)^2]
    end
    
    # Christoffel symbols for sphere
    function sphere_christoffel(point::Vector{Float64})::Array{Float64, 3}
        θ = point[1]
        Γ = zeros(2, 2, 2)
        
        # Γᶿφφ = -sin(θ)cos(θ)
        Γ[1, 2, 2] = -sin(θ) * cos(θ)
        
        # Γᵠθφ = Γᵠφθ = cot(θ)
        if abs(sin(θ)) > 1e-10
            Γ[2, 1, 2] = cos(θ) / sin(θ)
            Γ[2, 2, 1] = cos(θ) / sin(θ)
        end
        
        Γ
    end
    
    metric = MetricTensor(2, sphere_metric)
    christoffel = ChristoffelSymbols(2, sphere_christoffel)
    
    Manifold(2, metric, christoffel, :sphere, +1)
end

"""
Create hyperbolic manifold (H²) — Negative curvature

The hyperbolic plane with curvature K = -1/R².
Metric in the Poincaré disk model:
ds² = 4R²(dx² + dy²) / (1 - (x² + y²)/R²)²
"""
function create_hyperbolic_manifold(radius::Float64=1.0)::Manifold
    # Metric tensor for hyperbolic plane (Poincaré disk)
    function hyperbolic_metric(point::Vector{Float64})::Matrix{Float64}
        x, y = point
        r_sq = x^2 + y^2
        R_sq = radius^2
        
        if r_sq >= R_sq
            # Point at boundary — use limiting metric
            factor = 1e10
        else
            factor = 4 * R_sq / (1 - r_sq / R_sq)^2
        end
        
        [factor 0.0; 0.0 factor]
    end
    
    # Christoffel symbols for hyperbolic plane
    function hyperbolic_christoffel(point::Vector{Float64})::Array{Float64, 3}
        x, y = point
        r_sq = x^2 + y^2
        R_sq = radius^2
        
        Γ = zeros(2, 2, 2)
        
        if r_sq < R_sq
            denom = R_sq - r_sq
            
            Γ[1, 1, 1] = 2x / denom
            Γ[1, 1, 2] = 2y / denom
            Γ[1, 2, 1] = 2y / denom
            Γ[1, 2, 2] = -2x / denom
            
            Γ[2, 1, 1] = -2y / denom
            Γ[2, 1, 2] = 2x / denom
            Γ[2, 2, 1] = 2x / denom
            Γ[2, 2, 2] = 2y / denom
        end
        
        Γ
    end
    
    metric = MetricTensor(2, hyperbolic_metric)
    christoffel = ChristoffelSymbols(2, hyperbolic_christoffel)
    
    Manifold(2, metric, christoffel, :hyperbolic, -1)
end

"""
Create torus manifold (T²) — Mixed curvature

The 2-torus with major radius R and minor radius r.
Outer part has positive curvature, inner part negative.
"""
function create_torus_manifold(major_radius::Float64=2.0, minor_radius::Float64=1.0)::Manifold
    R, r = major_radius, minor_radius
    
    # Metric tensor for torus (θ, φ) where θ is around minor circle
    function torus_metric(point::Vector{Float64})::Matrix{Float64}
        θ = point[1]
        
        # g_θθ = r²
        # g_φφ = (R + r·cos(θ))²
        [r^2 0.0; 0.0 (R + r * cos(θ))^2]
    end
    
    # Christoffel symbols for torus
    function torus_christoffel(point::Vector{Float64})::Array{Float64, 3}
        θ = point[1]
        Γ = zeros(2, 2, 2)
        
        # Γᶿφφ = (R + r·cos(θ))·sin(θ) / r
        Γ[1, 2, 2] = (R + r * cos(θ)) * sin(θ) / r
        
        # Γᵠθφ = Γᵠφθ = -r·sin(θ) / (R + r·cos(θ))
        if abs(R + r * cos(θ)) > 1e-10
            Γ[2, 1, 2] = -r * sin(θ) / (R + r * cos(θ))
            Γ[2, 2, 1] = -r * sin(θ) / (R + r * cos(θ))
        end
        
        Γ
    end
    
    metric = MetricTensor(2, torus_metric)
    christoffel = ChristoffelSymbols(2, torus_christoffel)
    
    Manifold(2, metric, christoffel, :torus, 0)  # Mixed curvature
end

# ═══════════════════════════════════════════════════════════════════════════════
#  CONSCIOUSNESS MANIFOLD — φ-Weighted State Space
# ═══════════════════════════════════════════════════════════════════════════════

"""
Consciousness Manifold — Special manifold for mental states

Dimensions:
1. Attention (focus level)
2. Arousal (energy level)
3. Valence (positive/negative affect)
4. Complexity (information density)

Metric incorporates φ-weighting for natural thought flow.
"""
struct ConsciousnessManifold
    base_manifold::Manifold
    attention_weight::Float64
    arousal_weight::Float64
    valence_weight::Float64
    complexity_weight::Float64
    
    function ConsciousnessManifold()
        # Weights based on golden ratio powers
        attention_weight = PHI2      # Most important
        arousal_weight = PHI         # Second
        valence_weight = 1.0         # Baseline
        complexity_weight = PHI_INV  # Least
        
        # φ-weighted metric
        function consciousness_metric(point::Vector{Float64})::Matrix{Float64}
            # 4D diagonal metric with φ-weights
            diagm([attention_weight^2, arousal_weight^2, valence_weight^2, complexity_weight^2])
        end
        
        # Christoffel symbols (flat in this simplification)
        function consciousness_christoffel(point::Vector{Float64})::Array{Float64, 3}
            zeros(4, 4, 4)
        end
        
        metric = MetricTensor(4, consciousness_metric)
        christoffel = ChristoffelSymbols(4, consciousness_christoffel)
        
        base = Manifold(4, metric, christoffel, :consciousness, 0)
        
        new(base, attention_weight, arousal_weight, valence_weight, complexity_weight)
    end
end

"""
Create consciousness manifold
"""
function create_consciousness_manifold()::ConsciousnessManifold
    ConsciousnessManifold()
end

"""
Thought Geodesic — Path through consciousness space

Represents the natural flow of thought from one state to another.
"""
struct ThoughtGeodesic
    start_state::Vector{Float64}
    end_state::Vector{Float64}
    path_points::Vector{Vector{Float64}}
    path_length::Float64
    phi_alignment::Float64  # How "natural" is this thought flow?
    
    function ThoughtGeodesic(cm::ConsciousnessManifold, start::Vector{Float64}, 
                             finish::Vector{Float64}, num_points::Int=20)
        # Compute geodesic path (in this flat approximation, it's straight)
        path = Vector{Float64}[]
        for i in 0:num_points-1
            t = i / (num_points - 1)
            point = start * (1 - t) + finish * t
            push!(path, point)
        end
        
        # Compute path length
        length = 0.0
        for i in 2:length(path)
            g = metric_at(cm.base_manifold.metric, path[i])
            delta = path[i] - path[i-1]
            length += sqrt(max(delta' * g * delta, 0.0))
        end
        
        # φ-alignment: how close is the path to golden-ratio proportions?
        phi_alignment = compute_phi_alignment(path)
        
        new(start, finish, path, length, phi_alignment)
    end
end

"""
Compute φ-alignment of a path

Measures how well the path segments follow golden ratio proportions.
"""
function compute_phi_alignment(path::Vector{Vector{Float64}})::Float64
    if length(path) < 3
        return PHI_INV
    end
    
    # Compute segment lengths
    lengths = Float64[]
    for i in 2:length(path)
        push!(lengths, norm(path[i] - path[i-1]))
    end
    
    # Check ratio of consecutive segments against φ
    ratios = Float64[]
    for i in 2:length(lengths)
        if lengths[i-1] > 1e-10
            push!(ratios, lengths[i] / lengths[i-1])
        end
    end
    
    if isempty(ratios)
        return PHI_INV
    end
    
    # Score based on closeness to φ
    phi_scores = [exp(-abs(r - PHI) * PHI) for r in ratios]
    mean(phi_scores)
end

"""
Attention Field — Vector field on consciousness manifold

Models the flow of attention through different mental states.
"""
struct AttentionField
    manifold::ConsciousnessManifold
    field::Function  # (point) -> tangent vector components
    strength::Float64
    
    function AttentionField(cm::ConsciousnessManifold; strength::Float64=1.0)
        # Default attention field flows toward high-attention states
        function attention_flow(point::Vector{Float64})::Vector{Float64}
            # Gradient toward maximum attention
            grad = zeros(4)
            grad[1] = strength * (1.0 - point[1])  # Flow toward attention = 1
            grad[2] = strength * PHI_INV * (0.5 - abs(point[2] - 0.5))  # Flow toward moderate arousal
            grad[3] = strength * PHI_INV^2 * (1.0 - abs(point[3]))  # Slight valence centering
            grad[4] = 0.0  # No preferred complexity
            grad
        end
        
        new(cm, attention_flow, strength)
    end
end

# ═══════════════════════════════════════════════════════════════════════════════
#  GEODESIC OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Compute geodesic distance between two points

For sphere: arc length along great circle
For flat: Euclidean distance with metric
"""
function geodesic_distance(manifold::Manifold, p1::Vector{Float64}, p2::Vector{Float64})::Float64
    if manifold.topology == :sphere
        # Great circle distance
        # d = R × arccos(sin(θ₁)sin(θ₂) + cos(θ₁)cos(θ₂)cos(φ₂-φ₁))
        θ1, φ1 = p1
        θ2, φ2 = p2
        
        cos_d = sin(θ1) * sin(θ2) + cos(θ1) * cos(θ2) * cos(φ2 - φ1)
        cos_d = clamp(cos_d, -1.0, 1.0)
        
        acos(cos_d)  # Assuming unit sphere
        
    elseif manifold.topology == :hyperbolic
        # Hyperbolic distance in Poincaré disk
        x1, y1 = p1
        x2, y2 = p2
        
        # d = 2·artanh(|z₁ - z₂| / |1 - z̄₁z₂|)
        diff = sqrt((x2 - x1)^2 + (y2 - y1)^2)
        # Simplified for small distances
        2.0 * atanh(clamp(diff / 2.0, 0.0, 0.999))
        
    else
        # General case: integrate metric along straight line (approximation)
        n_steps = 100
        distance = 0.0
        
        for i in 1:n_steps
            t1 = (i - 1) / n_steps
            t2 = i / n_steps
            
            mid = p1 * (1 - (t1 + t2)/2) + p2 * (t1 + t2)/2
            delta = (p2 - p1) / n_steps
            
            g = metric_at(manifold.metric, mid)
            ds_sq = delta' * g * delta
            distance += sqrt(max(ds_sq, 0.0))
        end
        
        distance
    end
end

"""
Compute geodesic path between two points

Returns array of points along the geodesic.
"""
function geodesic_path(manifold::Manifold, p1::Vector{Float64}, p2::Vector{Float64}, 
                       num_points::Int=20)::Vector{Vector{Float64}}
    if manifold.topology == :sphere
        # Great circle path
        θ1, φ1 = p1
        θ2, φ2 = p2
        
        path = Vector{Float64}[]
        for i in 0:num_points-1
            t = i / (num_points - 1)
            
            # Spherical linear interpolation (slerp)
            θ = θ1 * (1 - t) + θ2 * t
            φ = φ1 * (1 - t) + φ2 * t  # Simplified - actual slerp is more complex
            
            push!(path, [θ, φ])
        end
        
        path
        
    else
        # Linear interpolation (exact for flat, approximation otherwise)
        [p1 * (1 - i/(num_points-1)) + p2 * (i/(num_points-1)) for i in 0:num_points-1]
    end
end

"""
Parallel transport a tangent vector along a geodesic

This preserves the vector's "direction" relative to the path.
"""
function parallel_transport(manifold::Manifold, vector::TangentVector, 
                           end_point::Vector{Float64})::TangentVector
    # Get path
    path = geodesic_path(manifold, vector.point, end_point, 50)
    
    # Transport vector along path using Christoffel symbols
    v = copy(vector.components)
    
    for i in 2:length(path)
        p = path[i]
        dp = path[i] - path[i-1]
        
        # v^μ → v^μ - Γ^μ_νρ v^ν dx^ρ
        Γ = christoffel_at(manifold.christoffel, path[i-1])
        
        new_v = copy(v)
        for μ in 1:length(v)
            for ν in 1:length(v)
                for ρ in 1:length(v)
                    new_v[μ] -= Γ[μ, ν, ρ] * v[ν] * dp[ρ]
                end
            end
        end
        v = new_v
    end
    
    g = metric_at(manifold.metric, end_point)
    TangentVector(end_point, v, g)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  CURVATURE COMPUTATIONS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Compute sectional curvature at a point

K(X, Y) = R(X, Y, Y, X) / (g(X,X)g(Y,Y) - g(X,Y)²)

Sectional curvature measures how geodesics spread/converge.
"""
function sectional_curvature(manifold::Manifold, point::Vector{Float64},
                             X::Vector{Float64}, Y::Vector{Float64})::Float64
    # For standard manifolds, use known formulas
    if manifold.topology == :sphere
        return 1.0  # Constant positive curvature
    elseif manifold.topology == :hyperbolic
        return -1.0  # Constant negative curvature
    elseif manifold.topology == :torus
        # Variable curvature
        θ = point[1]
        # K = cos(θ) / (R + r·cos(θ))
        # Using fixed R=2, r=1 for simplicity
        R, r = 2.0, 1.0
        return cos(θ) / (r * (R + r * cos(θ)))
    else
        return 0.0  # Flat
    end
end

"""
Compute Ricci curvature tensor at a point

Rᵢⱼ = Rᵏᵢₖⱼ (contraction of Riemann tensor)
"""
function ricci_curvature(manifold::Manifold, point::Vector{Float64})::Matrix{Float64}
    dim = manifold.dimension
    Ric = zeros(dim, dim)
    
    # For constant curvature manifolds: Rᵢⱼ = (n-1)K gᵢⱼ
    g = metric_at(manifold.metric, point)
    K = sectional_curvature(manifold, point, ones(dim), [i == 1 ? 0.0 : 1.0 for i in 1:dim])
    
    Ric = (dim - 1) * K * g
    Ric
end

"""
Compute scalar curvature at a point

R = gⁱʲ Rᵢⱼ
"""
function scalar_curvature(manifold::Manifold, point::Vector{Float64})::Float64
    g = metric_at(manifold.metric, point)
    Ric = ricci_curvature(manifold, point)
    
    # R = tr(g⁻¹ Ric)
    g_inv = inv(g)
    tr(g_inv * Ric)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  EXPONENTIAL AND LOGARITHM MAPS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Exponential map: TₚM → M

Maps a tangent vector to a point on the manifold
by following the geodesic in that direction.
"""
function exponential_map(manifold::Manifold, p::Vector{Float64}, v::Vector{Float64})::Vector{Float64}
    # Follow geodesic from p in direction v for unit parameter time
    g = metric_at(manifold.metric, p)
    v_mag = sqrt(max(v' * g * v, 0.0))
    
    if v_mag < 1e-10
        return p
    end
    
    # Normalize direction
    v_norm = v / v_mag
    
    # For sphere: use spherical exponential
    if manifold.topology == :sphere
        θ, φ = p
        # Project v onto sphere tangent space and follow
        return [θ + v_norm[1] * v_mag, φ + v_norm[2] * v_mag / max(sin(θ), 0.01)]
    end
    
    # General case: linear approximation
    p + v
end

"""
Logarithm map: M → TₚM

Inverse of exponential map: finds tangent vector at p
pointing toward q with magnitude equal to geodesic distance.
"""
function logarithm_map(manifold::Manifold, p::Vector{Float64}, q::Vector{Float64})::Vector{Float64}
    # For flat manifolds
    if manifold.curvature_sign == 0 && manifold.topology != :torus
        return q - p
    end
    
    # For curved manifolds: direction from p to q scaled by distance
    dist = geodesic_distance(manifold, p, q)
    
    if dist < 1e-10
        return zeros(length(p))
    end
    
    # Unit tangent at p pointing toward q (approximation)
    direction = q - p
    direction_norm = norm(direction)
    
    if direction_norm < 1e-10
        return zeros(length(p))
    end
    
    (direction / direction_norm) * dist
end

"""
Geodesic midpoint between two points

The point equidistant (along geodesic) from both p and q.
"""
function geodesic_midpoint(manifold::Manifold, p::Vector{Float64}, q::Vector{Float64})::Vector{Float64}
    # Follow geodesic halfway
    v = logarithm_map(manifold, p, q)
    exponential_map(manifold, p, v * 0.5)
end

end # module ManifoldEngine
