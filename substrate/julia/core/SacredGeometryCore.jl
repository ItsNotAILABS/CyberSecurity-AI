"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                      SACRED GEOMETRY CORE                                    ║
║   Platonic Solids, Golden Spirals, Fibonacci Lattices, Vesica Piscis        ║
╚══════════════════════════════════════════════════════════════════════════════╝

Sacred Geometry reveals the mathematical patterns underlying creation:

1. FLOWER OF LIFE — The Blueprint of Creation
   - 19 overlapping circles
   - Contains all Platonic solids
   - Seed of Life (7 circles) at center
   - Generates Metatron's Cube

2. GOLDEN SPIRAL — Nature's Growth Pattern
   - r(θ) = a·e^(b·θ) where b = ln(φ)/(π/2)
   - Approximated by Fibonacci spiral
   - Found in shells, galaxies, hurricanes
   - The logarithmic spiral that self-replicates

3. VESICA PISCIS — Sacred Intersection
   - Two circles of equal radius, each passing through other's center
   - Width:Height ratio = 1:√3
   - Source of the "fish" symbol (Ichthys)
   - Generates square roots: √2, √3, √5

4. METATRON'S CUBE — All Platonic Solids
   - 13 circles (Fruit of Life)
   - Connecting centers reveals all 5 Platonic solids
   - 78 lines total
   - Complete geometric information

5. SRI YANTRA — Eastern Sacred Geometry
   - 9 interlocking triangles
   - 43 smaller triangles
   - Represents cosmic creation
   - φ appears in proportions

Casa de Medina — Architectos de Architectura Inteligente
"""

module SacredGeometryCore

using LinearAlgebra

export GoldenSpiral, FlowerOfLife, VesicaPiscis, MetatronsCube, SriYantra
export Torus, MerkabaField
export create_golden_spiral, create_flower_of_life, create_vesica_piscis
export create_metatrons_cube, create_sri_yantra, create_torus, create_merkaba
export point_on_spiral, spiral_arc_length, spiral_tangent
export phi_rectangle, root_rectangle, dynamic_symmetry
export sacred_ratio, harmonic_division

# ═══════════════════════════════════════════════════════════════════════════════
#  CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

const PHI = (1 + sqrt(5)) / 2
const PHI_INV = 1.0 / PHI
const PHI2 = PHI * PHI
const SQRT2 = sqrt(2)
const SQRT3 = sqrt(3)
const SQRT5 = sqrt(5)

# Golden spiral growth factor: b = ln(φ) / (π/2)
const GOLDEN_SPIRAL_B = log(PHI) / (π / 2)

# ═══════════════════════════════════════════════════════════════════════════════
#  GOLDEN SPIRAL — The Logarithmic Spiral of Growth
# ═══════════════════════════════════════════════════════════════════════════════

"""
Golden Spiral — r(θ) = a·e^(b·θ)

The only spiral that maintains the same shape as it grows.
Found throughout nature: nautilus shells, galaxy arms, hurricanes.
"""
struct GoldenSpiral
    a::Float64              # Initial radius
    b::Float64              # Growth rate (= ln(φ)/(π/2) for golden)
    center::Vector{Float64} # Spiral center
    rotation::Float64       # Initial rotation angle
    chirality::Int          # +1 clockwise, -1 counter-clockwise
    
    function GoldenSpiral(;a::Float64=1.0, center::Vector{Float64}=[0.0, 0.0], 
                          rotation::Float64=0.0, chirality::Int=1)
        new(a, GOLDEN_SPIRAL_B, center, rotation, sign(chirality))
    end
end

"""
Calculate point on golden spiral at angle θ
"""
function point_on_spiral(spiral::GoldenSpiral, theta::Float64)::Vector{Float64}
    # r(θ) = a·e^(b·θ)
    r = spiral.a * exp(spiral.b * theta * spiral.chirality)
    
    # Convert to Cartesian
    adjusted_theta = theta + spiral.rotation
    x = r * cos(adjusted_theta)
    y = r * sin(adjusted_theta)
    
    [x + spiral.center[1], y + spiral.center[2]]
end

"""
Calculate arc length of spiral from θ₁ to θ₂

For logarithmic spiral: s = (r/b)·√(1 + b²)·[e^(b·θ₂) - e^(b·θ₁)]
"""
function spiral_arc_length(spiral::GoldenSpiral, theta1::Float64, theta2::Float64)::Float64
    b = spiral.b
    factor = sqrt(1 + b^2) / b
    
    r1 = spiral.a * exp(b * theta1)
    r2 = spiral.a * exp(b * theta2)
    
    factor * (r2 - r1)
end

"""
Calculate tangent vector at point on spiral

The tangent makes a constant angle with the radial direction.
This angle α = arctan(1/b) ≈ 72.97° for the golden spiral.
"""
function spiral_tangent(spiral::GoldenSpiral, theta::Float64)::Vector{Float64}
    b = spiral.b
    adjusted_theta = theta + spiral.rotation
    
    # Tangent angle relative to radial
    alpha = atan(1/b)
    tangent_angle = adjusted_theta + alpha * spiral.chirality
    
    [cos(tangent_angle), sin(tangent_angle)]
end

"""
Generate points along golden spiral
"""
function create_golden_spiral(;num_points::Int=100, rotations::Float64=3.0, 
                               a::Float64=1.0, center::Vector{Float64}=[0.0, 0.0])::Vector{Vector{Float64}}
    spiral = GoldenSpiral(a=a, center=center)
    
    points = Vector{Float64}[]
    for i in 0:num_points-1
        theta = (i / (num_points - 1)) * rotations * 2π
        push!(points, point_on_spiral(spiral, theta))
    end
    
    points
end

# ═══════════════════════════════════════════════════════════════════════════════
#  FLOWER OF LIFE — The Blueprint of Creation
# ═══════════════════════════════════════════════════════════════════════════════

"""
Flower of Life — 19 overlapping circles

The most important figure in sacred geometry.
Contains the patterns of everything in existence.
"""
struct FlowerOfLife
    center::Vector{Float64}
    radius::Float64           # Radius of each circle
    circles::Vector{Tuple{Float64, Float64}}  # Circle centers
    seed_of_life::Vector{Int}  # Indices of the 7 Seed of Life circles
    
    function FlowerOfLife(;center::Vector{Float64}=[0.0, 0.0], radius::Float64=1.0)
        circles = Tuple{Float64, Float64}[]
        
        # Central circle
        push!(circles, (center[1], center[2]))
        
        # First ring: 6 circles at radius distance (Seed of Life)
        for i in 0:5
            angle = i * π / 3
            x = center[1] + radius * cos(angle)
            y = center[2] + radius * sin(angle)
            push!(circles, (x, y))
        end
        
        # Second ring: 12 circles
        for i in 0:5
            # Between first ring circles
            angle1 = i * π / 3 + π / 6
            x1 = center[1] + radius * SQRT3 * cos(angle1)
            y1 = center[2] + radius * SQRT3 * sin(angle1)
            push!(circles, (x1, y1))
            
            # At 2*radius from center
            angle2 = i * π / 3
            x2 = center[1] + 2 * radius * cos(angle2)
            y2 = center[2] + 2 * radius * sin(angle2)
            push!(circles, (x2, y2))
        end
        
        seed_of_life = [1, 2, 3, 4, 5, 6, 7]  # First 7 circles
        
        new(center, radius, circles, seed_of_life)
    end
end

"""
Generate the Flower of Life pattern
"""
function create_flower_of_life(;center::Vector{Float64}=[0.0, 0.0], 
                                radius::Float64=1.0)::FlowerOfLife
    FlowerOfLife(center=center, radius=radius)
end

"""
Get points on a circle's circumference
"""
function circle_points(center::Tuple{Float64, Float64}, radius::Float64, num_points::Int)::Vector{Vector{Float64}}
    points = Vector{Float64}[]
    for i in 0:num_points-1
        angle = (i / num_points) * 2π
        x = center[1] + radius * cos(angle)
        y = center[2] + radius * sin(angle)
        push!(points, [x, y])
    end
    points
end

# ═══════════════════════════════════════════════════════════════════════════════
#  VESICA PISCIS — Sacred Intersection
# ═══════════════════════════════════════════════════════════════════════════════

"""
Vesica Piscis — Two overlapping circles

The almond-shaped intersection is the source of:
- √2 (diagonal of inner square)
- √3 (height:width ratio)
- √5 (extended construction)
- Fish symbol (Ichthys)
"""
struct VesicaPiscis
    center1::Vector{Float64}
    center2::Vector{Float64}
    radius::Float64
    width::Float64           # Width of vesica
    height::Float64          # Height of vesica
    ratio::Float64           # Height:Width = √3:1
    
    function VesicaPiscis(;center::Vector{Float64}=[0.0, 0.0], radius::Float64=1.0)
        # Two circles, each passing through the other's center
        center1 = [center[1] - radius/2, center[2]]
        center2 = [center[1] + radius/2, center[2]]
        
        # Vesica dimensions
        width = radius  # Distance between centers
        height = radius * SQRT3  # Derived from geometry
        ratio = SQRT3
        
        new(center1, center2, radius, width, height, ratio)
    end
end

"""
Create Vesica Piscis
"""
function create_vesica_piscis(;center::Vector{Float64}=[0.0, 0.0], 
                               radius::Float64=1.0)::VesicaPiscis
    VesicaPiscis(center=center, radius=radius)
end

"""
Get the boundary points of the vesica (the "fish" shape)
"""
function vesica_boundary(vp::VesicaPiscis, num_points::Int=50)::Vector{Vector{Float64}}
    points = Vector{Float64}[]
    
    # Upper arc (from circle 1)
    for i in 0:num_points÷2
        angle = (i / (num_points÷2)) * (2π/3) + π/3
        x = vp.center1[1] + vp.radius * cos(angle)
        y = vp.center1[2] + vp.radius * sin(angle)
        push!(points, [x, y])
    end
    
    # Lower arc (from circle 2)
    for i in 0:num_points÷2
        angle = (i / (num_points÷2)) * (2π/3) + π
        x = vp.center2[1] + vp.radius * cos(angle)
        y = vp.center2[2] + vp.radius * sin(angle)
        push!(points, [x, y])
    end
    
    points
end

# ═══════════════════════════════════════════════════════════════════════════════
#  METATRON'S CUBE — Contains All Platonic Solids
# ═══════════════════════════════════════════════════════════════════════════════

"""
Metatron's Cube — 13 circles with 78 connecting lines

Contains the blueprint for all 5 Platonic solids.
The circles come from the "Fruit of Life" (13 circles from Flower of Life).
"""
struct MetatronsCube
    center::Vector{Float64}
    radius::Float64
    circles::Vector{Tuple{Float64, Float64}}  # 13 circle centers
    lines::Vector{Tuple{Int, Int}}            # 78 connecting lines
    
    function MetatronsCube(;center::Vector{Float64}=[0.0, 0.0], radius::Float64=1.0)
        circles = Tuple{Float64, Float64}[]
        
        # Central circle
        push!(circles, (center[1], center[2]))
        
        # Inner ring: 6 circles
        for i in 0:5
            angle = i * π / 3
            x = center[1] + radius * cos(angle)
            y = center[2] + radius * sin(angle)
            push!(circles, (x, y))
        end
        
        # Outer ring: 6 circles at 2*radius
        for i in 0:5
            angle = i * π / 3
            x = center[1] + 2 * radius * cos(angle)
            y = center[2] + 2 * radius * sin(angle)
            push!(circles, (x, y))
        end
        
        # Connect all circles to all other circles = 78 lines
        lines = Tuple{Int, Int}[]
        for i in 1:13
            for j in i+1:13
                push!(lines, (i, j))
            end
        end
        
        new(center, radius, circles, lines)
    end
end

"""
Create Metatron's Cube
"""
function create_metatrons_cube(;center::Vector{Float64}=[0.0, 0.0], 
                                radius::Float64=1.0)::MetatronsCube
    MetatronsCube(center=center, radius=radius)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  SRI YANTRA — Eastern Sacred Geometry
# ═══════════════════════════════════════════════════════════════════════════════

"""
Sri Yantra — 9 interlocking triangles

5 downward triangles (Shakti/feminine)
4 upward triangles (Shiva/masculine)
Creates 43 smaller triangles when interlocked.
"""
struct SriYantra
    center::Vector{Float64}
    radius::Float64
    upward_triangles::Vector{Vector{Vector{Float64}}}   # 4 upward
    downward_triangles::Vector{Vector{Vector{Float64}}} # 5 downward
    bindu::Vector{Float64}  # Central point
    
    function SriYantra(;center::Vector{Float64}=[0.0, 0.0], radius::Float64=1.0)
        bindu = center
        
        # Upward triangles (masculine) - simplified construction
        upward = Vector{Vector{Float64}}[]
        scales = [0.9, 0.7, 0.5, 0.3] .* radius
        for (i, s) in enumerate(scales)
            triangle = [
                [center[1], center[2] + s],
                [center[1] - s * SQRT3/2, center[2] - s/2],
                [center[1] + s * SQRT3/2, center[2] - s/2]
            ]
            push!(upward, triangle)
        end
        
        # Downward triangles (feminine)
        downward = Vector{Vector{Float64}}[]
        scales = [1.0, 0.8, 0.6, 0.4, 0.2] .* radius
        for (i, s) in enumerate(scales)
            triangle = [
                [center[1], center[2] - s],
                [center[1] - s * SQRT3/2, center[2] + s/2],
                [center[1] + s * SQRT3/2, center[2] + s/2]
            ]
            push!(downward, triangle)
        end
        
        new(center, radius, upward, downward, bindu)
    end
end

"""
Create Sri Yantra
"""
function create_sri_yantra(;center::Vector{Float64}=[0.0, 0.0], 
                           radius::Float64=1.0)::SriYantra
    SriYantra(center=center, radius=radius)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  TORUS — The Shape of the Universe
# ═══════════════════════════════════════════════════════════════════════════════

"""
Torus — The donut shape fundamental to field theory

Parametric form:
x = (R + r·cos(v))·cos(u)
y = (R + r·cos(v))·sin(u)
z = r·sin(v)

where R = major radius, r = minor radius
"""
struct Torus
    center::Vector{Float64}
    major_radius::Float64  # Distance from center to tube center
    minor_radius::Float64  # Tube radius
    phi_ratio::Bool        # If true, R/r = φ
    
    function Torus(;center::Vector{Float64}=[0.0, 0.0, 0.0], 
                   major_radius::Float64=2.0, phi_torus::Bool=true)
        minor_radius = phi_torus ? major_radius / PHI : major_radius / 2.0
        new(center, major_radius, minor_radius, phi_torus)
    end
end

"""
Create torus with optional phi-ratio
"""
function create_torus(;center::Vector{Float64}=[0.0, 0.0, 0.0], 
                      major_radius::Float64=2.0, phi_torus::Bool=true)::Torus
    Torus(center=center, major_radius=major_radius, phi_torus=phi_torus)
end

"""
Get point on torus surface
"""
function torus_point(torus::Torus, u::Float64, v::Float64)::Vector{Float64}
    R, r = torus.major_radius, torus.minor_radius
    c = torus.center
    
    x = c[1] + (R + r * cos(v)) * cos(u)
    y = c[2] + (R + r * cos(v)) * sin(u)
    z = c[3] + r * sin(v)
    
    [x, y, z]
end

# ═══════════════════════════════════════════════════════════════════════════════
#  MERKABA — The Light Body Vehicle
# ═══════════════════════════════════════════════════════════════════════════════

"""
Merkaba Field — Two interlocking tetrahedra

One pointing up (masculine), one pointing down (feminine).
Creates a 3D Star of David when viewed from above.
"""
struct MerkabaField
    center::Vector{Float64}
    radius::Float64
    upward_tetrahedron::Vector{Vector{Float64}}
    downward_tetrahedron::Vector{Vector{Float64}}
    rotation_rate::Float64  # Counter-rotation speed
    
    function MerkabaField(;center::Vector{Float64}=[0.0, 0.0, 0.0], radius::Float64=1.0)
        # Upward tetrahedron
        up = [
            [center[1], center[2], center[3] + radius],
            [center[1] + radius * SQRT3/2, center[2] - radius/2, center[3] - radius/2],
            [center[1] - radius * SQRT3/2, center[2] - radius/2, center[3] - radius/2],
            [center[1], center[2] + radius, center[3] - radius/2]
        ]
        
        # Downward tetrahedron (inverted)
        down = [
            [center[1], center[2], center[3] - radius],
            [center[1] + radius * SQRT3/2, center[2] - radius/2, center[3] + radius/2],
            [center[1] - radius * SQRT3/2, center[2] - radius/2, center[3] + radius/2],
            [center[1], center[2] + radius, center[3] + radius/2]
        ]
        
        # Rotation rate based on φ
        rotation_rate = 2π / PHI  # One rotation per φ seconds
        
        new(center, radius, up, down, rotation_rate)
    end
end

"""
Create Merkaba field
"""
function create_merkaba(;center::Vector{Float64}=[0.0, 0.0, 0.0], 
                        radius::Float64=1.0)::MerkabaField
    MerkabaField(center=center, radius=radius)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  SACRED PROPORTIONS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Phi Rectangle — Golden rectangle

A rectangle with aspect ratio φ:1
When you remove a square from it, you get another golden rectangle!
"""
function phi_rectangle(base::Float64)::Tuple{Float64, Float64}
    (base, base * PHI)
end

"""
Root Rectangle — Rectangle with irrational ratio

√2 rectangle: Each half is similar to the whole (used in A-series paper)
√3 rectangle: Vesica Piscis ratio
√5 rectangle: Related to φ (φ = (1+√5)/2)
"""
function root_rectangle(base::Float64, root::Int)::Tuple{Float64, Float64}
    (base, base * sqrt(float(root)))
end

"""
Dynamic Symmetry — Jay Hambidge's compositional system

Divides rectangle using φ-proportions for aesthetic compositions.
Returns diagonal intersection points.
"""
function dynamic_symmetry(width::Float64, height::Float64)::Vector{Vector{Float64}}
    points = Vector{Float64}[]
    
    # Golden section points
    gx1 = width * PHI_INV
    gx2 = width * (1 - PHI_INV)
    gy1 = height * PHI_INV
    gy2 = height * (1 - PHI_INV)
    
    push!(points, [gx1, 0.0])
    push!(points, [gx2, 0.0])
    push!(points, [0.0, gy1])
    push!(points, [0.0, gy2])
    push!(points, [gx1, gy1])  # Golden intersection
    push!(points, [gx2, gy2])  # Golden intersection
    
    points
end

"""
Sacred Ratio — Common ratios in sacred geometry
"""
function sacred_ratio(name::Symbol)::Float64
    ratios = Dict{Symbol, Float64}(
        :golden => PHI,
        :golden_inverse => PHI_INV,
        :vesica => SQRT3,
        :octave => 2.0,
        :fifth => 3/2,
        :fourth => 4/3,
        :root2 => SQRT2,
        :root3 => SQRT3,
        :root5 => SQRT5,
        :pi => π,
        :e => exp(1),
        :plastic => 1.324717957244746,  # Solution to x³=x+1
        :silver => 1 + SQRT2,  # δs = 1 + √2
        :bronze => (3 + sqrt(13)) / 2
    )
    
    get(ratios, name, 1.0)
end

"""
Harmonic Division — Divide a length into φ-harmonics

Returns points that divide the length at φ, φ², φ³, etc.
"""
function harmonic_division(length::Float64, depth::Int=5)::Vector{Float64}
    divisions = Float64[]
    
    for i in 1:depth
        push!(divisions, length * PHI_INV^i)
    end
    
    divisions
end

end # module SacredGeometryCore
