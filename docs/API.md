# CyberSecurity-AI Local API

The HTTP API is local-first and dependency-free. It is intended for demos, local dashboards, and platform pilots.

## Start

```bash
cybersecurity-ai-http --host 127.0.0.1 --port 8767
```

or:

```bash
python -m mcp_server.http_server --host 127.0.0.1 --port 8767
```

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Service health, boundary packet, private-trunk exposure flag |
| `GET /platform` | Full platform summary: surfaces, use cases, capability matrix, bridge, boundary |
| `GET /careers` | Public-safe career catalog |
| `GET /use-cases` | Real buyer use-case catalog |
| `GET /use-case?id=soc-onboarding-copilot` | One use-case packet |
| `GET /capabilities` | Capability matrix by security domain |
| `GET /demo?use_case=incident-tabletop-builder` | Polished operator demo packet |
| `GET /search?q=iam` | Policy-checked career, use-case, and capability search |
| `GET /bridge` | CHIMERIA approved-manifest bridge status |
| `GET /architecture` | Architecture map and platform flows |
| `GET /routes` | MCP, CLI, HTTP, dashboard, and bridge route inventory |

## Demo Sequence

```bash
curl http://127.0.0.1:8767/health
curl http://127.0.0.1:8767/platform
curl http://127.0.0.1:8767/use-cases
curl http://127.0.0.1:8767/capabilities
curl 'http://127.0.0.1:8767/demo?use_case=soc-onboarding-copilot'
curl http://127.0.0.1:8767/bridge
```

## Boundary

The local API does not expose private CHIMERIA source code, exploit instructions, malware workflows, or production compliance claims.
