<p align="center">
  <img src="docs/assets/cybersecurity-ai-logo.svg" alt="CyberSecurity-AI" width="100%">
</p>

# CyberSecurity-AI

**Defensive cybersecurity intelligence, assessment and incident-planning platform for MCP, CLI, HTTP and browser workflows.**

CyberSecurity-AI turns security roles, control frameworks, incident scenarios and enterprise security questions into structured defensive outputs that can be consumed by humans, agents and the NEXUS ecosystem.

```text
Security question / incident / control gap
                 │
                 ▼
          CyberSecurity-AI
                 │
                 ├── capability mapping
                 ├── incident tabletop
                 ├── control ownership
                 ├── IAM / zero-trust maturity
                 ├── defensive policy checks
                 ├── buyer/use-case packets
                 └── approved CHIMERIA bridge packet
                 │
                 ▼
artifact + receipt + remediation plan
```

## Install

```bash
git clone https://github.com/ItsNotAILABS/CyberSecurity-AI.git
cd CyberSecurity-AI
python -m pip install -e .
```

## Product surfaces

| Surface | Command |
|---|---|
| MCP stdio | `python -m mcp_server.server` |
| CLI | `cybersecurity-ai platform` |
| HTTP API | `cybersecurity-ai-http --port 8767` |
| Dashboard | open `dashboard/index.html` |
| NEXUS | `ecosystem.surface.json` |

## Practical use cases

```text
SOC onboarding
incident tabletop planning
GRC control-owner mapping
IAM / zero-trust maturity assessment
cloud-security planning
security-role capability mapping
AI product security enablement
public-safe CHIMERIA integration packets
```

## MCP tools

The MCP surface includes career/security-role discovery, capability matrices, use-case packets, policy checks, architecture maps and approved CHIMERIA bridge operations.

Start the server:

```bash
python -m mcp_server.server
```

## NEXUS federation

Declaration: [`ecosystem.surface.json`](ecosystem.surface.json).

Primary actions:

```text
security.capability_map
security.incident_tabletop
security.control_map
security.maturity_assess
security.policy_check
chimeria.bridge_packet
```

The security plane consumes NEXUS tasks/policy/context and can produce:

```text
nexus.artifact.v1
nexus.execution-receipt.v1
nexus.denial.v1
nexus.handoff.v1
```

The public bridge contract is documented in [`ECOSYSTEM_BOUNDARY.md`](ECOSYSTEM_BOUNDARY.md).

## Incident workflow

```text
incident/scenario
 -> scope systems and stakeholders
 -> map assets / controls / owners
 -> identify evidence required
 -> build timeline / tabletop
 -> produce containment/recovery checklist
 -> create artifact + receipt
 -> hand off to POCKET / operator
```

## Enterprise operation

For an internal deployment:

```text
[ ] bind HTTP service to approved network interface
[ ] put authentication/tenant policy in POCKET or gateway
[ ] store external credentials through secret bindings
[ ] enable request IDs and audit retention
[ ] keep CHIMERIA bridge manifests in an approved private path
[ ] retain produced tabletop/control artifacts by project/tenant
[ ] exercise denial behavior in CI
```

## Verify

Run the repository's Python/MCP/HTTP tests and policy checks. For ecosystem compatibility:

```bash
# from ItsNotAILABS/nexus
python tools/validate_ecosystem_protocols.py
python tools/validate_ecosystem_registry.py
python tools/production_gate.py
```

## CHIMERIA relationship

CyberSecurity-AI is the public-facing defensive product lane. CHIMERIA can remain a deeper private/research architecture and provide approved packets through a narrow manifest/bridge interface.

```text
CyberSecurity-AI
      │
      └── approved bridge manifest
                 │
                 ▼
             CHIMERIA
```

## Ecosystem

- [NEXUS](https://github.com/ItsNotAILABS/nexus)
- [POCKET](https://github.com/ItsNotAILABS/pocket)
- [POCKET Agent](https://github.com/ItsNotAILABS/pocket-agent)
- [CHIMERIA](https://github.com/ItsNotAILABS/Chimeria)
- [ResearchersHub](https://github.com/ItsNotAILABS/ResearchersHub)

CyberSecurity-AI is built to turn defensive security knowledge into **operational packets, evidence and repeatable workflows** rather than generic chat answers.