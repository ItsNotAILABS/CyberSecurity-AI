"""Real-world use cases and platform packets for CyberSecurity-AI.

The platform is not just a role list. These packets are intended for actual
buyer demos, internal pilots, AI-client workflows, and security program
planning while preserving a defensive-only boundary.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Iterable


@dataclass(frozen=True)
class UseCase:
    id: str
    title: str
    buyer: str
    problem: str
    workflow: tuple[str, ...]
    outputs: tuple[str, ...]
    mcp_tools: tuple[str, ...]
    safety_boundary: str

    def to_dict(self) -> dict:
        out = asdict(self)
        for key in ("workflow", "outputs", "mcp_tools"):
            out[key] = list(out[key])
        return out


USE_CASES: tuple[UseCase, ...] = (
    UseCase(
        id="soc-onboarding-copilot",
        title="SOC Onboarding Copilot",
        buyer="MSSPs, enterprise SOC teams, cybersecurity bootcamps",
        problem="New analysts need role clarity, tool context, escalation hygiene, and safe scenario practice without being exposed to offensive instructions.",
        workflow=("select SOC role", "map skills and tools", "generate first-week plan", "produce escalation checklist", "route approved context to CHIMERIA bridge if available"),
        outputs=("role packet", "onboarding plan", "safe scenario prompts", "manager briefing", "skill gap map"),
        mcp_tools=("career_get", "career_search", "career_invoke", "platform_summary"),
        safety_boundary="Defensive workflow only; no exploit reproduction, bypass, or malware instructions.",
    ),
    UseCase(
        id="incident-tabletop-builder",
        title="Incident Tabletop Builder",
        buyer="Security leaders, compliance teams, incident response consultants",
        problem="Teams need repeatable tabletop scenarios aligned to roles, communications, evidence handling, and recovery responsibilities.",
        workflow=("choose incident-response role", "select business context", "generate tabletop agenda", "map decisions to owners", "create postmortem template"),
        outputs=("tabletop plan", "RACI map", "executive update draft", "evidence checklist", "recovery brief"),
        mcp_tools=("career_search", "career_invoke", "policy_check", "market_packet"),
        safety_boundary="Scenario and response planning only; no adversary playbooks or operational exploit details.",
    ),
    UseCase(
        id="grc-control-owner-map",
        title="GRC Control Owner Map",
        buyer="GRC teams, startups preparing audits, platform vendors",
        problem="Organizations struggle to connect security controls to human owners, evidence sources, and operational workflows.",
        workflow=("search GRC roles", "map evidence responsibilities", "generate control-owner packet", "summarize risk and next steps"),
        outputs=("control owner matrix", "evidence collection plan", "policy literacy brief", "audit prep checklist"),
        mcp_tools=("career_search", "career_get", "platform_routes"),
        safety_boundary="Education and planning only; no certification claim unless external evidence exists.",
    ),
    UseCase(
        id="iam-zero-trust-maturity",
        title="IAM / Zero-Trust Maturity Planner",
        buyer="IT leaders, identity teams, security architects",
        problem="Identity programs need a clear maturity path across MFA, SSO, RBAC, PAM, lifecycle automation, and access reviews.",
        workflow=("search IAM roles", "map controls to maturity levels", "generate phase plan", "prepare executive roadmap"),
        outputs=("maturity map", "phase plan", "role responsibility packet", "platform/tool comparison brief"),
        mcp_tools=("career_search", "career_get", "architecture_map"),
        safety_boundary="Defensive identity hardening only; no credential theft, bypass, or evasion guidance.",
    ),
    UseCase(
        id="ai-security-product-enablement",
        title="AI Security Product Enablement",
        buyer="AI app teams, developer tool companies, internal platform groups",
        problem="AI products need a safe cybersecurity vocabulary, role taxonomy, and defensive workflow packets without accidentally shipping unsafe cyber guidance.",
        workflow=("connect MCP", "call platform_summary", "select use case", "embed policy_check", "route safe role packets into product UX"),
        outputs=("MCP integration plan", "tool inventory", "safe prompt templates", "platform capability sheet"),
        mcp_tools=("platform_summary", "platform_routes", "policy_check", "career_invoke"),
        safety_boundary="Public-safe defensive enablement only; private CHIMERIA trunk is never exposed.",
    ),
    UseCase(
        id="chimeria-approved-private-demo",
        title="CHIMERIA Approved Private Demo",
        buyer="Private pilots, MedinaSITech internal team, trusted enterprise partners",
        problem="The public CyberSecurity-AI layer needs to demonstrate private trunk value without disclosing trunk implementation.",
        workflow=("export approved manifest", "set CHIMERIA_BRIDGE_MANIFEST", "call chimeria_bridge_status", "route a safe use-case packet", "show approved fields only"),
        outputs=("bridge status packet", "approved capability list", "release-boundary proof", "private_trunk_exposed=false receipt"),
        mcp_tools=("chimeria_bridge_status", "chimeria_route", "career_triple_route"),
        safety_boundary="Approved manifest only; no private source code, internal doctrine internals, or regulated implementation claims.",
    ),
)


def list_use_cases(buyer: str | None = None) -> list[dict]:
    rows: Iterable[UseCase] = USE_CASES
    if buyer:
        needle = buyer.lower()
        rows = [u for u in rows if needle in u.buyer.lower()]
    return [u.to_dict() for u in rows]


def get_use_case(use_case_id: str) -> dict | None:
    for item in USE_CASES:
        if item.id == use_case_id:
            return item.to_dict()
    return None


def search_use_cases(query: str) -> list[dict]:
    q = query.lower().strip()
    if not q:
        return list_use_cases()
    hits = []
    for item in USE_CASES:
        blob = " ".join([
            item.id,
            item.title,
            item.buyer,
            item.problem,
            " ".join(item.workflow),
            " ".join(item.outputs),
            " ".join(item.mcp_tools),
            item.safety_boundary,
        ]).lower()
        if q in blob:
            hits.append(item.to_dict())
    return hits
