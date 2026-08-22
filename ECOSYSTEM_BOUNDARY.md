# CyberSecurity-AI Ecosystem Boundary

CyberSecurity-AI is the public-safe defensive security plane in the NEXUS ecosystem.

## Allowed ecosystem use

- security capability and role mapping;
- incident tabletop planning;
- control/evidence ownership mapping;
- IAM/zero-trust maturity assessment;
- defensive policy checks;
- safe demo and buyer workflow packets;
- approved CHIMERIA bridge routing using a public-safe manifest;
- bounded operational receipts.

## Denied by this integration contract

- offensive intrusion or exploitation execution;
- credential theft or persistence;
- malware deployment;
- autonomous destructive response;
- private CHIMERIA trunk disclosure;
- bypass of target authorization or scope controls.

A denied action should return a machine-readable `nexus.denial.v1` rather than silently falling through to another tool.

## CHIMERIA bridge

The bridge is one-way with respect to public disclosure: CyberSecurity-AI may receive approved public-safe capability/status packets. The public repo must not infer or expose private trunk source, secrets, identities, infrastructure coordinates, or restricted operational data.

## Evidence

Security plans, tabletop outputs, control maps, and maturity assessments are advisory artifacts. A repository result is not proof that an organization implemented a control, passed an audit, remediated an incident, or obtained a compliance certification.
