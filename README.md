# CyberSecurity-AI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-stdio-green.svg)](https://modelcontextprotocol.io)
[![Boundary](https://img.shields.io/badge/Boundary-defensive%20AI-purple.svg)](docs/PRODUCTION_BOUNDARY.md)

**CyberSecurity-AI** is a public-safe cybersecurity intelligence MCP for career mapping, defensive workforce readiness, SOC/IR/GRC/IAM planning, and platform-native assistant workflows.

It is the market-facing cybersecurity lane for the Medina / MESIE ecosystem, with an optional protected bridge to the private **CHIMERIA** trunk. The bridge consumes only approved public-safe manifests and does not expose private CHIMERIA implementation details.

## What It Does

- Exposes cybersecurity career intelligence through MCP stdio.
- Supports SOC, incident response, GRC, IAM, cloud security, zero-trust, and threat-intelligence use cases.
- Runs in MCP-compatible clients such as Claude Desktop, Cursor, Grok-compatible hosts, local terminals, and internal agent stacks.
- Provides a protected `chimeria_bridge_status` and `chimeria_route` path for approved private manifests.
- Keeps the public repo defensive, educational, marketable, and safe.

## Tools

| Tool | Description |
|------|-------------|
| `career_list` | List careers by team/stage |
| `career_get` | Full compressed public-safe career profile |
| `career_search` | Keyword search across roles and capabilities |
| `career_invoke` | Create a safe career intelligence packet for platform use |
| `career_triple_route` | MESIE P1/P2/P3 routing map plus CHIMERIA bridge status |
| `chimeria_bridge_status` | Check approved private CHIMERIA manifest connection |
| `chimeria_route` | Route a public-safe packet toward the private CHIMERIA bridge boundary |

## Quick Start

```bash
git clone https://github.com/ItsNotAILABS/CyberSecurity-AI.git
cd CyberSecurity-AI
python -m pip install -e .
python -m mcp_server.server
```

After install, the console script is also available:

```bash
cybersecurity-ai-mcp
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

## Smoke Test

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n' | python -m mcp_server.server
```

## Test

```bash
python -m pip install -e .
python -m pytest -q
```

## Market Position

CyberSecurity-AI is designed for:

- AI builders who need a cybersecurity MCP.
- Cybersecurity teams mapping roles, skills, and workflows.
- Training providers building SOC, IR, GRC, IAM, and cloud-security curricula.
- Enterprise pilots that need a safe public intelligence layer with a private defense trunk behind it.

See:

- [Platform Marketing Pack](docs/PLATFORM_MARKETING.md)
- [MCP Client Setup](docs/MCP_CLIENTS.md)
- [Production Boundary](docs/PRODUCTION_BOUNDARY.md)
- [CHIMERIA Bridge](docs/CHIMERIA_BRIDGE.md)

## Boundary

CyberSecurity-AI is defensive and educational. It does not provide exploit instructions, malware workflows, unauthorized-access guidance, or private CHIMERIA trunk implementation details.

## License

MIT — see [LICENSE](LICENSE).
