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
| `GET /platform` | Full platform summary |
| `GET /careers` | Public-safe career catalog |
| `GET /search?q=iam` | Policy-checked career/capability search |
| `GET /bridge` | CHIMERIA approved-manifest bridge status |
| `GET /architecture` | Architecture map and platform flows |
| `GET /routes` | MCP and HTTP route inventory |

## Boundary

The local API does not expose private CHIMERIA source code, exploit instructions, malware workflows, or production compliance claims.
