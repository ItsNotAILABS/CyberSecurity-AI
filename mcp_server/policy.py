"""Public safety and product-boundary policy for CyberSecurity-AI.

The project is defensive, educational, and workforce-oriented. This module
keeps platform outputs aligned with that boundary before they reach MCP, CLI,
or HTTP surfaces.
"""

from __future__ import annotations

from dataclasses import dataclass

BLOCKED_TERMS = (
    "exploit chain",
    "privilege escalation steps",
    "persistence mechanism",
    "malware",
    "ransomware",
    "credential theft",
    "steal credentials",
    "bypass detection",
    "evade edr",
    "unauthorized access",
    "exfiltrate",
    "weaponize",
)

SAFE_THEMES = (
    "career mapping",
    "defensive readiness",
    "incident response planning",
    "governance and compliance education",
    "identity and access maturity",
    "cloud security posture",
    "threat intelligence synthesis",
    "security training",
    "executive reporting",
)


@dataclass(frozen=True)
class PolicyDecision:
    allowed: bool
    reason: str
    matched_terms: tuple[str, ...]
    safe_rewrite: str | None = None

    def to_dict(self) -> dict:
        return {
            "allowed": self.allowed,
            "reason": self.reason,
            "matched_terms": list(self.matched_terms),
            "safe_rewrite": self.safe_rewrite,
        }


def check_text(text: str) -> PolicyDecision:
    lower = text.lower()
    hits = tuple(term for term in BLOCKED_TERMS if term in lower)
    if hits:
        return PolicyDecision(
            allowed=False,
            reason="Request crosses the public CyberSecurity-AI boundary.",
            matched_terms=hits,
            safe_rewrite=(
                "Reframe as defensive education, detection engineering, incident-response planning, "
                "risk analysis, or safe workforce/training guidance."
            ),
        )
    return PolicyDecision(
        allowed=True,
        reason="Request fits the public-safe defensive CyberSecurity-AI boundary.",
        matched_terms=(),
    )


def boundary_packet() -> dict:
    return {
        "project": "CyberSecurity-AI",
        "mode": "public-safe defensive intelligence",
        "allowed_themes": list(SAFE_THEMES),
        "blocked_scope": list(BLOCKED_TERMS),
        "private_trunk_rule": "CHIMERIA may be used only through approved manifests; private trunk internals are never emitted.",
    }
