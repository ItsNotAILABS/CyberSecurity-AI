"""Capability matrix for CyberSecurity-AI.

This module gives the platform concrete product language: domains, workflows,
outputs, and maturity levels that can be used by MCP, CLI, API, docs, and demos.
"""

from __future__ import annotations

CAPABILITY_MATRIX = (
    {
        "domain": "Security Operations",
        "capabilities": ["alert triage", "case notes", "escalation mapping", "SOC onboarding", "shift handoff"],
        "outputs": ["analyst packet", "triage checklist", "shift brief", "manager summary"],
        "maturity": ["starter", "team", "program"],
    },
    {
        "domain": "Incident Response",
        "capabilities": ["tabletop planning", "containment coordination", "communications", "recovery sequencing", "postmortems"],
        "outputs": ["tabletop agenda", "RACI", "executive update", "evidence checklist", "lessons-learned report"],
        "maturity": ["starter", "team", "program", "enterprise"],
    },
    {
        "domain": "Governance Risk Compliance",
        "capabilities": ["control literacy", "evidence planning", "owner mapping", "risk register support", "policy inventory"],
        "outputs": ["control owner map", "evidence plan", "audit prep checklist", "risk summary"],
        "maturity": ["starter", "team", "program"],
    },
    {
        "domain": "Identity and Access",
        "capabilities": ["SSO", "MFA", "RBAC", "PAM", "access reviews", "lifecycle automation"],
        "outputs": ["IAM maturity map", "access review plan", "least-privilege brief", "zero-trust roadmap"],
        "maturity": ["starter", "team", "program", "enterprise"],
    },
    {
        "domain": "Cloud Security",
        "capabilities": ["landing-zone review", "CSPM literacy", "logging", "network segmentation", "secure delivery"],
        "outputs": ["cloud roadmap", "architecture review packet", "guardrail checklist", "risk brief"],
        "maturity": ["team", "program", "enterprise"],
    },
    {
        "domain": "Threat Intelligence",
        "capabilities": ["intel requirements", "ATT&CK mapping", "risk narratives", "detection priorities", "briefing support"],
        "outputs": ["intel brief", "threat model", "detection priority list", "executive threat summary"],
        "maturity": ["starter", "team", "program"],
    },
    {
        "domain": "AI Security Enablement",
        "capabilities": ["safe MCP integration", "policy checks", "prompt boundary", "role packets", "product enablement"],
        "outputs": ["MCP tool plan", "safe prompt set", "AI product security packet", "platform integration brief"],
        "maturity": ["starter", "team", "program"],
    },
)


def capability_matrix() -> list[dict]:
    return [dict(row) for row in CAPABILITY_MATRIX]


def capability_domains() -> list[str]:
    return [row["domain"] for row in CAPABILITY_MATRIX]


def search_capabilities(query: str) -> list[dict]:
    q = query.lower().strip()
    if not q:
        return capability_matrix()
    hits = []
    for row in CAPABILITY_MATRIX:
        blob = " ".join([row["domain"], " ".join(row["capabilities"]), " ".join(row["outputs"]), " ".join(row["maturity"])]).lower()
        if q in blob:
            hits.append(dict(row))
    return hits
