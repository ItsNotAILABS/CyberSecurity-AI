#!/usr/bin/env julia

"""
NOVA Cognitive Engine CLI
Real executable interface to Julia mathematical engines

Usage:
    ./nova-engine law evaluate --entity-id "atlas://terminal/meridian" --event-type "upgrade" --laws-dir ./laws
    ./nova-engine pipeline run --pipeline ./pipelines/governance.cpl-p --context '{"salience":0.8}'
    ./nova-engine organism task --org-id terminal --capability governance_review --task '{"priority":5}'
    ./nova-engine governance cycle --config ./config.json
"""

using ArgParse
using JSON3

# Load all engine modules
include("CPLLawEngine.jl")
include("CPLPipelineEngine.jl")
include("OrganismRuntime.jl")
include("AtlasGovernance.jl")

using .CPLLawEngine
using .CPLPipelineEngine
using .OrganismRuntime
using .AtlasGovernance

function parse_commandline()
    s = ArgParseSettings()

    @add_arg_table! s begin
        "law"
            help = "CPL-L Law Engine commands"
            action = :command
        "pipeline"
            help = "CPL-P Pipeline Engine commands"
            action = :command
        "organism"
            help = "Organism Runtime commands"
            action = :command
        "governance"
            help = "Atlas Governance commands"
            action = :command
    end

    # Law subcommands
    @add_arg_table! s["law"] begin
        "evaluate"
            help = "Evaluate entity against laws"
            action = :command
    end

    @add_arg_table! s["law"]["evaluate"] begin
        "--entity-id"
            help = "Entity ID to evaluate"
            required = true
        "--event-type"
            help = "Event type (e.g., 'upgrade', 'governance_check')"
            default = "governance_check"
        "--laws-dir"
            help = "Directory containing .cpl-l law files"
            required = true
        "--context"
            help = "Additional context as JSON"
            default = "{}"
    end

    # Pipeline subcommands
    @add_arg_table! s["pipeline"] begin
        "run"
            help = "Run a CPL-P pipeline"
            action = :command
    end

    @add_arg_table! s["pipeline"]["run"] begin
        "--pipeline"
            help = "Path to .cpl-p pipeline file"
            required = true
        "--context"
            help = "Execution context as JSON"
            default = "{}"
    end

    # Organism subcommands
    @add_arg_table! s["organism"] begin
        "task"
            help = "Run organism task"
            action = :command
        "biorhythm"
            help = "Calculate organism biorhythm"
            action = :command
    end

    @add_arg_table! s["organism"]["task"] begin
        "--org-id"
            help = "Organism ID"
            required = true
        "--ocl"
            help = "Path to OCL file"
            required = true
        "--sil"
            help = "Path to SIL file"
            required = true
        "--pil"
            help = "Path to PIL file"
            default = ""
        "--cil-log"
            help = "Path to CIL log file"
            required = true
        "--ril-dir"
            help = "Directory for RIL incidents"
            required = true
        "--capability"
            help = "Required capability"
            required = true
        "--task"
            help = "Task data as JSON"
            default = "{}"
    end

    @add_arg_table! s["organism"]["biorhythm"] begin
        "--timestamp"
            help = "Timestamp in milliseconds (defaults to now)"
            arg_type = Float64
            default = time() * 1000.0
    end

    # Governance subcommands
    @add_arg_table! s["governance"] begin
        "cycle"
            help = "Run full governance cycle"
            action = :command
    end

    @add_arg_table! s["governance"]["cycle"] begin
        "--registry"
            help = "Path to language registry"
            required = true
        "--entities"
            help = "Directory containing entity JSON files"
            required = true
        "--pipelines"
            help = "Directory containing .cpl-p pipeline files"
            required = true
        "--laws"
            help = "Directory containing .cpl-l law files"
            required = true
        "--organisms"
            help = "Directory containing organism definitions"
            required = true
        "--output"
            help = "Output file for report (JSON)"
            default = ""
    end

    parse_args(s)
end

function cmd_law_evaluate(args)
    entity_id = args["entity-id"]
    event_type = args["event-type"]
    laws_dir = args["laws-dir"]
    context = JSON3.read(args["context"])

    println("Loading laws from: $laws_dir")
    laws = CPLLawEngine.load_law_files(laws_dir)
    println("Loaded $(length(laws)) law(s)")

    event = Dict{String,Any}(
        "entity_id" => entity_id,
        "op" => event_type,
        "context" => Dict{String,Any}(context)
    )

    println("\nEvaluating entity: $entity_id")
    results = CPLLawEngine.evaluate_entity(laws, event)

    println("\nLaw Evaluation Results:")
    println("=" ^ 80)
    for r in results
        println("$(r.law_id).$(r.rule_name):")
        println("  Decision: $(r.decision)")
        println("  Target: $(r.target)")
        if r.arg !== nothing
            println("  Arg: $(r.arg)")
        end
    end
    println("=" ^ 80)
    println("\nTotal decisions: $(length(results))")

    # Return JSON for machine consumption
    output = Dict(
        "entity_id" => entity_id,
        "event_type" => event_type,
        "results" => [Dict(
            "law_id" => r.law_id,
            "rule_name" => r.rule_name,
            "decision" => r.decision,
            "target" => r.target,
            "arg" => r.arg
        ) for r in results]
    )

    println("\nJSON Output:")
    println(JSON3.write(output))
end

function cmd_pipeline_run(args)
    pipeline_path = args["pipeline"]
    context_json = JSON3.read(args["context"])

    println("Loading pipeline: $pipeline_path")
    p = CPLPipelineEngine.load_pipeline_file(pipeline_path)
    println("Loaded pipeline: $(p.id) with $(length(p.steps)) step(s)")

    # Convert JSON3 object to Dict properly
    ctx = Dict{String,Any}()
    for (k, v) in pairs(context_json)
        ctx[String(k)] = v
    end

    println("\nRunning pipeline...")
    logs = CPLPipelineEngine.run_pipeline(p, ctx)

    println("\nPipeline Execution Logs:")
    println("=" ^ 80)
    for log in logs
        println("$(log.step_id) [$(log.use)]:")
        println("  Status: $(log.status)")
        println("  φ-Score: $(round(log.phi_score, digits=4))")
        println("  Notes: $(log.notes)")
        println("  Timestamp: $(log.timestamp)")
    end
    println("=" ^ 80)
    println("\nTotal steps executed: $(length(logs))")

    # Return JSON
    output = Dict(
        "pipeline_id" => p.id,
        "logs" => [Dict(
            "step_id" => log.step_id,
            "use" => log.use,
            "status" => log.status,
            "phi_score" => log.phi_score,
            "notes" => log.notes,
            "timestamp" => log.timestamp
        ) for log in logs]
    )

    println("\nJSON Output:")
    println(JSON3.write(output))
end

function cmd_organism_task(args)
    org_id = args["org-id"]
    ocl_path = args["ocl"]
    sil_path = args["sil"]
    pil_path = args["pil"]
    cil_log = args["cil-log"]
    ril_dir = args["ril-dir"]
    capability = args["capability"]
    task_json = JSON3.read(args["task"])

    println("Loading organism: $org_id")
    org = OrganismRuntime.load_organism(org_id;
        ocl_path = ocl_path,
        sil_path = sil_path,
        pil_path = pil_path,
        cil_log_path = cil_log,
        ril_dir = ril_dir
    )

    task = Dict{String,Any}(task_json)
    task["capability"] = capability

    println("\nCalculating biorhythm...")
    biorhythm = OrganismRuntime.calculate_biorhythm(time() * 1000.0)
    println("Current biorhythm: $(round(biorhythm, digits=4))")

    println("\nRunning task with capability: $capability")
    result = OrganismRuntime.run_task(org, task)

    println("\nTask Result:")
    println("=" ^ 80)
    println("Status: $(result["status"])")
    if haskey(result, "biorhythm")
        println("Final Biorhythm: $(round(result["biorhythm"], digits=4))")
    end
    if haskey(result, "reason")
        println("Reason: $(result["reason"])")
    end
    println("=" ^ 80)

    # Return JSON
    println("\nJSON Output:")
    println(JSON3.write(result))
end

function cmd_organism_biorhythm(args)
    timestamp = args["timestamp"]

    biorhythm = OrganismRuntime.calculate_biorhythm(timestamp)

    println("Biorhythm Calculation:")
    println("=" ^ 80)
    println("Timestamp: $(timestamp)ms")
    println("Biorhythm Score: $(round(biorhythm, digits=6))")
    println("=" ^ 80)
    println("\nAncient Calendar Harmonics:")
    println("  Mayan:    1440ms cycle (24 minutes)")
    println("  Sumerian: 3600ms cycle (60 minutes)")
    println("  Egyptian: 2160ms cycle (36 minutes)")
    println("  Lunar:    2551ms cycle (φ-derived)")
    println("  Solar:    8760ms cycle (hour angle)")
    println("  φ-Heart:  873ms cycle (540 × φ)")

    output = Dict(
        "timestamp_ms" => timestamp,
        "biorhythm" => biorhythm
    )

    println("\nJSON Output:")
    println(JSON3.write(output))
end

function cmd_governance_cycle(args)
    cfg = AtlasGovernance.GovernanceConfig(
        args["registry"],
        args["entities"],
        args["pipelines"],
        args["laws"],
        args["organisms"]
    )

    println("Running Atlas Governance Cycle...")
    println("=" ^ 80)

    report = AtlasGovernance.run_governance_cycle(cfg)

    AtlasGovernance.print_report(report)

    # Save to file if requested
    if args["output"] != ""
        output_data = Dict(
            "timestamp" => report.timestamp,
            "total_entities" => report.total_entities,
            "laws_evaluated" => report.laws_evaluated,
            "pipelines_run" => report.pipelines_run,
            "organisms_active" => report.organisms_active,
            "entropy" => report.entropy,
            "coherence" => report.coherence,
            "reports" => report.reports
        )

        open(args["output"], "w") do io
            write(io, JSON3.write(output_data, 2))
        end

        println("\nReport saved to: $(args["output"])")
    end
end

function main()
    args = parse_commandline()

    try
        if args["%COMMAND%"] == "law"
            if args["law"]["%COMMAND%"] == "evaluate"
                cmd_law_evaluate(args["law"]["evaluate"])
            end
        elseif args["%COMMAND%"] == "pipeline"
            if args["pipeline"]["%COMMAND%"] == "run"
                cmd_pipeline_run(args["pipeline"]["run"])
            end
        elseif args["%COMMAND%"] == "organism"
            if args["organism"]["%COMMAND%"] == "task"
                cmd_organism_task(args["organism"]["task"])
            elseif args["organism"]["%COMMAND%"] == "biorhythm"
                cmd_organism_biorhythm(args["organism"]["biorhythm"])
            end
        elseif args["%COMMAND%"] == "governance"
            if args["governance"]["%COMMAND%"] == "cycle"
                cmd_governance_cycle(args["governance"]["cycle"])
            end
        end
    catch e
        println(stderr, "ERROR: $e")
        println(stderr, "")
        Base.show_backtrace(stderr, catch_backtrace())
        exit(1)
    end
end

# Run main if executed as script
if abspath(PROGRAM_FILE) == @__FILE__
    main()
end
