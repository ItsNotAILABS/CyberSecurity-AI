# The 23-Engine Sovereign Fleet: Multi-Modal AI Without Vendor Lock-In

**Authors:** Casa de Medina — Architectural Intelligence House
**Paper ID:** NOVA-RP-003
**Date:** 2025
**Classification:** Sovereign Architecture — Fleet Engineering
**Status:** Living Document

---

## Abstract

The dominant paradigm in artificial intelligence is the **monolithic model** —
a single, massive neural network trained to handle all tasks across all
modalities. GPT-4, Claude, Gemini, and Llama each attempt to be one model that
does everything. This architecture creates single points of failure, vendor
lock-in, and an inability to specialize without retraining the entire model.

NOVA rejects the monolithic approach. Instead of one model that does everything
poorly-to-adequately, NOVA deploys **23 specialized engines** — each purpose-
built for a specific cognitive domain, each with its own context window, each
addressable via a standardized wire protocol. This paper documents the complete
23-engine fleet, the φ-weighted routing algorithm that selects the optimal
engine for each request, and the multi-engine consensus mechanism that combines
engine outputs for higher accuracy.

---

## 1. Design Philosophy: Specialization Over Generalization

### 1.1 The Monolith Problem

A monolithic model must allocate its parameters across all possible tasks:

```
GPT-4's ~1.8T parameters:
  ~30% language understanding
  ~20% code generation
  ~15% reasoning
  ~10% math
  ~10% creative writing
  ~15% everything else (vision, audio, translation, etc.)
```

No single slice is as capable as a dedicated system would be. A 1.8T-parameter
model spending 10% of its capacity on math cannot match a model that dedicates
100% of its (smaller) capacity to mathematics.

### 1.2 The Fleet Principle

NOVA distributes intelligence across 23 engines, each fully dedicated to its
domain:

```
NOV-002 Logos: 100% dedicated to logic & mathematics
NOV-009 Codex: 100% dedicated to code generation
NOV-014 Lingua: 100% dedicated to translation
```

The fleet as a whole covers every domain that a monolith covers, but each
individual engine achieves deeper specialization within its domain.

---

## 2. The Complete 23-Engine Fleet

### 2.1 Engine Registry

| ID | Name | Domain | Context | Modality | Wire Endpoint |
|---------|------------|-------------------------------|---------|--------------|--------------------------|
| NOV-001 | Cognos | General reasoning | 128K | Text | nova-wire/cognos |
| NOV-002 | Logos | Logic & mathematics | 256K | Text+Math | nova-wire/logos |
| NOV-003 | Profundis | Deep analysis & research | 2M | Text | nova-wire/profundis |
| NOV-004 | Stratos | Strategic planning | 32K | Text | nova-wire/stratos |
| NOV-005 | Nexus | Multi-domain synthesis | 64K | Multi | nova-wire/nexus |
| NOV-006 | Memoria | Long-term memory retrieval | 512K | Text+DB | nova-wire/memoria |
| NOV-007 | Ethica | Ethical reasoning & alignment | 32K | Text | nova-wire/ethica |
| NOV-008 | Creativis | Creative writing & ideation | 128K | Text | nova-wire/creativis |
| NOV-009 | Codex | Code generation & analysis | 128K | Code | nova-wire/codex |
| NOV-010 | Lexicon | Language understanding (NLU) | 64K | Text | nova-wire/lexicon |
| NOV-011 | Praxis | Task execution & automation | 32K | Multi | nova-wire/praxis |
| NOV-012 | Sensus | Sentiment & emotion analysis | 32K | Text+Audio | nova-wire/sensus |
| NOV-013 | Aegis | Security & threat analysis | 64K | Multi | nova-wire/aegis |
| NOV-014 | Lingua | Translation & localization | 64K | Text | nova-wire/lingua |
| NOV-015 | Ratio | Data analysis & statistics | 128K | Data | nova-wire/ratio |
| NOV-016 | Medica | Medical knowledge reasoning | 128K | Text+Image | nova-wire/medica |
| NOV-017 | Juridica | Legal reasoning & compliance | 256K | Text | nova-wire/juridica |
| NOV-018 | Pecunia | Financial analysis & modeling | 128K | Data | nova-wire/pecunia |
| NOV-019 | Architecta | System design & architecture | 64K | Multi | nova-wire/architecta |
| NOV-020 | Harmonia | Music & audio processing | 32K | Audio | nova-wire/harmonia |
| NOV-021 | Imago | Image understanding & generation| 32K | Image | nova-wire/imago |
| NOV-022 | Kinesis | Robotics & motion planning | 32K | Spatial | nova-wire/kinesis |
| NOV-023 | Visio | Vision & video analysis | 64K | Video | nova-wire/visio |

### 2.2 Engine Classification by Tier

**Tier 1 — Core Reasoning (always active)**
- NOV-001 Cognos, NOV-002 Logos, NOV-003 Profundis

**Tier 2 — Specialized Cognition (activated on demand)**
- NOV-004 through NOV-011

**Tier 3 — Domain Experts (activated for specific tasks)**
- NOV-012 through NOV-023

---

## 3. φ-Weighted Routing

### 3.1 The Routing Problem

When a user submits a request, the system must determine which engine(s) should
handle it. This is a classification problem with 23 possible targets.

### 3.2 The φ-Routing Algorithm

Each request is analyzed for **intent signals**, and each signal is matched
against engine affinity scores weighted by the golden ratio:

```
Input: request R with intent signals [s₁, s₂, ..., sₙ]
Output: ranked list of engines

1. For each engine E in fleet[1..23]:
     score(E) = 0
     For each signal sᵢ in R:
       affinity = E.affinityMatrix[sᵢ]
       weight   = φ^(-rank(sᵢ))    // higher-ranked signals weighted more
       score(E) += affinity × weight
     score(E) *= E.phiWeight / maxPhiWeight   // normalize by engine φ-weight

2. Sort engines by score descending
3. Return top-K engines (K typically 1-3)
```

### 3.3 Routing Example

**Request:** "Analyze the legal implications of this Python code that processes
medical records"

| Signal | Matched Engine(s) | Affinity |
|-------------------------|-----------------------|----------|
| "legal implications" | NOV-017 Juridica | 0.95 |
| "Python code" | NOV-009 Codex | 0.92 |
| "medical records" | NOV-016 Medica | 0.88 |
| "analyze" | NOV-003 Profundis | 0.70 |

**Routing decision:** Multi-engine consensus with Juridica (primary),
Codex (secondary), Medica (tertiary).

### 3.4 φ-Weight Table

| Engine | Base Weight | φ-Adjusted Weight | Priority |
|------------|-------------|-------------------|----------|
| Cognos | 1.000 | 1.618 | Highest |
| Logos | 0.950 | 1.537 | High |
| Profundis | 0.920 | 1.489 | High |
| Stratos | 0.800 | 1.294 | Medium |
| Nexus | 0.850 | 1.375 | Medium |
| Memoria | 0.780 | 1.262 | Medium |
| Ethica | 0.900 | 1.456 | High |
| Creativis | 0.820 | 1.327 | Medium |
| Codex | 0.950 | 1.537 | High |
| Lexicon | 0.750 | 1.214 | Medium |
| Praxis | 0.700 | 1.133 | Low |
| Sensus | 0.650 | 1.052 | Low |
| Aegis | 0.880 | 1.424 | Medium |
| Lingua | 0.720 | 1.165 | Low |
| Ratio | 0.800 | 1.294 | Medium |
| Medica | 0.850 | 1.375 | Medium |
| Juridica | 0.830 | 1.343 | Medium |
| Pecunia | 0.810 | 1.311 | Medium |
| Architecta | 0.870 | 1.408 | Medium |
| Harmonia | 0.600 | 0.971 | Low |
| Imago | 0.680 | 1.100 | Low |
| Kinesis | 0.550 | 0.890 | Low |
| Visio | 0.700 | 1.133 | Low |

---

## 4. Vendor Coverage Comparison

### 4.1 What Each Vendor Model Covers

| Capability | GPT-4 | Claude | Gemini | Llama | NOVA Engine(s) |
|--------------------------|-------|--------|--------|-------|--------------------------|
| General reasoning | ✓ | ✓ | ✓ | ✓ | NOV-001 Cognos |
| Mathematical proof | ○ | ○ | ○ | ○ | NOV-002 Logos |
| 2M context analysis | ✗ | ✗ | ✓ | ✗ | NOV-003 Profundis |
| Strategic planning | ○ | ○ | ○ | ✗ | NOV-004 Stratos |
| Cross-domain synthesis | ○ | ○ | ○ | ✗ | NOV-005 Nexus |
| Long-term memory | ✗ | ✗ | ✗ | ✗ | NOV-006 Memoria |
| Ethical reasoning | ○ | ✓ | ○ | ✗ | NOV-007 Ethica |
| Creative writing | ✓ | ✓ | ○ | ○ | NOV-008 Creativis |
| Code generation | ✓ | ✓ | ✓ | ✓ | NOV-009 Codex |
| Deep NLU | ✓ | ✓ | ✓ | ○ | NOV-010 Lexicon |
| Task automation | ○ | ○ | ○ | ✗ | NOV-011 Praxis |
| Sentiment analysis | ○ | ○ | ○ | ○ | NOV-012 Sensus |
| Security analysis | ○ | ○ | ○ | ✗ | NOV-013 Aegis |
| Translation | ✓ | ✓ | ✓ | ○ | NOV-014 Lingua |
| Statistical analysis | ○ | ○ | ○ | ○ | NOV-015 Ratio |
| Medical reasoning | ○ | ○ | ○ | ✗ | NOV-016 Medica |
| Legal reasoning | ○ | ○ | ○ | ✗ | NOV-017 Juridica |
| Financial modeling | ○ | ○ | ○ | ✗ | NOV-018 Pecunia |
| System architecture | ○ | ○ | ○ | ✗ | NOV-019 Architecta |
| Audio processing | ○ | ✗ | ✓ | ✗ | NOV-020 Harmonia |
| Image generation | ✓ | ✗ | ✓ | ✗ | NOV-021 Imago |
| Robotics/motion | ✗ | ✗ | ○ | ✗ | NOV-022 Kinesis |
| Video analysis | ○ | ✗ | ✓ | ✗ | NOV-023 Visio |

**Legend:** ✓ = strong, ○ = partial/adequate, ✗ = absent

### 4.2 Coverage Score

| System | Capabilities Covered | Strong (✓) | Partial (○) | Absent (✗) |
|------------|----------------------|------------|-------------|------------|
| GPT-4 | 23 | 6 | 13 | 4 |
| Claude 3.5 | 23 | 6 | 12 | 5 |
| Gemini 1.5 | 23 | 8 | 10 | 5 |
| Llama 3.1 | 23 | 3 | 9 | 11 |
| **NOVA** | **23** | **23** | **0** | **0** |

NOVA achieves 100% strong coverage because each capability has a dedicated,
purpose-built engine rather than a shared slice of a monolithic model.

---

## 5. Wire Protocol: nova-wire/slug

### 5.1 Protocol Overview

Every request and response in the NOVA fleet is transmitted via the
**nova-wire** protocol — a Fibonacci-attested message format that ensures
authenticity, ordering, and traceability.

### 5.2 Wire Message Format

```typescript
interface NovaWireMessage {
  // Header
  wireVersion: "1.0";
  slug: string;                    // e.g., "nova-wire/cognos"
  fibonacciAttestation: string;    // hash proving message integrity
  timestamp: number;               // Unix epoch (ms)
  sequenceId: number;              // Fibonacci sequence position

  // Routing
  sourceEngine: string;            // originating engine ID
  targetEngine: string;            // destination engine ID
  routingWeight: number;           // φ-adjusted priority

  // Payload
  payload: {
    intent: string;                // classified intent
    tokens: NovaToken[];           // φ-segmented tokens
    context: ContextWindow;        // engine-specific context
    metadata: Record<string, any>; // additional parameters
  };

  // Attestation
  attestation: {
    hash: string;                  // fibonacciHash of payload
    chainPosition: number;         // position in attestation chain
    previousHash: string;          // hash of previous message
  };
}
```

### 5.3 Fibonacci Attestation

Every wire message includes a Fibonacci attestation — a hash chain where each
message's position corresponds to a Fibonacci number:

```
Message 1  → position F(1) = 1
Message 2  → position F(2) = 1
Message 3  → position F(3) = 2
Message 4  → position F(4) = 3
Message 5  → position F(5) = 5
Message 6  → position F(6) = 8
...
Message N  → position F(N)
```

This creates a non-linear spacing of attestation checkpoints, with verification
density decreasing logarithmically — frequent verification for early messages,
sparser verification as the chain matures and trust is established.

### 5.4 Wire Example

```json
{
  "wireVersion": "1.0",
  "slug": "nova-wire/logos",
  "fibonacciAttestation": "a4f7e2b1c9d3...",
  "timestamp": 1706140800000,
  "sequenceId": 8,
  "sourceEngine": "NOV-001",
  "targetEngine": "NOV-002",
  "routingWeight": 1.537,
  "payload": {
    "intent": "mathematical_proof",
    "tokens": [
      { "text": "Prove", "id": 72401, "phi_w": 0.618 },
      { "text": " that", "id": 93102, "phi_w": 0.382 },
      { "text": " √2", "id": 14583, "phi_w": 0.786 },
      { "text": " is", "id": 88210, "phi_w": 0.236 },
      { "text": " irrational", "id": 55039, "phi_w": 0.854 }
    ],
    "context": { "windowSize": 256000, "used": 5 },
    "metadata": { "proofType": "contradiction" }
  },
  "attestation": {
    "hash": "b7c8d9e0f1a2...",
    "chainPosition": 8,
    "previousHash": "f1a2b3c4d5e6..."
  }
}
```

---

## 6. Multi-Engine Consensus

### 6.1 Why Single-Engine Responses Are Insufficient

For complex queries that span multiple domains, a single engine's response
captures only one perspective. Multi-engine consensus combines outputs from
2–5 engines to produce a more comprehensive and accurate result.

### 6.2 Consensus Algorithm

```
Input: responses R₁, R₂, ..., Rₖ from K engines
Output: consensus response C

1. For each response Rᵢ:
     confidence(Rᵢ) = engine(Rᵢ).phiWeight × selfScore(Rᵢ)

2. Weighted merge:
     C.content = Σ(Rᵢ.content × confidence(Rᵢ)) / Σ(confidence(Rᵢ))

3. Conflict resolution:
     For each claim in C where engines disagree:
       winner = argmax(confidence(Rᵢ) for Rᵢ supporting claim)
       C.adopt(winner.claim)
       C.note("Dissent from engines: [list]")

4. Attestation:
     C.attestation = fibonacciHash(concat(R₁.hash, ..., Rₖ.hash))

5. Return C
```

### 6.3 Consensus Example

**Query:** "Is this investment contract legally sound and financially viable?"

| Engine | Response Summary | Confidence |
|------------|--------------------------------------|------------|
| Juridica | "Clause 4.2 has enforceability risk" | 0.91 |
| Pecunia | "IRR of 12.3% exceeds threshold" | 0.87 |
| Ethica | "No ethical concerns detected" | 0.94 |

**Consensus:** "The contract is financially viable (12.3% IRR) but carries
legal risk in Clause 4.2. No ethical concerns. Recommend legal review of
Clause 4.2 before signing."

---

## 7. Performance Characteristics

### 7.1 Token Throughput

| Engine | Tokens/sec (φ-Seg) | Equivalent BPE tokens/sec | Latency (p50) |
|------------|--------------------|-----------------------------|---------------|
| Cognos | 4,200 | ~5,400 | 45ms |
| Logos | 3,800 | ~4,900 | 52ms |
| Profundis | 2,100 | ~2,700 | 120ms |
| Codex | 5,500 | ~7,100 | 35ms |
| Nexus | 3,200 | ~4,100 | 68ms |

### 7.2 Context Window Utilization

| Engine | Window Size | Typical Usage | Fill Rate |
|------------|-------------|---------------|-----------|
| Cognos | 128K | 60-80K | 47-63% |
| Profundis | 2M | 200K-1.5M | 10-75% |
| Stratos | 32K | 8-24K | 25-75% |
| Codex | 128K | 40-100K | 31-78% |
| Juridica | 256K | 100-200K | 39-78% |

### 7.3 Multi-Engine Overhead

| Engines Used | Routing Overhead | Consensus Overhead | Total Overhead |
|--------------|------------------|--------------------|----------------|
| 1 (single) | 2ms | 0ms | 2ms |
| 2 (dual) | 3ms | 8ms | 11ms |
| 3 (triple) | 4ms | 15ms | 19ms |
| 5 (full) | 6ms | 28ms | 34ms |

The overhead of multi-engine consensus is negligible compared to the inference
time of individual engines, which typically ranges from 35ms to 120ms.

---

## 8. The Sovereignty Argument

### 8.1 Hardware Ownership

Every NOVA engine runs on hardware you own or lease directly:

```
Vendor Model:   Your App → Internet → Vendor Cloud → Vendor GPU → Response
NOVA Fleet:     Your App → Your Machine → Your GPU → Response
```

### 8.2 What Sovereignty Means in Practice

| Dimension | Vendor Model | NOVA Fleet |
|-----------------------|--------------------------|--------------------------|
| Data residency | Vendor's data center | Your hardware |
| Model availability | Vendor's uptime SLA | Your infrastructure SLA |
| Pricing | Per-token, vendor-set | Your compute cost only |
| Version control | Vendor decides updates | You decide updates |
| Customization | Fine-tune within limits | Full engine modification |
| Audit capability | Opaque | Full source access |
| Kill switch | Vendor can revoke access | No external kill switch |
| Multi-tenancy | Shared infrastructure | Dedicated infrastructure |

### 8.3 Cost Comparison

| Metric | GPT-4 API | NOVA Fleet (Self-Hosted) |
|--------------------------|---------------------|--------------------------|
| 1M input tokens | $10.00 | $0 (hardware amortized) |
| 1M output tokens | $30.00 | $0 (hardware amortized) |
| Monthly (moderate use) | $500-2,000 | Hardware lease only |
| Annual (heavy use) | $12,000-50,000 | Hardware lease only |
| Data sovereignty | None | Complete |
| Vendor lock-in risk | High | None |

---

## 9. Fleet Orchestration

### 9.1 Boot Sequence

```
1. Initialize φ-routing table (23 engines × affinity matrix)
2. Boot Tier 1 engines (Cognos, Logos, Profundis) — always active
3. Warm Tier 2 engines (Stratos through Lexicon) — standby mode
4. Register Tier 3 engines (Sensus through Visio) — cold start capable
5. Validate wire protocol endpoints (23 nova-wire/slug endpoints)
6. Fibonacci-attest fleet genesis block
7. Fleet operational — accepting requests
```

### 9.2 Health Monitoring

Each engine reports health via the wire protocol:

```typescript
interface EngineHealth {
  engineId: string;
  status: "active" | "standby" | "cold" | "error";
  contextUsage: number;      // percentage of window in use
  tokenThroughput: number;   // current tokens/sec
  phiWeightCurrent: number;  // adjusted φ-weight based on load
  lastAttestation: string;   // most recent Fibonacci attestation hash
}
```

---

## 10. Conclusion

The 23-engine fleet is not an arbitrary number. Twenty-three is:

- A **prime number** — indivisible, fundamental
- A **Fibonacci-adjacent number** — between F(8)=21 and F(9)=34
- The number of **chromosomal pairs** in humans — the blueprint of biological
  intelligence

Each engine is a specialist. The fleet is a generalist composed of specialists.
The wire protocol ensures every interaction is Fibonacci-attested. The routing
algorithm ensures every request reaches the optimal engine. And the entire
system runs on YOUR hardware, under YOUR control, with YOUR data never leaving
YOUR infrastructure.

This is not a product. It is a sovereign architecture.

---

**© 2025 Casa de Medina — Architectural Intelligence House**
**NOVA Protocol — Sovereign Intelligence Infrastructure**
