# mesie-career-cybersecurity

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-stdio-green.svg)](https://modelcontextprotocol.io)
[![Careers](https://img.shields.io/badge/Careers-200-orange.svg)](#overview)

**200 compressed Cybersecurity careers** as an MCP stdio server for **Grok, Claude, Cursor, Antigravity**, and any MCP host.

Part of **[MESIE Career MCP Triple Protocol](https://github.com/FreddyCreates/Multi-Element-Spectral-Intelligence-Engine-MESIE)** — Loom P1 + MCP Colony P2 + Bridge P3.

## Overview

| | |
|---|---|
| **Pillar** | Cybersecurity |
| **Careers** | 200 |
| **Tagline** | SOC, IR, pentest, GRC, IAM, zero-trust, threat intel |
| **Protocol** | MESIE-CAREER-TRIPLE-PROTOCOL/1.0 |
| **HTTP hub** | `http://127.0.0.1:8767` (universal) |

## Triple Protocol

```
  AI Client ──P2──▶ Career MCP (this repo)
                      │
         P1 Loom ◀────┼────▶ P3 Bridge (:8750 / :8767)
                      │
                 200 careers (compressed)
```

## Quick Start

```bash
git clone https://github.com/FreddyCreates/mesie-career-cybersecurity.git
cd mesie-career-cybersecurity
pip install -e .
python mcp-server/server.py
```

## MCP Configuration

```json
{
  "mcpServers": {
    "mesie-career-cybersecurity": {
      "command": "python",
      "args": ["mcp-server/server.py"],
      "cwd": "/path/to/mesie-career-cybersecurity",
      "env": { "MESIE_CAREER_PILLAR": "cybersecurity" }
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `career_list` | List careers by team/stage |
| `career_get` | Full compressed profile |
| `career_search` | Keyword search |
| `career_invoke` | Pulse + federated envelope |
| `career_triple_route` | P1/P2/P3 routing map |

## Research

See [Working Paper](../deliverables/research/CAREER_MCP_TRIPLE_PROTOCOL_WORKING_PAPER.md) in the parent MESIE repo.

## License

MIT — see [LICENSE](LICENSE).
