# ALPHA TOOLS — @medina/alpha-tools

**Production adapters, plugins, and orchestration tools for NOVA sovereign infrastructure.**

Deployed. Packaged. On Pages. Self-bootstrapping — alive on creation.

---

## Architecture

```
sdk/alpha-tools/
├── src/
│   ├── index.js       → Core: AlphaTool, AlphaAdapter, AlphaPlugin, AlphaToolRegistry
│   ├── build.js       → Production build script
│   ├── validate.js    → Validation suite
│   └── deploy.js      → Sovereign deployment
├── adapters/
│   └── index.js       → NetworkAdapter, ProtocolAdapter, OrganismAdapter, LanguageAdapter
├── plugins/
│   └── index.js       → GeometricLock, Oracle, Scribe, Guardian, Entanglement
├── pages/
│   └── index.js       → DashboardPage, ApiPage (deployed endpoints)
└── package.json
```

## Tools

### Core Classes

| Class | Purpose |
|-------|---------|
| `AlphaTool` | Base tool — self-bootstrapping, heartbeat, metrics |
| `AlphaAdapter` | System bridge — transforms, routes, buffers |
| `AlphaPlugin` | Capability module — hooks, priority, enable/disable |
| `AlphaToolRegistry` | Manages all tools, pipelines, orchestration |

### Production Adapters (7 deployed)

| Adapter | Bridges |
|---------|---------|
| `icpAdapter` | NOVA ↔ Internet Computer |
| `ethAdapter` | NOVA ↔ Ethereum |
| `novaWireAdapter` | JSON ↔ Nova Wire Protocol |
| `brainAdapter` | User ↔ Brain Organism |
| `oracleAdapter` | User ↔ Oracle Organism |
| `guardianAdapter` | User ↔ Guardian Organism |
| `cplAdapter` | Natural Language ↔ CPL-L |

### Production Plugins (5 deployed)

| Plugin | Capability |
|--------|-----------|
| `geometricLock` | φ-resonance authentication (Kuramoto) |
| `oraclePrediction` | φ-weighted temporal foresight |
| `scribe` | Sovereign audit logging |
| `guardian` | Security enforcement rules |
| `entanglement` | Cross-system quantum-inspired sync |

### Pages (Deployed Endpoints)

| Route | Output |
|-------|--------|
| `/dashboard` | System health, registry status |
| `/status` | Tool status array |
| `/tools` | Full tool listing |
| `/metrics` | Aggregate performance data |
| `/api/invoke` | Programmatic tool invocation |
| `/api/query` | Tool/registry query |
| `/api/registry` | Registry information |

## Usage

```javascript
import { AlphaAdapter, AlphaPlugin, registry } from '@medina/alpha-tools';
import '@medina/alpha-tools/adapters';
import '@medina/alpha-tools/plugins';
import '@medina/alpha-tools/pages';

// All tools self-bootstrap — alive immediately
// Registry is singleton — always accessible

// Invoke a tool
const result = await registry.getTool(toolId).invoke(payload);

// Create pipeline
registry.createPipeline('auth-then-process', [guardianId, brainId]);
const output = await registry.executePipeline('auth-then-process', input);

// Custom adapter
const myAdapter = new AlphaAdapter({
  name: 'MY-BRIDGE',
  sourceProtocol: 'nova-internal',
  targetProtocol: 'my-system',
});
myAdapter.registerTransformer('format', data => transform(data));
registry.registerTool(myAdapter);
```

## Mathematical Foundation

- **φ = (1+√5)/2** — Golden ratio governs all timing, priority, decay
- **Heartbeat: 873ms** — 540 × φ biological pulse
- **Kuramoto R** — Phase synchronization for authentication
- **Pythagorean Ratios** — Harmonic series for resource allocation
- **φ-exponential backoff** — Network retry strategy

## Status

✅ Production — All tools deployed and alive  
✅ Self-bootstrapping — No init needed  
✅ Sovereign — No external dependencies  
✅ Packaged — @medina/alpha-tools  
✅ On Pages — Endpoints active  

---

*Casa de Medina — Architectos de Architectura Inteligente*
