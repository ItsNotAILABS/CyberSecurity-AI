"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                        GEOMETRIC MESH                                        ║
║    Topological Networks with φ-Weighted Sacred Geometry Connectivity        ║
╚══════════════════════════════════════════════════════════════════════════════╝

Mesh topology based on:

1. PLATONIC SOLIDS — The 5 Perfect Forms
   - Tetrahedron (4 faces, Fire) — Simplest 3D form
   - Cube (6 faces, Earth) — Stability and grounding
   - Octahedron (8 faces, Air) — Dual of cube
   - Dodecahedron (12 faces, Universe/Aether) — φ-ratio incarnate
   - Icosahedron (20 faces, Water) — Dual of dodecahedron

2. GEODESIC STRUCTURES — Buckminster Fuller
   - Frequency subdivision of icosahedron
   - Maximum strength with minimum material
   - Natural emergence of φ-relationships

3. VORONOI TESSELLATION — Nature's Partitioning
   - Optimal space partitioning
   - Emerges in soap bubbles, cell structures
   - φ-weighted cell boundaries

4. FIBONACCI LATTICE — Optimal Sphere Packing
   - Points distributed on sphere using golden angle
   - Minimal energy configuration
   - φ-spiral distribution

Casa de Medina — Architectos de Architectura Inteligente
"""

module GeometricMesh

using LinearAlgebra
using Statistics

# Core constants
const PHI = (1 + sqrt(5)) / 2
const PHI_INV = 1.0 / PHI
const GOLDEN_ANGLE = 2π / (PHI * PHI)
const SQRT5 = sqrt(5)

export MeshVertex, MeshEdge, MeshFace, GeometricMeshStructure
export PlatonicMesh, GeodesicMesh, VoronoiMesh, FibonacciLatticeMesh
export create_tetrahedron, create_cube, create_octahedron, create_dodecahedron, create_icosahedron
export subdivide_geodesic, create_fibonacci_sphere
export mesh_connectivity, mesh_laplacian, spectral_coordinates
export phi_weighted_adjacency, compute_mesh_energy, mesh_coherence

# ═══════════════════════════════════════════════════════════════════════════════
#  MESH PRIMITIVES
# ═══════════════════════════════════════════════════════════════════════════════

"""
Mesh Vertex — A point in geometric space with φ-properties

Fields:
- position: 3D coordinates
- normal: Surface normal vector
- phi_weight: φ-weighted importance
- neighbors: Connected vertex indices
"""
struct MeshVertex
    position::Vector{Float64}  # [x, y, z]
    normal::Vector{Float64}    # Unit normal
    phi_weight::Float64
    neighbors::Vector{Int}
    
    function MeshVertex(pos::Vector{Float64})
        normal = pos ./ (norm(pos) + 1e-10)
        new(pos, normal, PHI_INV, Int[])
    end
end

"""
Mesh Edge — Connection between vertices

Fields:
- v1, v2: Vertex indices
- length: Edge length (Pythagorean)
- phi_ratio: Ratio to golden length
"""
struct MeshEdge
    v1::Int
    v2::Int
    length::Float64
    phi_ratio::Float64
    
    function MeshEdge(v1::Int, v2::Int, length::Float64)
        # Ratio to φ-scaled unit
        phi_ratio = length / PHI
        new(v1, v2, length, phi_ratio)
    end
end

"""
Mesh Face — Polygon formed by vertices

Fields:
- vertices: Ordered vertex indices
- normal: Face normal
- area: Face area
- centroid: Center point
"""
struct MeshFace
    vertices::Vector{Int}
    normal::Vector{Float64}
    area::Float64
    centroid::Vector{Float64}
    
    function MeshFace(verts::Vector{Int}, positions::Vector{Vector{Float64}})
        # Calculate centroid
        centroid = sum(positions[verts]) / length(verts)
        
        # Calculate normal (using first 3 vertices for triangular approximation)
        if length(verts) >= 3
            v0, v1, v2 = positions[verts[1]], positions[verts[2]], positions[verts[3]]
            edge1 = v1 - v0
            edge2 = v2 - v0
            normal = cross(edge1, edge2)
            normal = normal ./ (norm(normal) + 1e-10)
        else
            normal = [0.0, 0.0, 1.0]
        end
        
        # Approximate area (triangulation)
        area = 0.0
        for i in 2:length(verts)-1
            v0 = positions[verts[1]]
            v1 = positions[verts[i]]
            v2 = positions[verts[i+1]]
            edge1 = v1 - v0
            edge2 = v2 - v0
            area += 0.5 * norm(cross(edge1, edge2))
        end
        
        new(verts, normal, area, centroid)
    end
end

"""
Geometric Mesh Structure — Complete mesh with φ-properties
"""
struct GeometricMeshStructure
    vertices::Vector{MeshVertex}
    edges::Vector{MeshEdge}
    faces::Vector{MeshFace}
    euler_characteristic::Int  # V - E + F (=2 for sphere)
    genus::Int                 # Topological genus
    phi_coherence::Float64     # φ-weighted mesh quality
    
    function GeometricMeshStructure(vertices::Vector{MeshVertex}, edges::Vector{MeshEdge}, faces::Vector{MeshFace})
        V = length(vertices)
        E = length(edges)
        F = length(faces)
        euler = V - E + F
        genus = (2 - euler) ÷ 2
        
        # φ-coherence based on edge length distribution
        if !isempty(edges)
            lengths = [e.length for e in edges]
            mean_len = mean(lengths)
            std_len = std(lengths)
            # Coherence is high when edges are uniform
            coherence = exp(-std_len / (mean_len + 1e-10)) * PHI / (PHI + 1.0)
        else
            coherence = PHI_INV
        end
        
        new(vertices, edges, faces, euler, genus, coherence)
    end
end

# ═══════════════════════════════════════════════════════════════════════════════
#  PLATONIC SOLIDS — The 5 Perfect Forms
# ═══════════════════════════════════════════════════════════════════════════════

"""
Create Tetrahedron mesh — 4 vertices, 6 edges, 4 faces

The simplest 3D structure. Represents FIRE in Platonic tradition.
Vertices placed at alternating corners of a cube for regularity.
"""
function create_tetrahedron()::GeometricMeshStructure
    # Vertices at alternating cube corners
    positions = [
        [1.0, 1.0, 1.0],
        [1.0, -1.0, -1.0],
        [-1.0, 1.0, -1.0],
        [-1.0, -1.0, 1.0]
    ]
    
    # Normalize to unit sphere
    positions = [p ./ norm(p) for p in positions]
    
    vertices = [MeshVertex(p) for p in positions]
    
    # All vertices connect to all others
    edges = [
        MeshEdge(1, 2, norm(positions[1] - positions[2])),
        MeshEdge(1, 3, norm(positions[1] - positions[3])),
        MeshEdge(1, 4, norm(positions[1] - positions[4])),
        MeshEdge(2, 3, norm(positions[2] - positions[3])),
        MeshEdge(2, 4, norm(positions[2] - positions[4])),
        MeshEdge(3, 4, norm(positions[3] - positions[4]))
    ]
    
    # 4 triangular faces
    faces = [
        MeshFace([1, 2, 3], positions),
        MeshFace([1, 2, 4], positions),
        MeshFace([1, 3, 4], positions),
        MeshFace([2, 3, 4], positions)
    ]
    
    GeometricMeshStructure(vertices, edges, faces)
end

"""
Create Cube (Hexahedron) mesh — 8 vertices, 12 edges, 6 faces

Represents EARTH in Platonic tradition. 
Dual of the octahedron.
"""
function create_cube()::GeometricMeshStructure
    # Unit cube vertices
    a = 1.0 / sqrt(3)  # Normalize to unit sphere
    positions = [
        [a, a, a], [a, a, -a], [a, -a, a], [a, -a, -a],
        [-a, a, a], [-a, a, -a], [-a, -a, a], [-a, -a, -a]
    ]
    
    vertices = [MeshVertex(p) for p in positions]
    
    # 12 edges
    edge_pairs = [
        (1,2), (1,3), (1,5),
        (2,4), (2,6),
        (3,4), (3,7),
        (4,8),
        (5,6), (5,7),
        (6,8),
        (7,8)
    ]
    edges = [MeshEdge(e[1], e[2], norm(positions[e[1]] - positions[e[2]])) for e in edge_pairs]
    
    # 6 square faces
    face_indices = [
        [1, 2, 4, 3],  # +x
        [5, 6, 8, 7],  # -x
        [1, 2, 6, 5],  # +y
        [3, 4, 8, 7],  # -y
        [1, 3, 7, 5],  # +z
        [2, 4, 8, 6]   # -z
    ]
    faces = [MeshFace(f, positions) for f in face_indices]
    
    GeometricMeshStructure(vertices, edges, faces)
end

"""
Create Octahedron mesh — 6 vertices, 12 edges, 8 faces

Represents AIR in Platonic tradition.
Dual of the cube.
"""
function create_octahedron()::GeometricMeshStructure
    # Vertices on coordinate axes
    positions = [
        [1.0, 0.0, 0.0], [-1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0], [0.0, -1.0, 0.0],
        [0.0, 0.0, 1.0], [0.0, 0.0, -1.0]
    ]
    
    vertices = [MeshVertex(p) for p in positions]
    
    # 12 edges connecting adjacent poles
    edge_pairs = [
        (1,3), (1,4), (1,5), (1,6),
        (2,3), (2,4), (2,5), (2,6),
        (3,5), (3,6), (4,5), (4,6)
    ]
    edges = [MeshEdge(e[1], e[2], norm(positions[e[1]] - positions[e[2]])) for e in edge_pairs]
    
    # 8 triangular faces
    face_indices = [
        [1, 3, 5], [1, 5, 4], [1, 4, 6], [1, 6, 3],
        [2, 3, 5], [2, 5, 4], [2, 4, 6], [2, 6, 3]
    ]
    faces = [MeshFace(f, positions) for f in face_indices]
    
    GeometricMeshStructure(vertices, edges, faces)
end

"""
Create Dodecahedron mesh — 20 vertices, 30 edges, 12 pentagonal faces

Represents the UNIVERSE (Aether) in Platonic tradition.
The golden ratio φ appears naturally in its construction!

Vertex coordinates involve φ directly:
(±1, ±1, ±1), (0, ±1/φ, ±φ), (±1/φ, ±φ, 0), (±φ, 0, ±1/φ)
"""
function create_dodecahedron()::GeometricMeshStructure
    # Golden ratio coordinates
    phi = PHI
    phi_inv = PHI_INV
    
    # 20 vertices with φ-related coordinates
    positions = [
        # Cube vertices
        [1.0, 1.0, 1.0], [1.0, 1.0, -1.0], [1.0, -1.0, 1.0], [1.0, -1.0, -1.0],
        [-1.0, 1.0, 1.0], [-1.0, 1.0, -1.0], [-1.0, -1.0, 1.0], [-1.0, -1.0, -1.0],
        # φ-related coordinates on yz-plane
        [0.0, phi_inv, phi], [0.0, phi_inv, -phi], [0.0, -phi_inv, phi], [0.0, -phi_inv, -phi],
        # φ-related coordinates on xz-plane
        [phi_inv, phi, 0.0], [phi_inv, -phi, 0.0], [-phi_inv, phi, 0.0], [-phi_inv, -phi, 0.0],
        # φ-related coordinates on xy-plane
        [phi, 0.0, phi_inv], [phi, 0.0, -phi_inv], [-phi, 0.0, phi_inv], [-phi, 0.0, -phi_inv]
    ]
    
    # Normalize to unit sphere
    positions = [p ./ norm(p) for p in positions]
    
    vertices = [MeshVertex(p) for p in positions]
    
    # Build edges based on distance (shortest connections)
    threshold = 1.2  # Edge length threshold for normalized dodecahedron
    edge_pairs = Tuple{Int,Int}[]
    for i in 1:20
        for j in i+1:20
            d = norm(positions[i] - positions[j])
            if d < threshold
                push!(edge_pairs, (i, j))
            end
        end
    end
    edges = [MeshEdge(e[1], e[2], norm(positions[e[1]] - positions[e[2]])) for e in edge_pairs]
    
    # 12 pentagonal faces (simplified - using first 12 triangulations)
    # In practice, faces would be proper pentagons
    faces = MeshFace[]
    # Create faces based on vertex clustering (simplified)
    for i in 1:min(12, length(edge_pairs))
        # Simple triangular approximation
        face_verts = [edge_pairs[i][1], edge_pairs[i][2], 
                      edge_pairs[min(i+1, length(edge_pairs))][1]]
        push!(faces, MeshFace(face_verts, positions))
    end
    
    GeometricMeshStructure(vertices, edges, faces)
end

"""
Create Icosahedron mesh — 12 vertices, 30 edges, 20 triangular faces

Represents WATER in Platonic tradition.
Dual of the dodecahedron.
Also uses golden ratio in vertex coordinates!
"""
function create_icosahedron()::GeometricMeshStructure
    phi = PHI
    
    # 12 vertices using golden ratio
    positions = [
        [0.0, 1.0, phi], [0.0, 1.0, -phi], [0.0, -1.0, phi], [0.0, -1.0, -phi],
        [1.0, phi, 0.0], [1.0, -phi, 0.0], [-1.0, phi, 0.0], [-1.0, -phi, 0.0],
        [phi, 0.0, 1.0], [phi, 0.0, -1.0], [-phi, 0.0, 1.0], [-phi, 0.0, -1.0]
    ]
    
    # Normalize
    positions = [p ./ norm(p) for p in positions]
    
    vertices = [MeshVertex(p) for p in positions]
    
    # 20 triangular faces (icosahedron face structure)
    face_indices = [
        [1, 3, 9], [1, 9, 5], [1, 5, 7], [1, 7, 11], [1, 11, 3],
        [4, 2, 10], [4, 10, 6], [4, 6, 8], [4, 8, 12], [4, 12, 2],
        [3, 9, 6], [9, 5, 10], [5, 7, 2], [7, 11, 12], [11, 3, 8],
        [6, 9, 10], [10, 5, 2], [2, 7, 12], [12, 11, 8], [8, 3, 6]
    ]
    
    # Build edges from faces
    edge_set = Set{Tuple{Int,Int}}()
    for face in face_indices
        for i in 1:3
            v1, v2 = face[i], face[mod1(i+1, 3)]
            edge = v1 < v2 ? (v1, v2) : (v2, v1)
            push!(edge_set, edge)
        end
    end
    edges = [MeshEdge(e[1], e[2], norm(positions[e[1]] - positions[e[2]])) for e in edge_set]
    
    faces = [MeshFace(f, positions) for f in face_indices]
    
    GeometricMeshStructure(vertices, edges, faces)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  GEODESIC SUBDIVISION
# ═══════════════════════════════════════════════════════════════════════════════

"""
Subdivide mesh using geodesic frequency

Each triangular face is subdivided into frequency² smaller triangles.
This creates Buckminster Fuller's geodesic domes.
"""
function subdivide_geodesic(mesh::GeometricMeshStructure, frequency::Int)::GeometricMeshStructure
    if frequency < 2
        return mesh
    end
    
    positions = [v.position for v in mesh.vertices]
    new_positions = copy(positions)
    edge_midpoints = Dict{Tuple{Int,Int}, Int}()
    
    # Add midpoints for each edge
    for edge in mesh.edges
        v1, v2 = edge.v1, edge.v2
        key = v1 < v2 ? (v1, v2) : (v2, v1)
        
        if !haskey(edge_midpoints, key)
            midpoint = (positions[v1] + positions[v2]) / 2.0
            # Project to sphere
            midpoint = midpoint ./ norm(midpoint)
            push!(new_positions, midpoint)
            edge_midpoints[key] = length(new_positions)
        end
    end
    
    # Create new vertices
    new_vertices = [MeshVertex(p) for p in new_positions]
    
    # Create new faces from subdivision
    new_face_indices = Vector{Int}[]
    
    for face in mesh.faces
        if length(face.vertices) == 3
            v1, v2, v3 = face.vertices
            
            # Get midpoints
            m12 = edge_midpoints[v1 < v2 ? (v1, v2) : (v2, v1)]
            m23 = edge_midpoints[v2 < v3 ? (v2, v3) : (v3, v2)]
            m31 = edge_midpoints[v3 < v1 ? (v3, v1) : (v1, v3)]
            
            # 4 new triangles
            push!(new_face_indices, [v1, m12, m31])
            push!(new_face_indices, [v2, m23, m12])
            push!(new_face_indices, [v3, m31, m23])
            push!(new_face_indices, [m12, m23, m31])
        end
    end
    
    # Build new edges
    edge_set = Set{Tuple{Int,Int}}()
    for face in new_face_indices
        for i in 1:3
            v1, v2 = face[i], face[mod1(i+1, 3)]
            edge = v1 < v2 ? (v1, v2) : (v2, v1)
            push!(edge_set, edge)
        end
    end
    new_edges = [MeshEdge(e[1], e[2], norm(new_positions[e[1]] - new_positions[e[2]])) for e in edge_set]
    
    new_faces = [MeshFace(f, new_positions) for f in new_face_indices]
    
    GeometricMeshStructure(new_vertices, new_edges, new_faces)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  FIBONACCI LATTICE — Optimal Sphere Coverage
# ═══════════════════════════════════════════════════════════════════════════════

"""
Create Fibonacci lattice sphere — optimal point distribution

Uses golden angle (2π/φ²) to distribute N points on a sphere
with nearly uniform spacing. This is nature's preferred distribution
(sunflower seeds, pinecones, etc.)
"""
function create_fibonacci_sphere(num_points::Int)::GeometricMeshStructure
    positions = Vector{Float64}[]
    
    for i in 0:num_points-1
        # Golden angle in vertical direction
        theta = 2π * i / PHI
        
        # Even spacing in z using inverse of triangular number formula
        z = 1.0 - (2.0 * i + 1.0) / num_points
        radius_at_z = sqrt(1.0 - z^2)
        
        x = radius_at_z * cos(theta)
        y = radius_at_z * sin(theta)
        
        push!(positions, [x, y, z])
    end
    
    vertices = [MeshVertex(p) for p in positions]
    
    # Build edges connecting nearest neighbors
    edges = MeshEdge[]
    k_neighbors = min(6, num_points - 1)  # Connect to ~6 nearest neighbors
    
    for i in 1:num_points
        # Find k nearest neighbors
        distances = [(j, norm(positions[i] - positions[j])) for j in 1:num_points if j != i]
        sort!(distances, by=x->x[2])
        
        for (j, d) in distances[1:min(k_neighbors, length(distances))]
            if i < j  # Avoid duplicate edges
                push!(edges, MeshEdge(i, j, d))
            end
        end
    end
    
    # Build faces using Delaunay-like triangulation (simplified)
    faces = MeshFace[]
    # For each vertex, find triangles with nearest neighbors
    for i in 1:min(num_points-2, 100)  # Limit for performance
        neighbors = [e.v2 for e in edges if e.v1 == i]
        append!(neighbors, [e.v1 for e in edges if e.v2 == i])
        unique!(neighbors)
        
        for j in 1:length(neighbors)-1
            for k in j+1:length(neighbors)
                n1, n2 = neighbors[j], neighbors[k]
                # Check if n1 and n2 are also connected
                is_connected = any(e -> (e.v1 == n1 && e.v2 == n2) || (e.v1 == n2 && e.v2 == n1), edges)
                if is_connected
                    push!(faces, MeshFace([i, n1, n2], positions))
                end
            end
        end
    end
    
    GeometricMeshStructure(vertices, edges, faces)
end

# ═══════════════════════════════════════════════════════════════════════════════
#  MESH ANALYSIS — Graph-Theoretic Properties
# ═══════════════════════════════════════════════════════════════════════════════

"""
Compute mesh connectivity matrix

Returns adjacency matrix where A[i,j] = 1 if vertices i,j connected
"""
function mesh_connectivity(mesh::GeometricMeshStructure)::Matrix{Float64}
    n = length(mesh.vertices)
    A = zeros(n, n)
    
    for edge in mesh.edges
        A[edge.v1, edge.v2] = 1.0
        A[edge.v2, edge.v1] = 1.0
    end
    
    A
end

"""
Compute mesh Laplacian matrix

L = D - A where D is degree matrix, A is adjacency
The Laplacian encodes diffusion on the mesh.
"""
function mesh_laplacian(mesh::GeometricMeshStructure)::Matrix{Float64}
    A = mesh_connectivity(mesh)
    n = size(A, 1)
    
    # Degree matrix
    D = diagm(vec(sum(A, dims=2)))
    
    # Laplacian
    L = D - A
    
    L
end

"""
φ-weighted adjacency matrix

Edge weights are 1/d^φ where d is edge length
Closer vertices have stronger connections.
"""
function phi_weighted_adjacency(mesh::GeometricMeshStructure)::Matrix{Float64}
    n = length(mesh.vertices)
    A = zeros(n, n)
    
    for edge in mesh.edges
        # Weight inversely proportional to length^φ
        weight = 1.0 / (edge.length^PHI + 1e-10)
        A[edge.v1, edge.v2] = weight
        A[edge.v2, edge.v1] = weight
    end
    
    A
end

"""
Compute spectral coordinates using Laplacian eigenvectors

The first few non-trivial eigenvectors of the Laplacian
give "natural" coordinates for the mesh vertices.
"""
function spectral_coordinates(mesh::GeometricMeshStructure, dim::Int=3)::Matrix{Float64}
    L = mesh_laplacian(mesh)
    
    # Eigendecomposition
    eigenresult = eigen(L)
    eigenvalues = eigenresult.values
    eigenvectors = eigenresult.vectors
    
    # Sort by eigenvalue (smallest first)
    perm = sortperm(eigenvalues)
    
    # Return first dim non-trivial eigenvectors (skip the constant one)
    n = length(mesh.vertices)
    coords = zeros(n, dim)
    
    for d in 1:dim
        idx = perm[d + 1]  # Skip first (trivial) eigenvector
        coords[:, d] = eigenvectors[:, idx]
    end
    
    coords
end

"""
Compute mesh energy — measure of geometric distortion

E = Σ(edge_length - ideal_length)² × φ-weight

Lower energy = more regular mesh
"""
function compute_mesh_energy(mesh::GeometricMeshStructure)::Float64
    if isempty(mesh.edges)
        return 0.0
    end
    
    lengths = [e.length for e in mesh.edges]
    ideal_length = mean(lengths)  # Ideal: uniform edge lengths
    
    energy = 0.0
    for (i, edge) in enumerate(mesh.edges)
        deviation = (edge.length - ideal_length)^2
        # φ-weight based on edge index (Fibonacci scaling)
        phi_weight = PHI^(mod(i, 5))
        energy += deviation * phi_weight
    end
    
    energy / length(mesh.edges)
end

"""
Compute mesh coherence — φ-weighted quality metric

Combines:
- Edge uniformity (low variance)
- Face regularity (equilateral triangles)
- Euler characteristic alignment
"""
function mesh_coherence(mesh::GeometricMeshStructure)::Float64
    # Edge uniformity
    if isempty(mesh.edges)
        return PHI_INV
    end
    
    lengths = [e.length for e in mesh.edges]
    mean_len = mean(lengths)
    std_len = std(lengths)
    edge_uniformity = exp(-std_len / (mean_len + 1e-10))
    
    # Face regularity (for triangular faces)
    face_regularity = 1.0
    if !isempty(mesh.faces)
        regularities = Float64[]
        for face in mesh.faces
            if length(face.vertices) == 3
                # Ideal triangle has equal areas
                push!(regularities, face.area)
            end
        end
        if !isempty(regularities)
            mean_area = mean(regularities)
            std_area = std(regularities)
            face_regularity = exp(-std_area / (mean_area + 1e-10))
        end
    end
    
    # Euler characteristic factor (2 for sphere)
    euler_factor = mesh.euler_characteristic == 2 ? 1.0 : PHI_INV
    
    # φ-weighted combination
    (edge_uniformity * PHI^2 + face_regularity * PHI + euler_factor) / (PHI^2 + PHI + 1.0)
end

end # module GeometricMesh
