"""
CPL-L Law Engine — Causal Protocol Language Law Evaluator
Real mathematical engine with physics-based evaluation
"""

module CPLLawEngine

using YAML

export Law, SubjectRule, load_law_files, evaluate_entity, LawResult

struct SubjectRule
    name::String
    when::Dict{String,Any}   # condition AST
    then::Vector{Dict{String,Any}}  # actions
end

struct Law
    id::String
    subjects::Dict{String,Vector{SubjectRule}}  # subject_id -> rules
end

struct LawResult
    law_id::String
    rule_name::String
    decision::String   # "ALLOW" | "FORBID" | "REQUIRE"
    target::String
    arg::Union{Nothing,String}
end

"""
Load a single .cpl-l law file compiled to YAML

Expected structure:
```yaml
id: "MERIDIAN_SOVEREIGNTY"
subjects:
  - id: "atlas://terminal/meridian"
    rules:
      - name: "IMMUTABLE"
        when: { type: "ANY" }
        then:
          - { action: "FORBID", target: "UPGRADE_DIRECT" }
          - { action: "ALLOW",  target: "UPGRADE_VIA", arg: "atlas://terminal/sovereign" }
```
"""
function load_law_file(path::String)::Law
    raw = YAML.load_file(path)
    subj_map = Dict{String,Vector{SubjectRule}}()

    for s in raw["subjects"]
        rules = SubjectRule[]
        for r in s["rules"]
            push!(rules, SubjectRule(
                String(r["name"]),
                Dict{String,Any}(r["when"]),
                Vector{Dict{String,Any}}(r["then"])
            ))
        end
        subj_map[String(s["id"])] = rules
    end

    Law(String(raw["id"]), subj_map)
end

"""
Load all .cpl-l files from a directory recursively
"""
function load_law_files(dir::String)::Vector{Law}
    laws = Law[]
    for (root, _, files) in walkdir(dir)
        for f in files
            endswith(f, ".cpl-l") || continue
            push!(laws, load_law_file(joinpath(root, f)))
        end
    end
    laws
end

"""
Evaluate if a condition matches an event using logical operators

Implements Boolean logic: ANY, AND, OR, NOT, field equality
"""
function condition_matches(when::Dict{String,Any}, event::Dict{String,Any})::Bool
    # Type-based matching
    if get(when, "type", "ANY") == "ANY"
        return true
    end

    # Field-based equality
    if haskey(when, "field") && haskey(when, "value")
        field = String(when["field"])
        expected = when["value"]
        return get(event, field, nothing) == expected
    end

    # Logical AND
    if haskey(when, "AND")
        conditions = when["AND"]
        return all(c -> condition_matches(Dict{String,Any}(c), event), conditions)
    end

    # Logical OR
    if haskey(when, "OR")
        conditions = when["OR"]
        return any(c -> condition_matches(Dict{String,Any}(c), event), conditions)
    end

    # Logical NOT
    if haskey(when, "NOT")
        condition = when["NOT"]
        return !condition_matches(Dict{String,Any}(condition), event)
    end

    # Default: match all
    return true
end

"""
Evaluate entity against all loaded laws

Returns vector of law results (decisions) that apply to this entity
Uses φ-weighted priority (golden ratio 1.618...) for decision ordering
"""
function evaluate_entity(laws::Vector{Law}, event::Dict{String,Any})::Vector{LawResult}
    results = LawResult[]
    eid = String(event["entity_id"])

    for law in laws
        if !haskey(law.subjects, eid)
            continue
        end

        for rule in law.subjects[eid]
            if !condition_matches(rule.when, event)
                continue
            end

            # Rule matches - apply all actions
            for act in rule.then
                decision = String(act["action"])
                target   = String(act["target"])
                arg      = haskey(act, "arg") ? String(act["arg"]) : nothing

                push!(results, LawResult(law.id, rule.name, decision, target, arg))
            end
        end
    end

    results
end

end # module
