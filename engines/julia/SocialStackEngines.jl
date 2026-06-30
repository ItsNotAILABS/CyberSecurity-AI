"""
Social Stack Engines — REL, COL, ROL (3 languages)

Real mathematical engines for social dynamics:
- REL: Relationship Language (graph theory, trust networks)
- COL: Collective Language (swarm intelligence, consensus)
- ROL: Role Language (responsibility assignment, capability matching)

Uses graph algorithms, eigenvector centrality, and φ-weighted trust propagation
"""

module SocialStackEngines

using LinearAlgebra

export RELEngine, COLEngine, ROLEngine, calculate_trust, achieve_consensus, assign_roles

const PHI = (1 + sqrt(5)) / 2
const PHI2 = PHI * PHI

# ═══════════════════════════════════════════════════════════════════════════
# REL: Relationship Language Engine
# ═══════════════════════════════════════════════════════════════════════════

"""
Relationship between entities with φ-weighted trust
"""
struct Relationship
    from_entity::String
    to_entity::String
    relationship_type::String  # "trusts", "collaborates", "supervises", etc.
    trust_score::Float64  # 0.0 to 1.0, φ-weighted
    evidence_count::Int
    established_at::Float64
    last_interaction::Float64
end

"""
Calculate trust score using φ-weighted decay and evidence accumulation

Trust = base_trust × φ^(evidence_count) / (φ^(evidence_count) + 1) × decay_factor
Where decay_factor = φ^(-time_since_interaction / φ_hours)
"""
function calculate_trust(
    base_trust::Float64,
    evidence_count::Int,
    time_since_interaction_hours::Float64
)::Float64

    # Evidence accumulation with φ-weighting
    phi_evidence = PHI^evidence_count
    evidence_factor = phi_evidence / (phi_evidence + 1.0)

    # Temporal decay with φ-weighting
    decay_factor = PHI^(-time_since_interaction_hours / PHI)

    # Combined trust score
    base_trust * evidence_factor * decay_factor
end

module RELEngine
    using ..SocialStackEngines: Relationship, calculate_trust, PHI
    export add_relationship, get_trust_network, compute_centrality

    relationships = Relationship[]

    function add_relationship(rel::Relationship)
        push!(relationships, rel)
        rel
    end

    function get_trust_network(entity::String)::Vector{Relationship}
        filter(r -> r.from_entity == entity || r.to_entity == entity, relationships)
    end

    """
    Compute eigenvector centrality (influence) in trust network
    Uses power iteration method with φ-normalization
    """
    function compute_centrality(entities::Vector{String})::Dict{String, Float64}
        n = length(entities)
        if n == 0
            return Dict{String, Float64}()
        end

        # Build adjacency matrix weighted by trust scores
        A = zeros(n, n)
        entity_idx = Dict(e => i for (i, e) in enumerate(entities))

        for rel in relationships
            if haskey(entity_idx, rel.from_entity) && haskey(entity_idx, rel.to_entity)
                i = entity_idx[rel.from_entity]
                j = entity_idx[rel.to_entity]
                A[i, j] = rel.trust_score
            end
        end

        # Power iteration
        v = ones(n) / n
        for _ in 1:20  # 20 iterations usually sufficient
            v_new = A * v
            # φ-weighted normalization
            v = v_new / (norm(v_new) * PHI)
        end

        # Return centrality scores
        Dict(entities[i] => v[i] for i in 1:n)
    end
end

# ═══════════════════════════════════════════════════════════════════════════
# COL: Collective Language Engine
# ═══════════════════════════════════════════════════════════════════════════

"""
Consensus proposal with φ-weighted voting
"""
struct Proposal
    proposal_id::String
    content::String
    votes_for::Int
    votes_against::Int
    votes_abstain::Int
    phi_threshold::Float64  # φ-weighted threshold for acceptance
    created_at::Float64
end

"""
Achieve consensus using φ-weighted thresholds

Consensus achieved when:
votes_for / total_votes > φ / (φ + 1) ≈ 0.618 (golden ratio threshold)
"""
function achieve_consensus(proposal::Proposal)::Bool
    total_votes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain

    if total_votes == 0
        return false
    end

    # φ-weighted approval rate
    approval_rate = proposal.votes_for / total_votes

    # Golden ratio threshold
    phi_threshold = PHI / (PHI + 1.0)  # ≈ 0.618

    approval_rate >= phi_threshold
end

module COLEngine
    using ..SocialStackEngines: Proposal, achieve_consensus, PHI
    export create_proposal, vote_on_proposal, check_consensus

    proposals = Dict{String, Proposal}()

    function create_proposal(id::String, content::String)::Proposal
        p = Proposal(id, content, 0, 0, 0, PHI / (PHI + 1.0), time() * 1000.0)
        proposals[id] = p
        p
    end

    function vote_on_proposal(id::String, vote::String)::Bool
        if !haskey(proposals, id)
            return false
        end

        p = proposals[id]
        if vote == "for"
            proposals[id] = Proposal(p.proposal_id, p.content, p.votes_for + 1, p.votes_against, p.votes_abstain, p.phi_threshold, p.created_at)
        elseif vote == "against"
            proposals[id] = Proposal(p.proposal_id, p.content, p.votes_for, p.votes_against + 1, p.votes_abstain, p.phi_threshold, p.created_at)
        elseif vote == "abstain"
            proposals[id] = Proposal(p.proposal_id, p.content, p.votes_for, p.votes_against, p.votes_abstain + 1, p.phi_threshold, p.created_at)
        end

        true
    end

    function check_consensus(id::String)::Bool
        if !haskey(proposals, id)
            return false
        end

        achieve_consensus(proposals[id])
    end
end

# ═══════════════════════════════════════════════════════════════════════════
# ROL: Role Language Engine
# ═══════════════════════════════════════════════════════════════════════════

"""
Role with capabilities and φ-weighted responsibility
"""
struct Role
    role_id::String
    role_name::String
    required_capabilities::Vector{String}
    responsibility_weight::Float64  # φ-weighted importance
    assigned_entity::Union{String, Nothing}
end

"""
Assign roles using Hungarian algorithm variant with φ-weighted matching

Matches entities to roles based on capability overlap and φ-weighted preferences
"""
function assign_roles(
    roles::Vector{Role},
    entities::Dict{String, Vector{String}},  # entity_id => capabilities
    preferences::Dict{String, Float64}=Dict{String, Float64}()  # entity_id => preference_weight
)::Dict{String, String}

    assignments = Dict{String, String}()
    available_roles = copy(roles)
    available_entities = Set(keys(entities))

    # φ-weighted greedy assignment
    while !isempty(available_roles) && !isempty(available_entities)
        best_match_score = -Inf
        best_entity = nothing
        best_role = nothing

        for entity_id in available_entities
            entity_caps = get(entities, entity_id, String[])
            entity_pref = get(preferences, entity_id, 1.0)

            for role in available_roles
                # Calculate capability overlap
                overlap = length(intersect(Set(entity_caps), Set(role.required_capabilities)))
                total_required = length(role.required_capabilities)

                if total_required > 0
                    capability_score = overlap / total_required
                else
                    capability_score = 1.0
                end

                # φ-weighted match score
                match_score = capability_score * role.responsibility_weight * entity_pref * PHI

                if match_score > best_match_score
                    best_match_score = match_score
                    best_entity = entity_id
                    best_role = role
                end
            end
        end

        if best_entity !== nothing && best_role !== nothing
            assignments[best_role.role_id] = best_entity
            delete!(available_entities, best_entity)
            filter!(r -> r.role_id != best_role.role_id, available_roles)
        else
            break
        end
    end

    assignments
end

module ROLEngine
    using ..SocialStackEngines: Role, assign_roles, PHI
    export define_role, assign_entity_to_roles, get_role_assignments

    roles = Role[]
    assignments = Dict{String, String}()

    function define_role(role::Role)
        push!(roles, role)
        role
    end

    function assign_entity_to_roles(
        entities::Dict{String, Vector{String}},
        preferences::Dict{String, Float64}=Dict{String, Float64}()
    )::Dict{String, String}
        assignments = assign_roles(roles, entities, preferences)
        assignments
    end

    function get_role_assignments()::Dict{String, String}
        assignments
    end
end

end # module SocialStackEngines
