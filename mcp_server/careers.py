"""Public-safe cybersecurity career taxonomy for CyberSecurity-AI.

This seed data is intentionally defensive, educational, and marketing-safe.
It can be expanded to the full 200-career catalog without changing the MCP
contract.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Iterable


@dataclass(frozen=True)
class CareerProfile:
    id: str
    title: str
    team: str
    stage: str
    summary: str
    skills: tuple[str, ...]
    platforms: tuple[str, ...]
    safe_uses: tuple[str, ...]

    def to_dict(self) -> dict:
        out = asdict(self)
        out["skills"] = list(self.skills)
        out["platforms"] = list(self.platforms)
        out["safe_uses"] = list(self.safe_uses)
        return out


CAREERS: tuple[CareerProfile, ...] = (
    CareerProfile(
        id="soc-analyst-l1",
        title="SOC Analyst I",
        team="Security Operations",
        stage="entry",
        summary="Triage alerts, document evidence, escalate verified incidents, and maintain defensive visibility.",
        skills=("SIEM", "alert triage", "case notes", "log review", "escalation hygiene"),
        platforms=("Splunk", "Microsoft Sentinel", "Elastic", "Chronicle"),
        safe_uses=("training paths", "job readiness", "SOC workflow mapping"),
    ),
    CareerProfile(
        id="incident-response-lead",
        title="Incident Response Lead",
        team="Incident Response",
        stage="senior",
        summary="Coordinate containment, evidence handling, communication, recovery, and lessons learned during security incidents.",
        skills=("containment", "forensics coordination", "executive updates", "recovery planning", "postmortems"),
        platforms=("EDR", "case management", "cloud audit logs", "SOAR"),
        safe_uses=("IR tabletop design", "role clarity", "response process planning"),
    ),
    CareerProfile(
        id="grc-analyst",
        title="GRC Analyst",
        team="Governance Risk Compliance",
        stage="mid",
        summary="Map controls, evidence, vendors, policies, and risk posture across security frameworks.",
        skills=("risk register", "control mapping", "policy review", "vendor security", "evidence collection"),
        platforms=("Drata", "Vanta", "ServiceNow GRC", "Archer"),
        safe_uses=("control education", "audit prep", "policy inventory"),
    ),
    CareerProfile(
        id="iam-engineer",
        title="IAM Engineer",
        team="Identity and Access",
        stage="mid",
        summary="Design least-privilege access, lifecycle automation, privileged access management, and identity governance.",
        skills=("SSO", "MFA", "RBAC", "SCIM", "PAM", "access reviews"),
        platforms=("Okta", "Entra ID", "SailPoint", "CyberArk"),
        safe_uses=("identity maturity planning", "access review design", "zero-trust mapping"),
    ),
    CareerProfile(
        id="cloud-security-architect",
        title="Cloud Security Architect",
        team="Cloud Security",
        stage="senior",
        summary="Define secure cloud landing zones, guardrails, logging, workload protection, and secure delivery patterns.",
        skills=("cloud guardrails", "CSPM", "logging", "network segmentation", "secure CI/CD"),
        platforms=("AWS", "Azure", "GCP", "Terraform", "Kubernetes"),
        safe_uses=("cloud security roadmap", "architecture reviews", "team capability mapping"),
    ),
    CareerProfile(
        id="threat-intel-analyst",
        title="Threat Intelligence Analyst",
        team="Threat Intelligence",
        stage="mid",
        summary="Turn threat reporting into defensive intelligence, detection priorities, and executive-ready risk context.",
        skills=("intel requirements", "ATT&CK mapping", "report synthesis", "detection briefs", "risk narratives"),
        platforms=("MISP", "OpenCTI", "ATT&CK", "TIP platforms"),
        safe_uses=("defensive prioritization", "briefing support", "threat model enrichment"),
    ),
)


def list_careers(team: str | None = None, stage: str | None = None) -> list[dict]:
    rows: Iterable[CareerProfile] = CAREERS
    if team:
        needle = team.lower()
        rows = [c for c in rows if needle in c.team.lower()]
    if stage:
        needle = stage.lower()
        rows = [c for c in rows if needle in c.stage.lower()]
    return [c.to_dict() for c in rows]


def get_career(career_id: str) -> dict | None:
    for career in CAREERS:
        if career.id == career_id:
            return career.to_dict()
    return None


def search_careers(query: str) -> list[dict]:
    q = query.lower().strip()
    if not q:
        return list_careers()
    hits = []
    for career in CAREERS:
        blob = " ".join([
            career.id,
            career.title,
            career.team,
            career.stage,
            career.summary,
            " ".join(career.skills),
            " ".join(career.platforms),
            " ".join(career.safe_uses),
        ]).lower()
        if q in blob:
            hits.append(career.to_dict())
    return hits
