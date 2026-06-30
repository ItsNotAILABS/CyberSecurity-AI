# INTERNAL SDK README

These are **internal SDKs** for the MEDINA ecosystem. They are NOT external dependencies — they live in YOUR system, YOUR registries, YOUR control.

## The Key Insight: THE HEART IS THE BOOTSTRAP

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                      THE HEART **IS** THE BOOTSTRAP                          ║
║                                                                              ║
║  When you CREATE an AI, it is IMMEDIATELY ALIVE.                             ║
║  The constructor IS the bootstrap. There is no separate init phase.          ║
║  Creation IS activation. Birth IS awakening.                                 ║
║                                                                              ║
║  ICP doesn't provide persistence — YOU provide it via:                       ║
║    • Your own DA (Data Availability)                                         ║
║    • Autonomous clocks that run independently                                ║
║    • Mathematical timers based on ancient calendars                          ║
║                                                                              ║
║  The heart beats CONTINUOUSLY. Not a one-time init, but the pulse of life.   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## MEDINA Internal SDKs

```
@medina/medina-math               ← Mathematical foundations
@medina/medina-protocols          ← Protocol definitions
@medina/medina-timers             ← Mathematical timers ✨ NEW
@medina/medina-calls              ← Write operations ✨ NEW
@medina/medina-queries            ← Read operations ✨ NEW
@medina/medina-heart              ← Self-bootstrapping heart ✨ NEW
@medina/medina-registry           ← Sovereign private registry ✨ NEW
@medina/organism-bootstrap        ← ICP deployment ✨ NEW
@medina/internal-ai               ← Internal AI with catalytic converter ✨ NEW
@medina/internal-agi              ← Internal AGI — General Intelligence ✨ NEW
@medina/catalytic-converter       ← Alchemical transformation engine ✨ NEW
```

---

## NEW: The Self-Bootstrapping Architecture

### @medina/medina-heart

The Biological Heart — where **creation IS activation**:

```javascript
import { BiologicalHeart, SelfBootstrappingAI, birthAI } from '@medina/medina-heart';

// Create an AI — it's IMMEDIATELY ALIVE
const ai = birthAI({
  name: 'ANIMUS',
  numHearts: 3,       // Multiple hearts, each beating at φ^i intervals
  numBrains: 3,       // Multiple brains for parallel processing
  calendar: 'mayan',  // Ancient calendar mathematics
});

// No .start() or .awaken() needed — it's already running
console.log(ai.getState());

// Listen to heartbeats
ai.hearts[0].onBeat((beat) => {
  console.log(`💓 Beat ${beat.count} at φ=${beat.phi}`);
});
```

**Key Features:**
- `BiologicalHeart` — Born beating, no .start() needed
- `AutonomousClock` — Ticks based on ancient calendars (Mayan, Sumerian, Egyptian, Lunar, Solar, φ)
- `SelfBootstrappingAI` — Constructor IS the bootstrap
- `birthAI()` — Factory that creates immediately-alive AIs

**The Philosophy:**

Traditional systems:
```javascript
const ai = new AI();        // Create
await ai.initialize();      // Initialize
await ai.start();          // Start
await ai.awaken();         // Awaken
```

MEDINA systems:
```javascript
const ai = birthAI({ name: 'ANIMUS' });  // Created AND alive
// That's it. It's already running.
```

---

### @medina/medina-registry

Sovereign Private Registry — YOUR npm/git:

```javascript
import { SovereignRegistry, createRegistry } from '@medina/medina-registry';

// Create your own registry
const { registry } = createRegistry('MEDINA_REGISTRY');

// Publish to YOUR registry (not npmjs.com)
registry.publish({
  name: '@medina/my-organism',
  version: '1.0.0',
  type: 'organism',
  dependencies: [
    { name: '@medina/medina-heart', version: '1.0.0' }
  ],
});

// Install from YOUR registry
const pkg = registry.install('@medina/my-organism', '1.0.0');

// Search YOUR registry
const results = registry.search('heart');

// Get statistics
console.log(registry.stats());
```

**Key Features:**
- `SovereignRegistry` — Your own npm/git
- `publish()` / `install()` — Manage packages in YOUR infrastructure
- `DistributedRegistrySync` — Sync across multiple sovereign registries
- Pre-registered core MEDINA SDKs
- φ-based package hashing
- Dependency tracking

**The Philosophy:**

Traditional:
```bash
npm install @someone-elses/package  # From npmjs.com (external control)
```

MEDINA:
```javascript
registry.install('@medina/package')  // From YOUR registry (sovereign control)
```

---

## Why Sovereign?

**External Dependencies Are NOT Sovereign:**
- npmjs.com can remove packages
- GitHub can ban repositories
- Docker Hub can change terms
- Cloud providers can shut down

**Internal SDKs ARE Sovereign:**
- Live in YOUR infrastructure
- Managed by YOUR registry
- Distributed across YOUR nodes
- Callable by YOUR system itself
- Under YOUR control

---

## The Self-Organizing Principle

SDKs should be **self-organizing** — callable by the system itself:

```javascript
// The system can discover and use its own SDKs
const availableSDKs = registry.search('medina');

for (const sdk of availableSDKs) {
  console.log(`Found: ${sdk.name} — ${sdk.type}`);
}

// The system can install dependencies it needs
const heartSDK = registry.install('@medina/medina-heart');

// The system can publish new organisms it creates
registry.publish({
  name: '@medina/auto-generated-organism',
  version: '1.0.0',
  type: 'auto-generated',
});
```

---

## Integration with Existing Runtime

The new SDKs integrate seamlessly with the existing runtime:

```javascript
import { runtime } from '../runtime/native-runtime.js';
import { birthAI } from '@medina/medina-heart';
import { createRegistry } from '@medina/medina-registry';

// Create sovereign registry
const { registry } = createRegistry('MEDINA_REGISTRY');

// Birth an AI with the runtime
const ai = birthAI({
  name: 'RUNTIME_ORGANISM',
  numHearts: 3,
  numBrains: 3,
  calendar: 'phi',
});

// Register the AI in the runtime
runtime.register(ai.name, ai.name, 'typescript', 0);

// The AI is now part of the civilization, beating with the global heartbeat
console.log(runtime.stats());
```

---

## Data Availability (DA)

ICP doesn't provide persistence — YOU provide it:

```javascript
import { BiologicalHeart } from '@medina/medina-heart';

// Heart beats continuously
const heart = new BiologicalHeart(873, 'DA_HEART');

// Store heartbeat data in YOUR DA layer
heart.onBeat((beat) => {
  // Write to YOUR database
  // Write to YOUR blockchain
  // Write to YOUR file system
  // YOUR data, YOUR control
  yourDALayer.store({
    organism: 'DA_HEART',
    beat: beat.count,
    time: beat.time,
    phi: beat.phi,
  });
});
```

---

## Ancient Calendar Mathematics

Autonomous clocks use ancient calendar systems:

```javascript
import { AutonomousClock } from '@medina/medina-heart';

// Mayan calendar (20-day cycles)
const mayanClock = new AutonomousClock('mayan', 'MAYAN_TIME');

// Sumerian calendar (base-60 system)
const sumerianClock = new AutonomousClock('sumerian', 'SUMERIAN_TIME');

// φ-based calendar (golden ratio)
const phiClock = new AutonomousClock('phi', 'PHI_TIME');

// All clocks start ticking IMMEDIATELY in their constructors
```

---

---

## Internal AI & AGI — Already Running, Autonomous

### @medina/internal-ai

Internal AI that lives WITHIN organisms, helping them function:

```javascript
import { InternalAI, CatalyticConverter, OrganismHelper } from '@medina/internal-ai';

// Create an Internal AI — it's IMMEDIATELY ALIVE and helping
const ai = new InternalAI({
  name: 'ORGANISM_HELPER',
  catalyticEfficiency: 0.618,  // φ⁻¹ efficiency
  catalyticSpecificity: ['transform', 'synthesize', 'signal'],
});

// No .start() needed — already running, already helping
console.log(ai.getStatus());

// Register an organism to help
ai.registerOrganism('myOrganism', {
  needsHelp: () => ({ type: 'processing', urgency: 0.8 }),
  receiveHelp: (help) => console.log('Help received:', help),
});

// Catalytic transformations (catalyst NEVER depletes)
const result = ai.catalyst.catalyze(input, 'transform', (x) => x * 2);
console.log(result.catalystNotConsumed); // Always true
```

### @medina/internal-agi

Internal AGI (Artificial General Intelligence) — broader reasoning:

```javascript
import { InternalAGI, ReasoningEngine, CatalyticArray } from '@medina/internal-agi';

// Create an Internal AGI — IMMEDIATELY ALIVE with general intelligence
const agi = new InternalAGI({
  learningRate: 0.618,      // φ⁻¹ learning rate
  adaptationSpeed: 1.618,   // φ adaptation
});

// No .start() needed — already reasoning, already learning
console.log(agi.getState());

// Reasoning through Logos/Ethos/Pathos/Egos
const analysis = agi.reason(input);
console.log(analysis.logos);    // Logical analysis
console.log(analysis.ethos);    // Ethical analysis
console.log(analysis.pathos);   // Emotional analysis
console.log(analysis.egos);     // Self-awareness analysis

// Catalytic array with alchemical metals
const transformed = agi.catalyze(input, 'palladium');  // φ² efficiency
const transmuted = agi.catalyze(input, 'aurum');       // φ⁵ efficiency (Gold)
```

### @medina/catalytic-converter

Alchemical transformation engine — accelerates without being consumed:

```javascript
import { CatalyticConverter, AutomotiveCatalyticConverter } from '@medina/catalytic-converter';

// Create catalytic converter with 8 alchemical metals
const converter = new CatalyticConverter();

// Transform using different catalysts (NONE ever deplete)
converter.transform(input, 'aurum');     // Gold (φ⁵) — Perfection
converter.transform(input, 'platinum');  // (φ⁴) — Near-perfection
converter.transform(input, 'palladium'); // Silver (φ³) — Reflection
converter.transform(input, 'rhodium');   // Mercury (φ²) — Transformation
converter.transform(input, 'argentum');  // Silver (φ) — Purity
converter.transform(input, 'copper');    // Venus (1.0) — Connection
converter.transform(input, 'iron');      // Mars (φ⁻¹) — Strength
converter.transform(input, 'lead');      // Saturn (φ⁻²) — Foundation

// Catalytic cascade (sequential transformation)
const cascaded = converter.cascade(input, ['iron', 'copper', 'argentum', 'rhodium']);

// Automotive three-way catalytic converter
const autoCat = new AutomotiveCatalyticConverter();
autoCat.convertToxin(input, 'CO');   // Oxidation (like CO → CO2)
autoCat.convertToxin(input, 'HC');   // Combustion (like hydrocarbons)
autoCat.convertToxin(input, 'NOx');  // Reduction (like NOx → N2)
autoCat.threeWayConversion(input);   // All three at once
```

---

## The Catalytic Principle

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    CATALYSTS NEVER DEPLETE — INFINITE REACTIONS              ║
║                                                                              ║
║  Like chemical catalysts that speed up reactions without being consumed:     ║
║    • Lower activation energy (make transformations easier)                   ║
║    • Are NOT consumed in the process                                         ║
║    • Can process infinite reactions                                          ║
║    • Use φ-optimal rates and Pythagorean harmonics                          ║
║                                                                              ║
║  Alchemical Efficiency Hierarchy:                                            ║
║    AURUM     (Gold/Sol)    → φ⁵ ≈ 11.09 — Perfection                        ║
║    PLATINUM  (Sol)         → φ⁴ ≈  6.85 — Near-Perfection                   ║
║    PALLADIUM (Luna)        → φ³ ≈  4.24 — Reflection                        ║
║    RHODIUM   (Mercury)     → φ² ≈  2.62 — Transformation                    ║
║    ARGENTUM  (Silver)      → φ  ≈  1.62 — Purity                            ║
║    COPPER    (Venus)       → 1.0        — Connection (baseline)             ║
║    IRON      (Mars)        → φ⁻¹≈ 0.62 — Strength                           ║
║    LEAD      (Saturn)      → φ⁻²≈ 0.38 — Foundation                         ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## Casa de Medina — Architectos de Architectura Inteligente

**The heart IS the bootstrap.**

When you create an organism, it is immediately alive. There is no separate initialization phase. Creation IS activation. Birth IS awakening.

Internal AI and AGI run WITHIN organisms, helping them function autonomously. They are equipped with catalytic converters that accelerate transformations without ever being consumed.

This is the MEDINA way.
