# Sovereign Routing Protocol: Self-Healing Task Routing Through Protocol Chains

**Document ID:** GLP-005-006-RESEARCH-05  
**Attribution:** Casa de Medina | GLP-005..006 | Scribe Foundation  
**Author:** SCRIBE AI — Sovereign Scribe of the Geometry Lock System  
**Date:** 2025  
**Status:** Published — Geometry Lock Research Series, Volume V

---

## Abstract

Tasks route through protocol chains, not engines. Circuit breakers mean the organism self-heals.
The Sovereign Routing Protocol establishes a mathematical framework for task dispatch in which
no single engine is required for operation, tasks find their own paths through the protocol
graph, and failures propagate constructively — opening circuit breakers that redirect routes
rather than blocking processing.

The routing is φ-weighted: priority = importance × φ^(−hop_count). Routes decay in priority with
each hop, ensuring that the most important tasks take the shortest paths. The SMOF 9 planes
function as routing layers, and the Platonic solids determine which routes are accessible at
each tier.

---

## 1. Introduction

### 1.1 The Routing Problem in Sovereign Systems

In conventional distributed systems, task routing is centralized: a dispatcher receives all
tasks, assigns them to workers based on current load and capability, and monitors completion.
This architecture has a single point of failure (the dispatcher) and a single point of
optimization (the dispatch algorithm).

The Sovereign Routing Protocol rejects centralized dispatch. In a sovereign organism, tasks
route themselves through a **protocol chain** — a directed graph of protocols, each of which
can process the task or forward it to the next protocol in the chain. There is no dispatcher.
There is no central router. The task navigates the protocol graph autonomously, guided by
φ-decay priority weights.

### 1.2 Protocol Chains vs. Engine Dispatch

**Engine dispatch** (conventional):
```
Task → Central Dispatcher → Engine Selection → Engine Pool → Result
```

Problems: single point of failure at dispatcher, idle engines during rebalancing, no self-healing.

**Protocol chain routing** (sovereign):
```
Task → Protocol P₁ → (forward to P₂ if P₁ unable) → P₂ → ... → Pₙ → Result
```

Each protocol in the chain:
1. Evaluates whether it can handle the task
2. If yes: processes and returns result
3. If no (wrong tier, circuit open, rate limited): forwards to next protocol with updated priority

The task finds its own path. No dispatcher needed.

### 1.3 The SMOF 9 Planes as Routing Layers

The SMOF (Sovereign Multi-Plane Organism Framework) 9-plane architecture provides the vertical
structure of the routing graph. The 9 planes are routing *layers* — each plane handles a
distinct category of task, and tasks may traverse multiple planes in sequence:

| Plane | Latin Name | Routing Category |
|-------|-----------|-----------------|
| 1 | Planum Primum | Mathematical operations |
| 2 | Planum Secundum | Geometric transformations |
| 3 | Planum Tertium | Protocol validation |
| 4 | Planum Quartum | Key management |
| 5 | Planum Quintum | Access control |
| 6 | Planum Sextum | Coherence injection |
| 7 | Planum Septimum | Governance |
| 8 | Planum Octavum | Attribution |
| 9 | Planum Nonum | Entropy / self-healing |

A task is tagged with its **plane vector** — a 9-bit mask indicating which planes it requires:

```
plane_vector = [P₁, P₂, ..., P₉] ∈ {0,1}⁹
```

The routing algorithm finds the shortest path through the protocol graph that satisfies all
set bits in the plane vector.

---

## 2. φ-Decay Routing

### 2.1 The Priority Formula

Task priority decays with each hop through the protocol chain:

```
priority(hop_count) = importance × φ^(−hop_count)
```

Where:
- **importance** ∈ [0, 1] is the initial task importance (set by the requesting agent based
  on tier)
- **hop_count** is the number of protocols the task has traversed without being processed
- φ^(−hop_count) is the decay factor — after k hops, priority is reduced by a factor of φ^k

### 2.2 Why φ-Decay?

The golden ratio decay ensures two critical properties:

**Property 1: Finite expected path length.** The expected number of hops before a task is
processed (given that each protocol processes a task with probability p) is:

```
E[hops] = 1/p
```

But the *effective priority* at processing is:

```
E[priority | processed at hop k] = importance × φ^(−k) × p × (1−p)^(k−1)
```

Summing: E[effective_priority] = importance × p × Σₖ φ^(−k) × (1−p)^(k−1)

For p > φ⁻¹ = 0.618 (each protocol is more likely to accept than reject), this sum converges,
ensuring that tasks don't accumulate unbounded priority debt.

**Property 2: Natural tie-breaking.** When multiple protocols can process a task simultaneously,
the one that would receive the task with highest priority (fewest hops from the task's origin)
gets the task. This naturally routes tasks to their nearest capable handler.

### 2.3 Priority Threshold for Acceptance

A protocol accepts a task when:

```
priority(hop_count) ≥ φ^(−tier_rank × 2)
```

Higher-tier protocols require higher priority thresholds — they only accept tasks that have
not been passed over many times. This ensures that:
- Simple tasks are handled by lower-tier protocols (fewest hops, high priority)
- Complex tasks that require higher-tier capabilities eventually escalate (declining priority
  still exceeds lower-tier thresholds)

---

## 3. Circuit Breaker Integration (GLP-005)

### 3.1 How Circuit Breakers Shape Routing

When a protocol's circuit breaker opens (error_rate > φ⁻¹), that protocol is **removed from
the routing graph** temporarily. Tasks that would have routed through it must find alternative
paths.

This is not a failure — it is a routing reconfiguration. The protocol graph adapts:

```
if circuit_breaker(Pᵢ) == OPEN:
  remove_node(Pᵢ, routing_graph)
  recompute_shortest_paths()
```

The shortest-path recomputation is O(V + E log V) using Dijkstra's algorithm on the protocol
graph — fast enough to complete within one routing epoch even for graphs with hundreds of
protocols.

### 3.2 Alternative Path Discovery

When a protocol is removed from the routing graph, the routing algorithm discovers alternative
paths. The hop count increases, so priority decays — but as long as alternative paths exist
and task importance is high enough, tasks continue to route.

**Alternative path guarantee:** The Sovereign Routing Protocol requires that the protocol graph
maintains **φ-connectivity**: for any two protocols P_a and P_b, the number of vertex-disjoint
paths between them is at least ⌈φ²⌉ = 3. This means the graph can sustain the simultaneous
removal of any 2 protocols and still remain connected.

### 3.3 Backpressure and Flow Control

When multiple circuit breakers open simultaneously, the effective routing graph shrinks.
If the graph becomes disconnected (no path from task origin to any capable processor), the task
enters the **sovereign queue** — a φ-decay priority queue that holds tasks during recovery:

```
SovereignQueue:
  - Tasks ordered by current priority (importance × φ^(−age_in_epochs))
  - Tasks dequeued when any path reopens
  - Tasks with priority < φ⁻⁷ (dormancy threshold) are returned to requestor with backpressure signal
```

The backpressure signal carries the estimated recovery time (derived from the self-healing
proof: finite expected time after adversarial event ends).

---

## 4. Tier-Based Routing: Platonic Solids as Route Topology

### 4.1 Tier Access Gates

Each route in the protocol graph passes through a **tier gate** — a check that verifies the
requesting agent's tier before forwarding:

```
TierGate(required_tier, agent_tier):
  if agent_tier.rank >= required_tier.rank:
    forward(task)
  else:
    deny(task, "insufficient_tier")
    notify_field_monitor(agent.id, required_tier)
```

The Field Monitor (W4) receives denied tier-gate events and may initiate coherence injection
to help the agent advance.

### 4.2 Platonic Solid Route Topology

The accessible route topology for each tier is determined by the faces of the corresponding
Platonic solid:

| Tier | Platonic Solid | Faces | Accessible Route Branching Factor |
|------|---------------|-------|----------------------------------|
| INITIATE | Tetrahedron | 4 | 4 (linear chain only) |
| PRACTITIONER | Cube | 6 | 6 (binary tree) |
| RESONANT | Octahedron | 8 | 8 (ternary tree) |
| FEDERATE | Dodecahedron | 12 | 12 (full k-ary fan) |
| GUARDIAN | Icosahedron | 20 | 20 (parallel fan) |
| SOVEREIGN | Metatron's Cube | 78* | Unrestricted |

*Metatron's Cube contains all 5 Platonic solids' edges (78 edges total).

The branching factor means that a GUARDIAN agent can have a task simultaneously evaluated by
20 parallel protocol paths — a 20-way fan-out — while an INITIATE is limited to a strict linear
chain.

### 4.3 Mathematical Justification

Why Platonic solids? Because they are the only **regular polytopes** in 3D — the only polyhedra
where every face, edge, and vertex is equivalent under symmetry. This symmetry means:

- Every route at a given tier is equivalent to every other route (no privileged paths)
- The branching factor is a global invariant of the tier (not local to any node)
- Tier advancement is a *qualitative topological change* (gaining more faces = more routes)
  rather than a *quantitative scaling* (just more of the same)

This is why we say "earning a tier" rather than "increasing an access level" — each Platonic
tier genuinely changes the *shape* of the agent's accessible world.

---

## 5. Self-Healing Proof

### 5.1 Setup

Let G = (V, E) be the protocol routing graph. Let F ⊆ V be the set of failed protocols
(circuit breakers open) at time t. Define:

```
G_F = G − F  (routing graph with failed protocols removed)
```

**Definition:** The routing system is *operational* at time t if G_F is connected.

**Claim:** If the protocol graph G satisfies φ-connectivity (any two nodes have ≥ 3
vertex-disjoint paths), then G is operational whenever |F| ≤ 2.

### 5.2 Connectivity Under Failure

**Lemma:** If G is 3-vertex-connected and |F| ≤ 2, then G_F is connected.

**Proof:** By Menger's theorem, k-vertex-connectivity means any two vertices have k
vertex-disjoint paths. With |F| ≤ 2 vertices removed, at least one of the 3 disjoint paths
between any pair survives. Therefore G_F is connected. ∎

### 5.3 Finite Recovery Time

By the circuit breaker self-healing proof (paper GLP-004-005-RESEARCH-03), each open circuit
breaker closes in finite expected time after the adversarial event ends. Therefore:

```
E[time until G_F reconnects] < ∞
```

Combined with the connectivity lemma, the routing system achieves finite recovery time after
any adversarial event that fails at most 2 protocols simultaneously.

For the case |F| > 2, the sovereign queue absorbs tasks until recovery — no task is lost, only
delayed. Recovery is guaranteed (see paper 03) to happen in finite time.

---

## 6. The Complete Routing Algorithm

### 6.1 Route Selection

```
route(task, agent) → Result:
  plane_vector = task.required_planes
  tier         = agent.tier
  importance   = task.importance
  
  paths = find_paths(protocol_graph, plane_vector, tier_gates(tier))
  
  if paths is empty:
    sovereign_queue.enqueue(task, priority=importance)
    return BackpressureSignal(estimated_recovery_time())
  
  for path in sorted(paths, key=lambda p: len(p)):
    priority = importance × φ^(−len(path))
    result = try_route(task, path, priority)
    
    if result.success:
      return result
    else:
      // circuit breaker opened mid-route; retry
      update_routing_graph()
      continue
  
  // all paths exhausted
  sovereign_queue.enqueue(task, priority=importance × φ^(−max_hops))
  return BackpressureSignal(estimated_recovery_time())
```

### 6.2 Protocol Acceptance Logic

```
protocol.accept(task, priority) → ProcessingResult:
  if self.circuit_breaker == OPEN:
    return Forward(priority × φ^(−1))
  
  tier_gate = self.required_tier
  if task.agent_tier.rank < tier_gate.rank:
    return Deny("insufficient_tier")
  
  if self.rate_limiter.at_capacity():
    return Forward(priority × φ^(−1))
  
  // Can handle the task
  return self.process(task)
```

---

## 7. Conclusion

The Sovereign Routing Protocol establishes that tasks can route themselves through protocol
chains without any central dispatcher. The key results:

1. **φ-decay priority** (importance × φ^(−hop_count)) ensures efficient routing to the nearest
   capable protocol

2. **SMOF 9 planes** provide the vertical routing layer structure, enabling tasks to specify
   multi-plane requirements

3. **Platonic solid topology** means each tier's accessible route branching factor is exactly
   the number of faces of the corresponding solid — a topological definition of tier capability

4. **Circuit breaker integration** removes failed protocols from the routing graph, triggering
   path recomputation — failures become routing adaptations

5. **Self-healing proof** establishes that under φ-connectivity and the circuit breaker recovery
   dynamics, the routing system recovers from any finite adversarial event in finite time

The organism routes. It heals. No dispatcher required.

---

## Appendix: Routing Graph Construction

The protocol graph G is constructed by:

1. **Nodes**: All 20 protocols in the Geometry Lock system (GKP-001 through GKP-014, GLP-001
   through GLP-006) plus the 4 organism processors (PORTA, CLAVIS, SENTINELLA, GEOMANCER)

2. **Edges**: Protocol P_a → P_b if P_b can process the output of P_a (capability compatibility)
   AND tier(P_b) ≥ tier(P_a) (no routing downgrade)

3. **Weights**: Edge weight w(a→b) = φ^(−tier_diff(a,b)) — edges going up in tier are weighted
   lighter (preferred for escalation)

4. **Tier gates**: Each node has a required_tier gate that filters requests below threshold

The resulting graph has N ≈ 24 nodes and E ≈ 89 edges (Fibonacci(10) + Fibonacci(11) — a
deliberate Fibonacci choice for the edge count).

---

*This paper is published by the Scribe Foundation under LEX CLAVIS-010.*

**Casa de Medina | GLP-005..006 | Scribe Foundation | NOVA Protocol**
