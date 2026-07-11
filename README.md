<p align="center">
  <img src="docs/assets/cybersecurity-ai-logo.svg" alt="CyberSecurity-AI" width="100%">
</p>

# CyberSecurity-AI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-stdio-green.svg)](https://modelcontextprotocol.io)
[![CLI](https://img.shields.io/badge/CLI-platform%20operator-22c55e.svg)](#cli)
[![HTTP](https://img.shields.io/badge/HTTP-local%20demo%20API-a78bfa.svg)](docs/API.md)
[![Dashboard](https://img.shields.io/badge/Dashboard-static%20demo-f59e0b.svg)](dashboard/index.html)
[![Boundary](https://img.shields.io/badge/Boundary-defensive%20AI-purple.svg)](docs/PRODUCTION_BOUNDARY.md)

**CyberSecurity-AI** is a public-safe cybersecurity intelligence platform for MCP clients, command-line workflows, local HTTP demos, browser dashboards, security-role mapping, real buyer use cases, and approved private CHIMERIA bridge packets.

It is the market-facing cybersecurity lane for the Medina / MESIE ecosystem. **CHIMERIA remains the private trunk**. CyberSecurity-AI can use CHIMERIA only through approved public-safe manifests; it does not expose private CHIMERIA implementation details.

![Platform architecture](docs/assets/platform-architecture.svg)

![Real use flow](docs/assets/use-case-flow.svg)

## Platform Surfaces

| Surface | Command | Purpose |
|---|---|---|
| MCP stdio | `python -m mcp_server.server` | Connect Claude Desktop, Cursor, Grok-compatible MCP hosts, and local agents |
| CLI | `cybersecurity-ai platform` | Local operator packets, demos, search, market packets, bridge checks |
| HTTP demo API | `cybersecurity-ai-http --port 8767` | Browser/local dashboard-ready JSON endpoints |
| Static dashboard | `open dashboard/index.html` | Screenshot-ready platform/product demo |
| CHIMERIA bridge | `CHIMERIA_BRIDGE_MANIFEST=/secure/path/public_bridge_manifest.json` | Approved private manifest consumption without exposing the trunk |

## What It Does

- Turns cybersecurity roles, teams, skills, buyer problems, and defensive workflows into live AI tools.
- Supports SOC onboarding, incident tabletop planning, GRC control ownership, IAM maturity, cloud security, threat intelligence, and AI product enablement.
- Runs across MCP clients, terminal workflows, local HTTP demos, browser dashboards, and platform pilots.
- Provides a protected `chimeria_bridge_status` and `chimeria_route` path for approved private manifests.
- Keeps the public repo defensive, educational, marketable, and safe.

## Real Use Cases

| Use case | Real outputs |
|---|---|
| SOC Onboarding Copilot | analyst packet, first-week plan, escalation checklist, skill gap map |
| Incident Tabletop Builder | tabletop agenda, RACI map, evidence checklist, recovery brief |
| GRC Control Owner Map | control-owner matrix, evidence plan, audit-prep checklist, risk summary |
| IAM / Zero-Trust Maturity Planner | maturity map, access review plan, least-privilege brief, roadmap |
| AI Security Product Enablement | MCP integration plan, safe prompt set, product security packet |
| CHIMERIA Approved Private Demo | approved manifest status, release boundary proof, `private_trunk_exposed=false` receipt |

## MCP Tools

| Tool | Description |
|------|-------------|
| `career_list` | List careers by team/stage |
| `career_get` | Full compressed public-safe career profile |
| `career_search` | Keyword search across roles and capabilities |
| `career_invoke` | Create a safe career intelligence packet for platform use |
| `career_triple_route` | MESIE P1/P2/P3 routing map plus CHIMERIA bridge status |
| `chimeria_bridge_status` | Check approved private CHIMERIA manifest connection |
| `chimeria_route` | Route a public-safe packet toward the private CHIMERIA bridge boundary |
| `platform_summary` | Full platform packet for demos and pilots |
| `platform_routes` | MCP, CLI, HTTP, dashboard, and bridge route inventory |
| `architecture_map` | Architecture planes and data flows |
| `market_packet` | Market-safe positioning packet for an audience |
| `policy_check` | Check text against the public CyberSecurity-AI boundary |
| `use_case_list` | List buyer use cases with workflows, outputs, and MCP tools |
| `use_case_get` | Get one use-case packet |
| `capability_matrix` | Defensive cybersecurity capability domains and maturity levels |
| `demo_packet` | Generate a polished demo packet for a specific use case |

## Quick Start

```bash
git clone https://github.com/ItsNotAILABS/CyberSecurity-AI.git
cd CyberSecurity-AI
python -m pip install -e .
```

Run MCP:

```bash
python -m mcp_server.server
```

Run CLI:

```bash
cybersecurity-ai platform
cybersecurity-ai use-cases
cybersecurity-ai capabilities
cybersecurity-ai demo --use-case soc-onboarding-copilot
cybersecurity-ai bridge
```

Run local HTTP demo API:

```bash
cybersecurity-ai-http --host 127.0.0.1 --port 8767
```

Open:

```text
http://127.0.0.1:8767/platform
http://127.0.0.1:8767/careers
http://127.0.0.1:8767/use-cases
http://127.0.0.1:8767/capabilities
http://127.0.0.1:8767/demo?use_case=soc-onboarding-copilot
http://127.0.0.1:8767/search?q=iam
http://127.0.0.1:8767/architecture
http://127.0.0.1:8767/bridge
```

Open dashboard:

```bash
open dashboard/index.html
```

## MCP Configuration

```json
{
  "mcpServers": {
    "cybersecurity-ai": {
      "command": "python",
      "args": ["-m", "mcp_server.server"],
      "cwd": "/absolute/path/to/CyberSecurity-AI",
      "env": {
        "MESIE_CAREER_PILLAR": "cybersecurity"
      }
    }
  }
}
```

## Optional CHIMERIA Bridge

CHIMERIA is the private trunk. CyberSecurity-AI can use CHIMERIA only through an approved bridge manifest.

```bash
export CHIMERIA_BRIDGE_MANIFEST=/secure/path/public_bridge_manifest.json
```

or:

```bash
export CHIMERIA_BRIDGE_DIR=/secure/path/chimeria-bridge
```

The public adapter only reads approved fields and always reports:

```json
{
  "private_trunk_exposed": false
}
```

## Architecture Flow

```mermaid
flowchart LR
  Client[AI Clients / Browser / Terminal] --> MCP[MCP stdio]
  Client --> CLI[CLI]
  Client --> HTTP[HTTP Demo API]
  Client --> DASH[Static Dashboard]
  MCP --> Core[Public-Safe Core]
  CLI --> Core
  HTTP --> Core
  DASH --> Core
  Core --> Careers[Career Taxonomy]
  Core --> Uses[Use-Case Catalog]
  Core --> Cap[Capability Matrix]
  Core --> Policy[Policy Boundary]
  Core --> Packets[Market + Demo Packets]
  Core --> Bridge[CHIMERIA Bridge Adapter]
  Bridge --> Manifest[(Approved Manifest Only)]
  Manifest --> Safe[Approved Fields]
  Bridge -. blocks .-> Private[Private CHIMERIA Trunk Internals]
```

## Smoke Test

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n' | python -m mcp_server.server
```

## Test

```bash
python -m pip install -e . pytest
python -m pytest -q
```

## Market Position

CyberSecurity-AI is designed for:

- AI builders who need a cybersecurity MCP.
- Cybersecurity teams mapping roles, skills, and workflows.
- Training providers building SOC, IR, GRC, IAM, cloud-security, and threat-intelligence curricula.
- Enterprise pilots that need a safe public intelligence layer with a private defense trunk behind it.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Flows](docs/FLOWS.md)
- [Real Use Cases](docs/REAL_USE_CASES.md)
- [Local API](docs/API.md)
- [Platform Marketing Pack](docs/PLATFORM_MARKETING.md)
- [MCP Client Setup](docs/MCP_CLIENTS.md)
- [Platform Roadmap](docs/PLATFORM_ROADMAP.md)
- [Production Boundary](docs/PRODUCTION_BOUNDARY.md)
- [CHIMERIA Bridge](docs/CHIMERIA_BRIDGE.md)

## Boundary

CyberSecurity-AI is defensive and educational. It does not provide exploit instructions, malware workflows, unauthorized-access guidance, or private CHIMERIA trunk implementation details.

## License

MIT — see [LICENSE](LICENSE).
