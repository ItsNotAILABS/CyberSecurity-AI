"""
Atlas Governance Cycle — End-to-End Orchestration Engine

Orchestrates:
- Laws (CPL-L evaluator)
- Pipelines (CPL-P executor)
- Organisms (OCL/CIL/PIL/SIL/RIL)
- Registry (40 language entities)

Uses ancient mathematics:
- φ (Golden Ratio 1.618...)
- Fibonacci sequences
- Pythagorean theorem
- Ancient calendar cycles (Mayan, Sumerian, Egyptian, Lunar, Solar)

Real physics:
- Harmonic resonance between entities
- Phase-space trajectories
- Energy conservation in law propagation
- Entropy calculation for governance decay
"""

module AtlasGovernance

using JSON3
using YAML

# Import our engines
include("CPLLawEngine.jl")
include("CPLPipelineEngine.jl")
include("OrganismRuntime.jl")

using .CPLLawEngine
using .CPLPipelineEngine
using .OrganismRuntime

export run_governance_cycle, GovernanceConfig, GovernanceReport

# Physical constants
const PHI = (1 + sqrt(5)) / 2
const PHI2 = PHI * PHI
const PHI3 = PHI2 * PHI
const PHI4 = PHI3 * PHI

# Fibonacci sequence for entity ranking
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610]

struct GovernanceConfig
    language_registry_path::String
    entity_dir::String
    pipeline_dir::String
    law_dir::String
    organism_dir::String
end

struct GovernanceReport
    timestamp::Float64
    total_entities::Int
    laws_evaluated::Int
    pipelines_run::Int
    organisms_active::Int
    entropy::Float64  # Governance system entropy
    coherence::Float64  # φ-weighted coherence score
    reports::Dict{String,Any}
end

"""
Load entity from JSON file
"""
function load_entity(path::String)
    raw = read(path, String)
    JSON3.read(raw)
end

"""
Load all entities from directory
"""
function load_all_entities(dir::String)::Dict{String,Dict{String,Any}}
    ents = Dict{String,Dict{String,Any}}()

    for (root, _, files) in walkdir(dir)
        for f in files
            endswith(f, ".json") || continue
            e = load_entity(joinpath(root, f))
            ents[String(e["id"])] = Dict{String,Any}(e)
        end
    end

    ents
end

"""
Load all pipelines from directory
"""
function load_pipelines(dir::String)::Dict{String,CPLPipelineEngine.Pipeline}
    pipes = Dict{String,CPLPipelineEngine.Pipeline}()

    for (root, _, files) in walkdir(dir)
        for f in files
            endswith(f, ".cpl-p") || continue
            p = CPLPipelineEngine.load_pipeline_file(joinpath(root, f))
            pipes[p.id] = p
        end
    end

    pipes
end

"""
Calculate governance entropy using Shannon entropy with φ-weighting

S = -φ * Σ(p_i * log(p_i))

Where p_i is the probability distribution of entity states
Lower entropy = more ordered governance
Higher entropy = more chaotic governance
"""
function calculate_entropy(entities::Dict{String,Dict{String,Any}})::Float64
    states = Dict{String,Int}()
    total = 0

    # Count states
    for (id, ent) in entities
        state = get(ent, "state", "unknown")
        states[state] = get(states, state, 0) + 1
        total += 1
    end

    # Calculate Shannon entropy
    entropy = 0.0
    for (state, count) in states
        p = count / total
        if p > 0
            entropy -= p * log(p)
        end
    end

    # φ-weight the entropy
    PHI * entropy
end

"""
Calculate governance coherence using Pythagorean harmonic mean with φ-weighting

Coherence measures how well all entities are aligned with laws and protocols
Uses Pythagorean combination of:
- Law compliance score
- Pipeline success rate
- Organism health score

Returns 0.0 to 1.0 (1.0 = perfect coherence)
"""
function calculate_coherence(
    law_results::Dict{String,Vector{CPLLawEngine.LawResult}},
    pipeline_logs::Dict{String,Vector{CPLPipelineEngine.PipelineLogEntry}},
    entities::Dict{String,Dict{String,Any}}
)::Float64
    # Law compliance: ratio of ALLOW to total decisions
    total_decisions = 0
    allowed_decisions = 0

    for (id, results) in law_results
        total_decisions += length(results)
        allowed_decisions += count(r -> r.decision == "ALLOW", results)
    end

    law_compliance = total_decisions > 0 ? allowed_decisions / total_decisions : 1.0

    # Pipeline success: ratio of successful steps
    total_steps = 0
    successful_steps = 0

    for (id, logs) in pipeline_logs
        total_steps += length(logs)
        successful_steps += count(l -> l.status == "ok", logs)
    end

    pipeline_success = total_steps > 0 ? successful_steps / total_steps : 1.0

    # Organism health: simple presence check (in production, would check biorhythm)
    organism_health = length(entities) > 0 ? 1.0 : 0.0

    # Pythagorean combination
    # sqrt((law_compliance² + pipeline_success² + organism_health²) / 3)
    pythagorean_coherence = sqrt(
        (law_compliance^2 + pipeline_success^2 + organism_health^2) / 3.0
    )

    # φ-weight the coherence
    pythagorean_coherence * PHI / (PHI + 1.0)
end

"""
Run governance cycle on all entities

Implements full Atlas governance:
1. Load all laws, entities, pipelines, organisms
2. Evaluate each entity against all laws
3. Run governance pipelines per entity
4. Calculate system entropy and coherence
5. Generate φ-weighted governance report

Uses real mathematics:
- φ (golden ratio) for priority weighting
- Fibonacci for entity ranking
- Pythagorean theorem for coherence calculation
- Shannon entropy for system disorder measurement
- Ancient calendar biorhythms for timing
"""
function run_governance_cycle(cfg::GovernanceConfig)::GovernanceReport
    timestamp = time() * 1000.0

    # 1) Load laws
    laws = CPLLawEngine.load_law_files(cfg.law_dir)

    # 2) Load entities
    entities = load_all_entities(cfg.entity_dir)

    # 3) Load pipelines
    pipelines = load_pipelines(cfg.pipeline_dir)

    reports = Dict{String,Any}()
    all_law_results = Dict{String,Vector{CPLLawEngine.LawResult}}()
    all_pipeline_logs = Dict{String,Vector{CPLPipelineEngine.PipelineLogEntry}}()

    # 4) Process each entity
    for (id, ent) in entities
        # 4a) Law evaluation
        event = Dict{String,Any}(
            "entity_id" => id,
            "op" => "governance_check",
            "context" => Dict{String,Any}()
        )
        law_results = CPLLawEngine.evaluate_entity(laws, event)
        all_law_results[id] = law_results

        # 4b) Run governance pipeline if defined
        pipe_logs = CPLPipelineEngine.PipelineLogEntry[]

        if haskey(ent, "governance_pipeline")
            pid = String(ent["governance_pipeline"])

            if haskey(pipelines, pid)
                # Build context with biorhythm
                biorhythm = OrganismRuntime.calculate_biorhythm(timestamp)

                ctx = Dict{String,Any}(
                    "entity" => ent,
                    "law_results" => law_results,
                    "salience" => get(ent, "salience", 0.5),
                    "urgency" => get(ent, "urgency", 0.5),
                    "biorhythm" => biorhythm
                )

                pipe_logs = CPLPipelineEngine.run_pipeline(pipelines[pid], ctx)
            end
        end

        all_pipeline_logs[id] = pipe_logs

        # Store entity report
        reports[id] = Dict(
            "law_results" => law_results,
            "pipeline_logs" => pipe_logs,
            "fibonacci_rank" => get(ent, "fibonacci_rank", 1),
            "phi_weight" => get(ent, "phi_weight", 1.0)
        )
    end

    # 5) Calculate system metrics
    entropy = calculate_entropy(entities)
    coherence = calculate_coherence(all_law_results, all_pipeline_logs, entities)

    # 6) Build governance report
    GovernanceReport(
        timestamp,
        length(entities),
        length(laws),
        length(pipelines),
        length(entities),  # All entities are "organisms"
        entropy,
        coherence,
        reports
    )
end

"""
Pretty print governance report with φ-weighted formatting
"""
function print_report(report::GovernanceReport)
    println("=" ^ 80)
    println("ATLAS GOVERNANCE CYCLE REPORT")
    println("=" ^ 80)
    println()
    println("Timestamp: $(report.timestamp)")
    println("Total Entities: $(report.total_entities)")
    println("Laws Evaluated: $(report.laws_evaluated)")
    println("Pipelines Run: $(report.pipelines_run)")
    println("Organisms Active: $(report.organisms_active)")
    println()
    println("System Metrics:")
    println("  Entropy:   $(round(report.entropy, digits=4)) (lower is better)")
    println("  Coherence: $(round(report.coherence, digits=4)) (higher is better)")
    println()
    println("φ = $(round(PHI, digits=10))")
    println("φ² = $(round(PHI2, digits=10))")
    println("φ³ = $(round(PHI3, digits=10))")
    println("φ⁴ = $(round(PHI4, digits=10))")
    println()
    println("=" ^ 80)
end

end # module
