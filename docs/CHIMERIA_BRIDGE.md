# CyberSecurity-AI ↔ CHIMERIA Bridge

## Purpose

CyberSecurity-AI remains the public-facing MESIE cybersecurity MCP/career intelligence lane. CHIMERIA remains the private sovereign defense architecture lane.

This bridge defines how the two repositories relate without leaking private doctrine, regulated security claims, or unverified production claims into the public repo.

## Repository Roles

| Repository | Role | Boundary |
|---|---|---|
| `ItsNotAILABS/CyberSecurity-AI` | Public cybersecurity MCP/career intelligence pillar | Defensive education, workforce mapping, safe MCP host integration, public docs |
| `ItsNotAILABS/Chimeria` | Private CHIMERIA DEFENSE architecture and sovereign defense doctrine | Protected architecture, governance, proof registers, private product/control plane |

## Allowed Bridge Data

CyberSecurity-AI may expose:

- Cybersecurity career profiles
- Defensive role taxonomy
- SOC/IR/GRC/IAM/zero-trust learning pathways
- Safe MCP tool metadata
- Public-safe references to CHIMERIA as a protected private architecture lane

CyberSecurity-AI must not expose:

- Exploit instructions
- Offensive tradecraft
- Private CHIMERIA implementation details
- Unverified certification claims
- Regulated deployment claims without evidence

## Integration Pattern

1. CyberSecurity-AI emits public-safe cybersecurity role and capability packets.
2. CHIMERIA consumes those packets privately as workforce, control, or defense-domain taxonomy.
3. CHIMERIA proof receipts decide what can be promoted back into public documentation.
4. Any public release must pass a claim-boundary review.

## Immediate Repo Health Notes

The current CyberSecurity-AI README advertises `mcp-server/server.py`, while `pyproject.toml` advertises `mcp_server.server:main`. The repository should normalize one package path and add a smoke test before claiming the MCP server is runnable.
