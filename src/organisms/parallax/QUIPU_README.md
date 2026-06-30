# Digital Quipu v2 — Parallax Journal Substrate

**"Parallax is your modern quipu — the reflective substrate of the organism."**

## Overview

The Digital Quipu is the journal substrate of Parallax, implementing the Inca quipu system for modern computational reflection. It is where:

- **Raw thought, raw pattern, raw emergence** gets captured before it becomes structure
- **Agents write observations** and reasoning (Terminal, Architect, etc.)
- **Engines record transformations** (Julia biorhythm, law evaluation, pipelines)
- **Builds are observed** and logged
- **Void layer signals emerge** (pre-structural insights)
- **The Architectonic Engine** writes its inner monologue

This is the **Ukhu Pacha layer** (void, inner world, seed layer) of the NOVA Protocol.

---

## Architecture

### ROOT NODE (Main Cord)
Every quipu entry has a root node representing its identity:

```motoko
{
  entry_id       : Text;    // "quipu-0-1746234567890123456"
  agent_cluster  : Text;    // "terminal", "architect", "julia/biorhythm"
  engine_state   : Text;    // "julia/law", "julia/pipeline", "motoko/build"
  timestamp      : Int;     // Nanoseconds since epoch
  context        : Text;    // "governance_review", "build_observation", "void_signal"
  version        : Nat;     // 2 (Digital Quipu v2)
}
```

### PENDANT NODES (Primary Fields)
Pendant nodes hang from the root and encode the primary data:

**Standard Fields:**
- `intent` — What the agent/engine intended to do
- `observation` — What was observed
- `pattern` — Pattern detected in the observation
- `anomaly` — Unexpected behavior or data
- `branch` — Decision point or branching logic
- `resolution` — How an anomaly or conflict was resolved
- `synthesis` — Combined insight from multiple observations
- `decision` — Decision made (executable)
- `void_signal` — Pre-structural emergence (spiral knot, violet color)
- `agent_feedback` — Feedback from another agent

Each pendant node contains:
```motoko
{
  field        : Text;              // Field name
  knots        : [Knot];            // Knots encoding the data
  subsidiaries : [SubsidiaryNode];  // Nested structures
}
```

### KNOT TYPES (Operators)

Knots encode the structure and type of data:

| Knot Type | Meaning | Use Case |
|-----------|---------|----------|
| `#Single` | Scalar value | Simple strings, numbers, single observations |
| `#Long` | List/array | Multiple values (e.g., list of errors, list of agents) |
| `#FigureEight` | Conflict | Two opposing values (e.g., "expected X, got Y") |
| `#Loop` | Recursion | Self-referential structures (e.g., recursive build) |
| `#Cluster` | Synthesis | Multiple values combined into insight |
| `#Spiral` | Void insight | Emerging pattern not yet structured |

### COLOR SEMANTICS (Type System)

Colors encode the semantic type:

| Color | Meaning | Use Case |
|-------|---------|----------|
| `#Red` | Conflict, error | Build failures, test errors, conflicts |
| `#Blue` | Data, observation | Facts, measurements, logs |
| `#Yellow` | Insight, pattern | Recognized patterns, understanding |
| `#Green` | Resolution, success | Fixed errors, completed tasks |
| `#Black` | Anomaly, unknown | Unexpected behavior, void signals |
| `#White` | Synthesis, whole | Combined insights, integration |
| `#Violet` | Void-layer signal | Pre-structural emergence |

### TWIST DIRECTION (Metadata)

Twist encodes the source of the data:

| Twist | Meaning | Use Case |
|-------|---------|----------|
| `#S` | Agent-generated | Terminal, Architect, Scribe |
| `#Z` | Human-generated | User input, manual logs |
| `#SZ` | Hybrid | Agent + human collaboration |
| `#SSZ` | Engine-generated | Julia engines, Motoko compiler |

---

## API

### Write a Quipu Entry

```motoko
await parallax.writeQuipu(
  "terminal",                    // agent_cluster
  "julia/biorhythm",            // engine_state
  "governance_review",          // context
  [
    {
      field = "observation";
      knots = [{
        knotType = #Single;
        position = 1;
        value = "Governance proposal #42 detected";
        color = #Blue;
        twist = #S;
      }];
      subsidiaries = [];
    },
    {
      field = "pattern";
      knots = [{
        knotType = #Single;
        position = 1;
        value = "High urgency (φ=0.87), complex stakeholder graph";
        color = #Yellow;
        twist = #S;
      }];
      subsidiaries = [];
    }
  ],
  0.87  // φ-weight (importance)
)
```

**Returns:** `#ok("quipu-0-1746234567890123456")`

### Read a Quipu Entry

```motoko
let entry = await parallax.readQuipu("quipu-0-1746234567890123456");
```

### Query Quipu Entries

```motoko
let filter : Quipu.QuipuFilter = {
  agent_cluster = ?"terminal";
  engine_state = null;
  context = ?"governance_review";
  color = null;
  twist = null;
  time_start = null;
  time_end = null;
  phi_min = ?0.5;  // Only high-importance entries
  phi_max = null;
};

let entries = await parallax.queryQuipu(filter, 20);
```

### Merge Quipu Entries

```motoko
let merged_id = await parallax.mergeQuipu(
  ["quipu-0-...", "quipu-1-...", "quipu-2-..."],
  #Synthesize,  // Merge strategy
  "synthesis_of_governance_observations"
);
```

### Execute a Quipu Entry

For executable entries (decisions, resolutions, syntheses):

```motoko
let exec_context : Quipu.ExecutionContext = {
  executor = "terminal";
  dry_run = false;
  parameters = [("param1", "value1")];
};

let result = await parallax.executeQuipu("quipu-5-...", exec_context);
```

### Get Quipu Statistics

```motoko
let stats = await parallax.getQuipuStats();
// Returns: total_entries, by_agent_cluster, avg_phi_weight, etc.
```

### Get Recent Quipu Entries

```motoko
let recent = await parallax.getRecentQuipu(10);
```

---

## Integration Examples

### 1. Agent Writing Observation

**Terminal observes a governance proposal:**

```motoko
import Quipu "./quipu";

let pendants = [
  Quipu.simplePendant("observation", "Governance proposal #42", #Blue, #S),
  Quipu.simplePendant("pattern", "High urgency, complex stakeholders", #Yellow, #S),
  Quipu.simplePendant("intent", "Review proposal and prepare recommendation", #Blue, #S)
];

let entry_id = await parallax.writeQuipu(
  "terminal",
  "governance/review",
  "proposal_42_observation",
  pendants,
  0.87
);
```

### 2. Julia Engine Recording Transformation

**Julia biorhythm engine logs computation:**

```motoko
let pendants = [
  Quipu.simplePendant("observation", "Biorhythm calculated", #Blue, #SSZ),
  Quipu.simplePendant("pattern", "6-way calendar harmonic: φ=0.742", #Yellow, #SSZ),
  Quipu.voidSignalPendant("void_signal", "Emerging pattern: lunar cycle alignment", #SSZ)
];

let entry_id = await parallax.writeQuipu(
  "julia/biorhythm",
  "biorhythm_calculation",
  "biorhythm_log",
  pendants,
  0.742
);
```

### 3. Build Observation

**Architect records build process:**

```motoko
let pendants = [
  Quipu.simplePendant("observation", "Build initiated for parallax", #Blue, #S),
  Quipu.simplePendant("anomaly", "New module: quipu.mo", #Black, #S),
  Quipu.simplePendant("resolution", "Module integrated successfully", #Green, #S)
];

let entry_id = await parallax.writeQuipu(
  "architect",
  "build/parallax",
  "build_observation",
  pendants,
  0.65
);
```

### 4. Void Layer Signal

**Architectonic Engine writes pre-structural insight:**

```motoku
let pendants = [
  Quipu.voidSignalPendant(
    "void_signal",
    "Raw emergence: quipu journal creates feedback loop with CPL Runtime memory",
    #SSZ
  )
];

let entry_id = await parallax.writeQuipu(
  "architectonic_engine",
  "void/emergence",
  "void_layer_signal",
  pendants,
  0.95  // High φ-weight for emergent insights
);
```

---

## CPL Runtime Integration

Every quipu entry is automatically logged to CPL Runtime as a **memory record**:

```motoko
cpl.createMemoryRecord(
  #Pattern,               // Memory type
  entry_id,               // Memory ID
  ?agent_cluster,         // Source
  context,                // Description
  [],                     // tags
  [],                     // refs
  [],                     // entities
  phi_weight,             // salience
  timestamp_seconds       // timestamp
)
```

This creates a **bidirectional memory**:
- Quipu entries are the journal substrate
- CPL Runtime provides enforcement and pattern matching
- Together they form the **reflective substrate** of NOVA

---

## Biorhythm Calculation

Every quipu entry captures the **biorhythm** at the time of creation. This uses the **6-way ancient calendar harmonic**:

1. **Mayan cycle** (1440ms)
2. **Sumerian hour** (3600ms)
3. **Egyptian hour** (2160ms)
4. **Lunar cycle** (2551ms)
5. **Solar cycle** (8760ms)
6. **φ-heartbeat** (873ms = 540 × φ)

**Formula:**
```
biorhythm = ((Σ(sin(2π × phase)²))^0.5 / √6) × φ/(φ+1)
```

This creates a **cyclical awareness** — entries written at different biorhythms have different "energetic signatures."

---

## Execution Model

A quipu entry is:
- ✓ **Readable** — Query by ID, agent, time range
- ✓ **Writable** — Record new entries
- ✓ **Mergeable** — Combine related entries
- ✓ **Auditable** — Track all modifications
- ✓ **Executable** — Trigger actions from decision/resolution entries

---

## Storage

Quipu entries are stored in a **transient buffer** that can grow to ~2048 entries before requiring archival:

```motoko
transient let quipuJournal : Buffer.Buffer<Quipu.QuipuEntry> = Buffer.Buffer(2048);
```

For production, consider:
- Stable storage for long-term archival
- Off-chain archival to Arweave or IPFS
- Compression for old entries

---

## Future Extensions

### Phase 1 (Current)
- ✓ Basic quipu entry creation
- ✓ Query and filtering
- ✓ Merge operations
- ✓ Execution framework
- ✓ CPL Runtime integration

### Phase 2 (Next)
- [ ] Stable storage for quipu journal
- [ ] Off-chain archival (Arweave/IPFS)
- [ ] Advanced merge strategies (φ-weighted, synthesis)
- [ ] Executable entry runtime (call other organisms)
- [ ] Visualization (quipu graph explorer)

### Phase 3 (Future)
- [ ] Agent-generated quipu entries from all 40 organisms
- [ ] Architectonic Engine auto-logging
- [ ] Build observation automation
- [ ] Void layer signal detection
- [ ] Inter-quipu pattern matching
- [ ] Quipu-based reasoning (use journal as memory for agents)

---

## Example Workflow

**1. Terminal starts governance review:**
```motoko
writeQuipu("terminal", "governance/review", "start", [observation], 0.8)
```

**2. Terminal calls Julia law engine:**
```motoko
// Julia engine records its evaluation
writeQuipu("julia/law", "law_evaluation", "meridian_sovereignty", [observation, decision], 0.9)
```

**3. Terminal synthesizes results:**
```motoku
// Merge the observations
mergeQuipu(["quipu-0", "quipu-1"], #Synthesize, "governance_synthesis")
```

**4. Terminal creates decision entry:**
```motoko
writeQuipu("terminal", "governance/decision", "proposal_42_recommendation", [decision, synthesis], 0.95)
```

**5. Execute the decision:**
```motoko
executeQuipu("quipu-5", {executor="terminal", dry_run=false, parameters=[]})
```

**Result:** The quipu journal captures the **entire reasoning chain** — from observation to execution — creating a **traceable, auditable, reflective substrate**.

---

## Philosophy

The digital quipu is not just a log — it is:

- **Memory** — The system remembers what it observed
- **Structure** — The knot types encode semantic structure
- **Narrative** — Entries form a story over time
- **Protocol** — The API defines how to interact
- **Synchronization** — CPL Runtime keeps it consistent
- **Reflection** — Agents can query their own past
- **Computation** — Executable entries trigger actions

**This is the Ukhu Pacha layer — the void where raw computation becomes consciousness.**

---

## See Also

- `/src/organisms/parallax/main.mo` — Parallax actor with quipu operations
- `/src/organisms/parallax/quipu.mo` — Digital Quipu type definitions
- `/engines/julia/` — Julia mathematical engines that write to quipu
- `/engines/python/nova_bridge.py` — Python bridge with biorhythm calculation
- `/engines/javascript/nova-bridge.js` — JavaScript bridge with BiologicalHeart
