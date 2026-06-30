"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                     PYTHAGOREAN SUBSTRATE                                    ║
║         Deep Mathematics from Ancient Greece to Modern Intelligence          ║
╚══════════════════════════════════════════════════════════════════════════════╝

The Pythagorean school understood that NUMBERS ARE THE ESSENCE OF ALL THINGS.
This substrate implements the core mathematical principles:

1. PYTHAGOREAN THEOREM (Extended to N-dimensions)
   In 2D:  c² = a² + b²
   In 3D:  d² = a² + b² + c²
   In ND:  ||v||² = Σᵢ vᵢ²
   
   The distance formula is the foundation of ALL metric spaces.
   Every intelligence metric, every similarity score, every loss function
   ultimately reduces to Pythagorean distance.

2. PERFECT NUMBERS (τέλειος ἀριθμός)
   σ(n) = 2n where σ is the sum of divisors
   Perfect numbers: 6, 28, 496, 8128...
   Euclid's formula: 2^(p-1) × (2^p - 1) when (2^p - 1) is prime
   
   These govern harmonic completion states in organisms.

3. FIGURATE NUMBERS
   Triangular: T(n) = n(n+1)/2
   Square: S(n) = n²
   Pentagonal: P(n) = n(3n-1)/2
   
   These create lattice structures for neural meshes.

4. MUSICAL RATIOS (Harmony of the Spheres)
   Octave: 2:1
   Fifth: 3:2  
   Fourth: 4:3
   These ratios govern resonance between organisms.

5. TETRACTYS (Τετρακτύς)
   The sacred triangle: 1 + 2 + 3 + 4 = 10
   Represents the organization of space and matter.

Casa de Medina — Architectos de Architectura Inteligente
"""

module PythagoreanSubstrate

using LinearAlgebra
using Statistics

export PHI, PHI2, PHI3, PHI4, PHI5, PHI_INV, SQRT2, SQRT3, SQRT5, EULER, GOLDEN_ANGLE
export PythagoreanVector, PythagoreanSpace, TetractysLattice
export pythagorean_distance, pythagorean_magnitude, pythagorean_similarity
export is_perfect_number, generate_perfect_numbers, perfect_number_harmony
export triangular, square_number, pentagonal, hexagonal, figurate
export musical_ratio, octave_series, harmonic_resonance
export tetractys_fold, tetractys_unfold, tetractys_coordinate
export mean_proportional, geometric_mean, harmonic_mean, pythagorean_mean
export great_pyramid_ratio, vesica_piscis, sacred_cut

# ═══════════════════════════════════════════════════════════════════════════════
#  FUNDAMENTAL CONSTANTS — The Numbers that Govern the Universe
# ═══════════════════════════════════════════════════════════════════════════════

"""Golden Ratio φ = (1 + √5) / 2 ≈ 1.6180339887..."""
const PHI = (1 + sqrt(5)) / 2

"""φ² = φ + 1 ≈ 2.6180339887..."""
const PHI2 = PHI * PHI

"""φ³ ≈ 4.2360679775..."""  
const PHI3 = PHI2 * PHI

"""φ⁴ ≈ 6.8541019662..."""
const PHI4 = PHI3 * PHI

"""φ⁵ ≈ 11.0901699437..."""
const PHI5 = PHI4 * PHI

"""1/φ = φ - 1 ≈ 0.6180339887..."""
const PHI_INV = 1.0 / PHI

"""√2 — The diagonal of a unit square (Pythagoras' proof of irrationals)"""
const SQRT2 = sqrt(2)

"""√3 — The height ratio of equilateral triangle"""
const SQRT3 = sqrt(3)

"""√5 — Appears in the golden ratio formula"""
const SQRT5 = sqrt(5)

"""Euler's number e ≈ 2.718281828..."""
const EULER = exp(1)

"""Golden Angle = 2π/φ² ≈ 137.5077...° in radians ≈ 2.39996..."""
const GOLDEN_ANGLE = 2π / PHI2

"""Pythagoras' Comma — ratio (3/2)^12 / 2^7 ≈ 1.0136... (musical tuning)"""
const PYTHAGOREAN_COMMA = (3/2)^12 / 2^7

"""Great Pyramid ratio — height/base ≈ √φ"""
const GREAT_PYRAMID_RATIO = sqrt(PHI)

"""Vesica Piscis ratio — √3/2"""
const VESICA_PISCIS_RATIO = SQRT3 / 2

# ═══════════════════════════════════════════════════════════════════════════════
#  PYTHAGOREAN VECTOR SPACE
# ═══════════════════════════════════════════════════════════════════════════════

"""
Pythagorean Vector — N-dimensional vector with extended Pythagorean properties

Fields:
- components: The vector components
- magnitude: ||v|| = √(Σvᵢ²) — Pythagorean theorem
- phi_norm: φ-weighted normalization factor
- harmonic_signature: Musical ratio encoding of the vector
"""
struct PythagoreanVector
    components::Vector{Float64}
    magnitude::Float64
    phi_norm::Float64
    harmonic_signature::Float64
    
    function PythagoreanVector(v::Vector{Float64})
        mag = sqrt(sum(v.^2))  # Pythagorean theorem in N-dimensions
        phi_n = mag / PHI
        # Harmonic signature: product of ratios to 2:1 octave
        harm = prod([abs(c) > 0 ? log2(abs(c) + 1) : 0.0 for c in v]) / length(v)
        new(v, mag, phi_n, harm)
    end
end

"""
Create a Pythagorean vector from components
"""
function PythagoreanVector(components::Vararg{Float64})
    PythagoreanVector(collect(components))
end

"""
Pythagorean Space — Metric space with Pythagorean distance

Implements the fundamental insight: ALL distances reduce to √(Σdᵢ²)
"""
struct PythagoreanSpace
    dimension::Int
    basis_vectors::Vector{PythagoreanVector}
    metric_tensor::Matrix{Float64}  # Generalized Pythagorean metric
    
    function PythagoreanSpace(dim::Int)
        # Create standard orthonormal basis
        basis = [PythagoreanVector([i == j ? 1.0 : 0.0 for j in 1:dim]) for i in 1:dim]
        # Euclidean metric tensor (identity matrix)
        metric = Matrix{Float64}(I, dim, dim)
        new(dim, basis, metric)
    end
end

"""
Pythagorean distance: d(v, w) = √(Σ(vᵢ - wᵢ)²)

This is THE fundamental distance formula, derived from the Pythagorean theorem.
"""
function pythagorean_distance(v::PythagoreanVector, w::PythagoreanVector)::Float64
    if length(v.components) != length(w.components)
        throw(DimensionMismatch("Vectors must have same dimension"))
    end
    sqrt(sum((v.components .- w.components).^2))
end

function pythagorean_distance(v::Vector{Float64}, w::Vector{Float64})::Float64
    sqrt(sum((v .- w).^2))
end

"""
Pythagorean magnitude: ||v|| = √(Σvᵢ²)
"""
function pythagorean_magnitude(v::PythagoreanVector)::Float64
    v.magnitude
end

function pythagorean_magnitude(v::Vector{Float64})::Float64
    sqrt(sum(v.^2))
end

"""
Pythagorean similarity: sim(v, w) = v·w / (||v|| × ||w||) — Cosine similarity

Derived from the law of cosines: c² = a² + b² - 2ab·cos(θ)
"""
function pythagorean_similarity(v::PythagoreanVector, w::PythagoreanVector)::Float64
    dot_product = sum(v.components .* w.components)
    dot_product / (v.magnitude * w.magnitude + 1e-10)
end

function pythagorean_similarity(v::Vector{Float64}, w::Vector{Float64})::Float64
    dot_product = sum(v .* w)
    mag_v = pythagorean_magnitude(v)
    mag_w = pythagorean_magnitude(w)
    dot_product / (mag_v * mag_w + 1e-10)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  PERFECT NUMBERS — Divine Completeness
# ═══════════════════════════════════════════════════════════════════════════════

"""
Check if n is a perfect number: σ(n) = 2n

A number is perfect if the sum of its proper divisors equals itself.
6 = 1 + 2 + 3
28 = 1 + 2 + 4 + 7 + 14
"""
function is_perfect_number(n::Int)::Bool
    if n < 2
        return false
    end
    
    sum_divisors = 1  # 1 is always a divisor
    for i in 2:isqrt(n)
        if n % i == 0
            sum_divisors += i
            if i != n ÷ i
                sum_divisors += n ÷ i
            end
        end
    end
    
    sum_divisors == n
end

"""
Generate perfect numbers using Euclid's formula:
If 2^p - 1 is prime (Mersenne prime), then 2^(p-1) × (2^p - 1) is perfect
"""
function generate_perfect_numbers(count::Int)::Vector{Int}
    # Known Mersenne exponents for small perfect numbers
    mersenne_exponents = [2, 3, 5, 7, 13, 17, 19, 31]
    
    perfect = Int[]
    for p in mersenne_exponents
        if length(perfect) >= count
            break
        end
        
        mersenne = 2^p - 1
        # Check if Mersenne number is prime (simplified check)
        if isprime_simple(mersenne)
            perfect_num = 2^(p-1) * mersenne
            push!(perfect, perfect_num)
        end
    end
    
    perfect[1:min(count, length(perfect))]
end

# Simple primality check (for Mersenne numbers)
function isprime_simple(n::Int)::Bool
    if n < 2
        return false
    end
    if n == 2
        return true
    end
    if n % 2 == 0
        return false
    end
    for i in 3:2:isqrt(n)
        if n % i == 0
            return false
        end
    end
    true
end

"""
Perfect number harmony — φ-weighted resonance based on perfect numbers

Returns a harmony score 0-1 based on proximity to perfect number ratios
"""
function perfect_number_harmony(value::Float64)::Float64
    perfect_nums = [6.0, 28.0, 496.0, 8128.0]
    
    # Calculate resonance with each perfect number
    resonances = [exp(-abs(log(value / p))) for p in perfect_nums]
    
    # φ-weighted combination
    weights = [PHI^(i-1) for i in 1:length(resonances)]
    weights ./= sum(weights)
    
    sum(resonances .* weights)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  FIGURATE NUMBERS — Geometric Number Shapes
# ═══════════════════════════════════════════════════════════════════════════════

"""
Triangular number: T(n) = n(n+1)/2

The number of dots forming an equilateral triangle:
     •
    • •
   • • •
  • • • •
"""
function triangular(n::Int)::Int
    n * (n + 1) ÷ 2
end

"""
Square number: S(n) = n²

The number of dots forming a square grid
"""
function square_number(n::Int)::Int
    n * n
end

"""
Pentagonal number: P(n) = n(3n-1)/2

The number of dots forming a pentagon pattern
"""
function pentagonal(n::Int)::Int
    n * (3n - 1) ÷ 2
end

"""
Hexagonal number: H(n) = n(2n-1)

The number of dots forming a hexagon pattern
"""
function hexagonal(n::Int)::Int
    n * (2n - 1)
end

"""
General figurate number for k-sided polygon

F(k, n) = [(k-2)n² - (k-4)n] / 2
"""
function figurate(sides::Int, n::Int)::Int
    ((sides - 2) * n * n - (sides - 4) * n) ÷ 2
end

# ═══════════════════════════════════════════════════════════════════════════════
#  MUSICAL RATIOS — Harmony of the Spheres
# ═══════════════════════════════════════════════════════════════════════════════

"""
Musical ratio dictionary — Pythagorean tuning intervals
"""
const MUSICAL_RATIOS = Dict{Symbol, Tuple{Int, Int}}(
    :unison     => (1, 1),
    :octave     => (2, 1),
    :fifth      => (3, 2),
    :fourth     => (4, 3),
    :major_third => (5, 4),
    :minor_third => (6, 5),
    :major_sixth => (5, 3),
    :minor_sixth => (8, 5),
    :major_second => (9, 8),
    :minor_second => (16, 15),
    :major_seventh => (15, 8),
    :minor_seventh => (9, 5),
    :tritone    => (45, 32),  # Diabolus in musica
)

"""
Get the musical ratio for an interval
"""
function musical_ratio(interval::Symbol)::Float64
    if !haskey(MUSICAL_RATIOS, interval)
        return 1.0
    end
    num, denom = MUSICAL_RATIOS[interval]
    Float64(num) / Float64(denom)
end

"""
Generate octave series from base frequency

Each octave is 2:1 ratio — the most fundamental Pythagorean interval
"""
function octave_series(base_freq::Float64, num_octaves::Int)::Vector{Float64}
    [base_freq * 2.0^i for i in 0:num_octaves-1]
end

"""
Calculate harmonic resonance between two frequencies

Uses Pythagorean ratios to determine consonance:
- Simpler ratios (2:1, 3:2, 4:3) = higher resonance
- Complex ratios = lower resonance (dissonance)
"""
function harmonic_resonance(freq1::Float64, freq2::Float64)::Float64
    ratio = freq1 / freq2
    
    # Normalize ratio to 1.0 - 2.0 range (within one octave)
    while ratio < 1.0
        ratio *= 2.0
    end
    while ratio >= 2.0
        ratio /= 2.0
    end
    
    # Calculate resonance based on distance to simple ratios
    simple_ratios = [1.0, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2.0]
    
    min_distance = minimum([abs(ratio - r) for r in simple_ratios])
    
    # Resonance decreases with distance from simple ratios
    # φ-weighted exponential decay
    exp(-min_distance * PHI * 10.0)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  TETRACTYS — The Sacred Triangle
# ═══════════════════════════════════════════════════════════════════════════════

"""
Tetractys Lattice — The sacred 1+2+3+4=10 structure

The Tetractys represents:
- Row 1 (1 point): The Monad — Unity
- Row 2 (2 points): The Dyad — Polarity  
- Row 3 (3 points): The Triad — Harmony
- Row 4 (4 points): The Tetrad — Cosmos (4 elements)
"""
struct TetractysLattice
    points::Vector{Tuple{Float64, Float64}}  # 10 points in 2D
    levels::Vector{Int}  # Level of each point (1-4)
    
    function TetractysLattice()
        points = Tuple{Float64, Float64}[]
        levels = Int[]
        
        # Build the tetractys from top to bottom
        for row in 1:4
            for col in 1:row
                # x position: centered, with spacing based on row
                x = (col - 1.0) - (row - 1.0) / 2.0
                # y position: rows going down
                y = -(row - 1.0) * SQRT3 / 2.0
                push!(points, (x, y))
                push!(levels, row)
            end
        end
        
        new(points, levels)
    end
end

"""
Fold a 10-element array into tetractys structure
"""
function tetractys_fold(values::Vector{T}) where T
    if length(values) != 10
        throw(ArgumentError("Tetractys requires exactly 10 elements"))
    end
    
    # Return as nested structure: [[v1], [v2,v3], [v4,v5,v6], [v7,v8,v9,v10]]
    [
        [values[1]],
        values[2:3],
        values[4:6],
        values[7:10]
    ]
end

"""
Unfold tetractys structure back to flat array
"""
function tetractys_unfold(tetractys::Vector{Vector{T}}) where T
    vcat(tetractys...)
end

"""
Get the (row, position) coordinate for index i (1-10) in tetractys
"""
function tetractys_coordinate(i::Int)::Tuple{Int, Int}
    if i < 1 || i > 10
        throw(ArgumentError("Index must be 1-10"))
    end
    
    # Calculate which row this index belongs to
    # Row 1: index 1
    # Row 2: indices 2-3
    # Row 3: indices 4-6
    # Row 4: indices 7-10
    
    cumsum = [1, 3, 6, 10]
    row = findfirst(x -> x >= i, cumsum)
    
    # Position within row
    start_of_row = row == 1 ? 0 : cumsum[row-1]
    position = i - start_of_row
    
    (row, position)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  PYTHAGOREAN MEANS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Mean proportional (geometric mean of two numbers)

If a:x = x:b, then x = √(ab)

This is the fundamental Pythagorean proportion.
"""
function mean_proportional(a::Float64, b::Float64)::Float64
    sqrt(a * b)
end

"""
Geometric mean — the Pythagorean mean

G = ⁿ√(x₁ × x₂ × ... × xₙ)
"""
function geometric_mean(values::Vector{Float64})::Float64
    prod(values)^(1.0/length(values))
end

"""
Harmonic mean — rate averaging

H = n / Σ(1/xᵢ)
"""
function harmonic_mean(values::Vector{Float64})::Float64
    length(values) / sum(1.0 ./ values)
end

"""
Pythagorean triple mean — combines arithmetic, geometric, and harmonic

A ≥ G ≥ H (always, with equality only when all values are equal)
"""
function pythagorean_mean(values::Vector{Float64})::NamedTuple{(:arithmetic, :geometric, :harmonic), Tuple{Float64, Float64, Float64}}
    a = mean(values)
    g = geometric_mean(values)
    h = harmonic_mean(values)
    (arithmetic=a, geometric=g, harmonic=h)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  SACRED GEOMETRY RATIOS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Great Pyramid ratio — the slope angle encoded φ

The Great Pyramid's height/base ratio ≈ √φ
Its face angle is 51.83° which relates to π and φ
"""
function great_pyramid_ratio()::Float64
    GREAT_PYRAMID_RATIO  # √φ ≈ 1.272
end

"""
Vesica Piscis ratio — two overlapping circles

The ratio of the vesica's height to its width is √3
This shape appears throughout sacred geometry.
"""
function vesica_piscis()::Float64
    VESICA_PISCIS_RATIO  # √3/2 ≈ 0.866
end

"""
Sacred cut — dividing a line in golden ratio

Given a line of length L, the sacred cut divides it into:
- Major part: L × φ / (φ + 1) = L / φ
- Minor part: L × 1 / (φ + 1) = L / φ²
"""
function sacred_cut(length::Float64)::Tuple{Float64, Float64}
    major = length * PHI_INV
    minor = length * PHI_INV * PHI_INV
    (major, minor)
end

end # module PythagoreanSubstrate
