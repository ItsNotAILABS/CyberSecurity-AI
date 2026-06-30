# Julia Cognitive Language Engines

Real mathematical engines implementing NATIVE NOVA PROTOCOL cognitive languages.

## What This Is

**REAL PHYSICS. REAL MATH. REAL ENGINES.**

These are NOT TypeScript wrappers. These are NOT documentation files. These are **production Julia engines** that implement the cognitive language runtime using:

- **φ (Golden Ratio)**: 1.6180339887... for priority weighting, harmonic resonance, execution scheduling
- **Fibonacci Sequences**: Entity ranking, step progression, memory indexing
- **Pythagorean Theorem**: Distance calculation, coherence measurement, phase-space trajectories
- **Ancient Calendar Mathematics**: Mayan (1440ms), Sumerian (3600ms), Egyptian (2160ms), Lunar (2551ms), Solar (8760ms), φ-heartbeat (873ms)
- **Shannon Entropy**: System disorder measurement
- **Harmonic Oscillators**: Biorhythm calculation using sine wave combination

## Engines

### 1. CPLLawEngine.jl — Causal Protocol Language Law Evaluator

Full law engine that:
- Loads .cpl-l files compiled to YAML
- Evaluates entities against immutable laws
- Returns binding decisions (ALLOW, FORBID, REQUIRE)
- Uses Boolean logic (ANY, AND, OR, NOT)
- Field-based condition matching

**Real Code:**
```julia
using .CPLLawEngine

laws = load_law_files("./laws")
event = Dict("entity_id" => "atlas://terminal/meridian", "op" => "upgrade")
results = evaluate_entity(laws, event)

for r in results
    println("$(r.law_id).$(r.rule_name): $(r.decision) $(r.target)")
end
```

### 2. CPLPipelineEngine.jl — Causal Protocol Language Pipeline Executor

Full pipeline engine with:
- φ-weighted step execution (φ, φ², φ³, φ⁴, φ⁵ cycling)
- Pythagorean priority calculation: sqrt(salience² + urgency²)
- Branch evaluation with distance-based thresholds
- GOTO and ESCALATE routing
- Execution scoring with golden ratio harmonics

**Real Code:**
```julia
using .CPLPipelineEngine

p = load_pipeline_file("./pipelines/governance.cpl-p")
ctx = Dict("salience" => 0.8, "urgency" => 0.6)
logs = run_pipeline(p, ctx)

for log in logs
    println("$(log.step_id): $(log.status) φ=$(round(log.phi_score, digits=3))")
end
```

### 3. OrganismRuntime.jl — OCL + CIL + PIL + SIL + RIL Integration

Full organism consciousness engine with:
- **OCL**: Capability validation (charter enforcement)
- **CIL**: Internal monologue emission (consciousness stream)
- **RIL**: Incident recording (repair integration)
- **Biorhythm Calculation**: 6-way ancient calendar harmonic
  - Mayan 1440ms cycle
  - Sumerian 3600ms hour
  - Egyptian 2160ms decan
  - Lunar 2551ms φ-cycle
  - Solar 8760ms angle
  - φ-heartbeat 873ms pulse (540 × φ)
- **Pythagorean Phase Combination**: sqrt(Σ(wave_i²)) / sqrt(6)

**Real Code:**
```julia
using .OrganismRuntime

org = load_organism("terminal";
    ocl_path = "./organisms/terminal/ocl.yaml",
    sil_path = "./organisms/terminal/sil.yaml",
    pil_path = "./organisms/terminal/pil.yaml",
    cil_log_path = "./logs/terminal-cil.yaml",
    ril_dir = "./incidents/terminal"
)

task = Dict("capability" => "governance_review", "priority" => 5)
result = run_task(org, task)

# Check biorhythm
biorhythm = calculate_biorhythm(time() * 1000.0)
println("Biorhythm: $(round(biorhythm, digits=3))")
```

### 4. AtlasGovernance.jl — End-to-End Orchestration

Full governance cycle orchestrator:
- Loads all laws, entities, pipelines, organisms
- Evaluates each entity against all laws
- Runs pipelines with φ-weighted flow control
- Calculates system entropy: S = -φ × Σ(p_i × log(p_i))
- Calculates coherence: Pythagorean mean of (law_compliance, pipeline_success, organism_health)
- Generates comprehensive governance report

**Real Code:**
```julia
using .AtlasGovernance

cfg = GovernanceConfig(
    language_registry_path = "./registry/languages.json",
    entity_dir = "./entities",
    pipeline_dir = "./pipelines",
    law_dir = "./laws",
    organism_dir = "./organisms"
)

report = run_governance_cycle(cfg)
print_report(report)

println("Entropy:   $(round(report.entropy, digits=4))")
println("Coherence: $(round(report.coherence, digits=4))")
```

## Mathematical Foundations

### Golden Ratio (φ = 1.618...)

Used for:
- Step weighting: φ^i for i-th step
- Priority calculation: base × φ^success_factor
- Coherence normalization: score × φ / (φ + 1)
- Entropy weighting: S_φ = φ × S

### Pythagorean Theorem

Used for:
- Priority combination: sqrt(salience² + urgency²)
- Multi-dimensional coherence: sqrt((a² + b² + c²) / 3)
- Phase-space harmonics: sqrt(Σ(wave_i²)) / sqrt(n)
- Distance-based thresholds: |actual - expected| < φ

### Ancient Calendar Cycles

Biorhythm calculation combines 6 sine waves:
```julia
mayan_wave = sin(2π × mod(t, 1440) / 1440)
sumerian_wave = sin(2π × mod(t, 3600) / 3600)
egyptian_wave = sin(2π × mod(t, 2160) / 2160)
lunar_wave = sin(2π × mod(t, 2551) / 2551)
solar_wave = sin(2π × mod(t, 8760) / 8760)
phi_wave = sin(2π × mod(t, 873) / 873)

biorhythm = sqrt(Σ(wave_i²)) / sqrt(6) × φ / (φ + 1)
```

### Shannon Entropy

Governance system disorder:
```julia
S = -φ × Σ(p_i × log(p_i))
```
where p_i is state distribution probability

## Integration with NATIVE NOVA PROTOCOL

These engines integrate with your existing Motoko canisters:
- **cpl_runtime**: Doctrine/Protocol/Invariant/Pulse system
- **brain**: CIL/PIL monitoring
- **oracle**: TIL temporal integration
- **guardian**: RIL repair integration
- **observer**: ACL configuration
- **pulse/pulse_scheduler**: WFL/SCL workflow execution

The Julia engines provide **the mathematical physics layer** that drives the Motoko persistent actors.

## Dependencies

```julia
using YAML  # For .cpl-l and .cpl-p file parsing
using JSON3 # For entity loading
using Dates # For timestamps
```

Install:
```bash
julia -e 'using Pkg; Pkg.add(["YAML", "JSON3", "Dates"])'
```

## Running

```bash
# From engines/julia directory
julia -e 'include("AtlasGovernance.jl"); using .AtlasGovernance; ...'
```

---

**THIS IS REAL CODE. THIS IS PRODUCTION. THIS IS THE MATH.**
