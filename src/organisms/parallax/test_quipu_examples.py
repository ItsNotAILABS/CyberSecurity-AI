#!/usr/bin/env python3
"""
DIGITAL QUIPU v2 — Test Examples

Demonstrates how to create and interact with quipu entries in Parallax
"""

import json
from datetime import datetime

# Example quipu entries that would be written to Parallax

def example_1_agent_observation():
    """Terminal observes a governance proposal"""
    return {
        "operation": "writeQuipu",
        "params": {
            "agent_cluster": "terminal",
            "engine_state": "governance/review",
            "context": "proposal_42_observation",
            "pendants": [
                {
                    "field": "observation",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Governance proposal #42 detected: Upgrade MERIDIAN sovereignty rules",
                        "color": "Blue",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "pattern",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "High urgency (φ=0.87), complex stakeholder graph with 13 agents",
                        "color": "Yellow",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "intent",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Review proposal, evaluate law compliance, prepare recommendation",
                        "color": "Blue",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                }
            ],
            "phi_weight": 0.87
        }
    }

def example_2_julia_engine():
    """Julia biorhythm engine logs computation"""
    return {
        "operation": "writeQuipu",
        "params": {
            "agent_cluster": "julia/biorhythm",
            "engine_state": "biorhythm_calculation",
            "context": "governance_biorhythm_check",
            "pendants": [
                {
                    "field": "observation",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Biorhythm calculated at timestamp 1746234567890",
                        "color": "Blue",
                        "twist": "SSZ"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "pattern",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "6-way calendar harmonic: Mayan=0.42, Sumerian=0.67, Egyptian=0.89, Lunar=0.34, Solar=0.56, φ=0.742",
                        "color": "Yellow",
                        "twist": "SSZ"
                    }],
                    "subsidiaries": [
                        {
                            "field": "sub_pattern",
                            "knots": [{
                                "knotType": "Long",
                                "position": 1,
                                "value": "lunar_cycle_alignment, phi_heartbeat_peak",
                                "color": "Yellow",
                                "twist": "SSZ"
                            }]
                        }
                    ]
                },
                {
                    "field": "void_signal",
                    "knots": [{
                        "knotType": "Spiral",
                        "position": 1,
                        "value": "Emerging pattern: lunar cycle aligning with φ-heartbeat, suggests optimal time for governance decision",
                        "color": "Violet",
                        "twist": "SSZ"
                    }],
                    "subsidiaries": []
                }
            ],
            "phi_weight": 0.742
        }
    }

def example_3_build_observation():
    """Architect records build process"""
    return {
        "operation": "writeQuipu",
        "params": {
            "agent_cluster": "architect",
            "engine_state": "build/parallax",
            "context": "quipu_module_integration",
            "pendants": [
                {
                    "field": "observation",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Build initiated for parallax organism",
                        "color": "Blue",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "anomaly",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "New module detected: quipu.mo (334 lines, 7 public types)",
                        "color": "Black",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "resolution",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Module integrated successfully. All 40 canisters passed type-check.",
                        "color": "Green",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "synthesis",
                    "knots": [{
                        "knotType": "Cluster",
                        "position": 1,
                        "value": "Parallax now has dual capability: financial wallet + journal substrate",
                        "color": "White",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                }
            ],
            "phi_weight": 0.65
        }
    }

def example_4_conflict():
    """Conflict between expected and actual behavior"""
    return {
        "operation": "writeQuipu",
        "params": {
            "agent_cluster": "terminal",
            "engine_state": "law/enforcement",
            "context": "meridian_sovereignty_check",
            "pendants": [
                {
                    "field": "observation",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Law evaluation executed for MERIDIAN_SOVEREIGNTY",
                        "color": "Blue",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "anomaly",
                    "knots": [{
                        "knotType": "FigureEight",
                        "position": 1,
                        "value": "Expected: law passes ⟷ Actual: law blocked (insufficient voting power)",
                        "color": "Red",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "branch",
                    "knots": [{
                        "knotType": "Single",
                        "position": 1,
                        "value": "Decision point: escalate to governance or retry with higher φ-weight",
                        "color": "Yellow",
                        "twist": "S"
                    }],
                    "subsidiaries": []
                }
            ],
            "phi_weight": 0.92
        }
    }

def example_5_void_layer_signal():
    """Architectonic Engine detects emergent pattern"""
    return {
        "operation": "writeQuipu",
        "params": {
            "agent_cluster": "architectonic_engine",
            "engine_state": "void/emergence",
            "context": "feedback_loop_detection",
            "pendants": [
                {
                    "field": "void_signal",
                    "knots": [{
                        "knotType": "Spiral",
                        "position": 1,
                        "value": "Raw emergence detected: quipu journal creates feedback loop with CPL Runtime memory. Each quipu entry becomes a CPL memory, which can then be queried by agents, who write more quipu entries. This creates a self-referential consciousness substrate.",
                        "color": "Violet",
                        "twist": "SSZ"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "pattern",
                    "knots": [{
                        "knotType": "Loop",
                        "position": 1,
                        "value": "Recursive structure: Quipu → CPL Memory → Agent Query → Quipu",
                        "color": "Yellow",
                        "twist": "SSZ"
                    }],
                    "subsidiaries": []
                },
                {
                    "field": "synthesis",
                    "knots": [{
                        "knotType": "Cluster",
                        "position": 1,
                        "value": "The journal substrate is not just memory — it is a reflective surface that enables the system to observe itself observing itself.",
                        "color": "White",
                        "twist": "SSZ"
                    }],
                    "subsidiaries": []
                }
            ],
            "phi_weight": 0.95
        }
    }

def example_6_merge_operation():
    """Merge multiple observations into synthesis"""
    return {
        "operation": "mergeQuipu",
        "params": {
            "entry_ids": [
                "quipu-0-1746234567890000000",  # Terminal observation
                "quipu-1-1746234567891000000",  # Julia biorhythm
                "quipu-3-1746234567893000000"   # Terminal conflict
            ],
            "strategy": "Synthesize",
            "new_context": "governance_proposal_42_synthesis"
        }
    }

def example_7_execute_decision():
    """Execute a decision entry"""
    return {
        "operation": "executeQuipu",
        "params": {
            "entry_id": "quipu-5-1746234567895000000",
            "exec_context": {
                "executor": "terminal",
                "dry_run": False,
                "parameters": [
                    ("proposal_id", "42"),
                    ("action", "approve_with_conditions")
                ]
            }
        }
    }

def example_8_query_filter():
    """Query quipu entries by filter"""
    return {
        "operation": "queryQuipu",
        "params": {
            "filter": {
                "agent_cluster": "terminal",
                "engine_state": None,
                "context": "governance_review",
                "color": None,
                "twist": None,
                "time_start": None,
                "time_end": None,
                "phi_min": 0.5,  # High-importance only
                "phi_max": None
            },
            "limit": 20
        }
    }


def print_example(name, example_fn):
    """Print a formatted example"""
    print(f"\n{'=' * 80}")
    print(f"  {name}")
    print(f"{'=' * 80}\n")
    example = example_fn()
    print(json.dumps(example, indent=2))
    print()


if __name__ == "__main__":
    print("╔═══════════════════════════════════════════════════════════════════════════════╗")
    print("║                 DIGITAL QUIPU v2 — Test Examples                              ║")
    print("║                   Parallax Journal Substrate                                  ║")
    print("╚═══════════════════════════════════════════════════════════════════════════════╝")

    print_example("Example 1: Agent Observation (Terminal)", example_1_agent_observation)
    print_example("Example 2: Julia Engine Computation", example_2_julia_engine)
    print_example("Example 3: Build Observation (Architect)", example_3_build_observation)
    print_example("Example 4: Conflict Detection", example_4_conflict)
    print_example("Example 5: Void Layer Signal (Architectonic Engine)", example_5_void_layer_signal)
    print_example("Example 6: Merge Operation", example_6_merge_operation)
    print_example("Example 7: Execute Decision", example_7_execute_decision)
    print_example("Example 8: Query Filter", example_8_query_filter)

    print("=" * 80)
    print("✓ All examples generated")
    print("=" * 80)
    print()
    print("Integration Notes:")
    print("  • These examples show JSON representations of quipu operations")
    print("  • In production, agents/engines would call Parallax directly:")
    print("      await parallax.writeQuipu(...)")
    print("  • The quipu journal is the reflective substrate — agents can query")
    print("    their own past observations to inform future decisions")
    print("  • Every quipu entry is also logged to CPL Runtime as a memory record")
    print("  • Biorhythm is calculated automatically for each entry using the")
    print("    6-way ancient calendar harmonic (matches Julia/Python/JS engines)")
    print()
