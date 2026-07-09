"""CyberSecurity-AI platform layer.

This module turns the repo from a single MCP server into a platform surface:
MCP tools, CLI packets, HTTP endpoints, market-ready positioning, and the
protected CHIMERIA bridge all read from the same platform contract.
"""

from __future__ import annotations

from .careers import list_careers, search_careers
from .chimeria_bridge import bridge_status
from .policy import boundary_packet, check_text

PLATFORM_VERSION = "1.2.0"

PLATFORM_SURFACES = (
    {
        "id": "mcp-stdio",
        "name": "MCP stdio server",
        "audience": "Claude Desktop, Cursor, Grok-compatible MCP hosts, local agents",
        "command": "python -m mcp_server.server",
    },
    {
        "id": "cli",
        "name": "Command line operator",
        "audience": "local demos, dev loops, operator scripts",
        "command": "cybersecurity-ai platform",
    },
    {
        "id": "http-demo-api",
        "name": "Local HTTP demo API",
        "audience": "browser demos, local dashboards, platform pilots",
        "command": "cybersecurity-ai-http --port 8767",
    },
    {
        "id": "chimeria-bridge",
        "name": "Protected CHIMERIA bridge",
        "audience": "private trunk integration and approved manifest consumption",
        "command": "export CHIMERIA_BRIDGE_MANIFEST=/secure/path/public_bridge_manifest.json",
    },
)

USE_CASES = (
    {
        "id": "career-intelligence",
        "name": "Cybersecurity Career Intelligence",
        "summary": "Map roles, teams, stages, skills, platforms, and safe work outputs.",
        "buyers": ("training providers", "security leaders", "AI builders"),
    },
    {
        "id": "soc-readiness",
        "name": "SOC Readiness Mapping",
        "summary": "Translate SOC responsibilities into role packets, onboarding paths, and assistant workflows.",
        "buyers": ("managed security providers", "enterprise SOC teams", "bootcamps"),
    },
    {
        "id": "grc-control-literacy",
        "name": "GRC Control Literacy",
        "summary": "Explain defensive control ownership, evidence flows, and compliance roles without claiming certification.",
        "buyers": ("GRC teams", "founders", "platform vendors"),
    },
    {
        "id": "ai-native-security-enablement",
        "name": "AI-native Security Enablement",
        "summary": "Give MCP clients a safe cybersecurity vocabulary and workflow map.",
        "buyers": ("AI product teams", "developer tooling teams", "internal platform teams"),
    },
)


def platform_summary() -> dict:
    return {
        "project": "CyberSecurity-AI",
        "version": PLATFORM_VERSION,
        "positioning": "Public-safe cybersecurity intelligence platform for MCP clients, CLI demos, local HTTP surfaces, and CHIMERIA-approved private bridge packets.",
        "private_trunk_exposed": False,
        "career_seed_count": len(list_careers()),
        "surfaces": list(PLATFORM_SURFACES),
        "use_cases": list(USE_CASES),
        "bridge": bridge_status(),
        "boundary": boundary_packet(),
    }


def architecture_map() -> dict:
    return {
        "planes": {
            "client": ["Claude Desktop", "Cursor", "Grok-compatible MCP host", "browser/local dashboard", "terminal"],
            "interface": ["MCP stdio", "CLI", "HTTP demo API"],
            "intelligence": ["career taxonomy", "platform routes", "policy boundary", "safe packet generator"],
            "bridge": ["approved CHIMERIA manifest", "approved fields only", "private_trunk_exposed=false"],
            "proof": ["pytest contract tests", "MCP smoke test", "claim boundary docs", "release PR"],
        },
        "flows": [
            "client -> MCP/CLI/HTTP -> policy check -> career/platform packet -> optional CHIMERIA bridge status",
            "private CHIMERIA trunk -> approved public manifest -> CyberSecurity-AI bridge adapter -> public-safe output",
        ],
    }


def platform_routes() -> dict:
    return {
        "routes": {
            "/health": "service health, version, boundary status",
            "/platform": "platform summary packet",
            "/careers": "public-safe career list",
            "/search?q=...": "career and capability search",
            "/bridge": "CHIMERIA approved-manifest bridge status",
            "/architecture": "architecture and flow map",
        },
        "mcp_tools": [
            "career_list",
            "career_get",
            "career_search",
            "career_invoke",
            "career_triple_route",
            "chimeria_bridge_status",
            "chimeria_route",
            "platform_summary",
            "platform_routes",
            "architecture_map",
            "policy_check",
        ],
    }


def market_packet(audience: str = "platform buyers") -> dict:
    decision = check_text(audience)
    return {
        "audience": audience,
        "policy": decision.to_dict(),
        "headline": "Cybersecurity intelligence for every MCP host.",
        "one_liner": "CyberSecurity-AI turns cybersecurity roles, skills, and defensive workflows into live AI tools.",
        "platforms": [surface["audience"] for surface in PLATFORM_SURFACES],
        "safe_pitches": [
            "Launch a defensive cybersecurity MCP in minutes.",
            "Map SOC, IR, GRC, IAM, cloud security, and threat-intel roles into AI-ready packets.",
            "Connect approved private CHIMERIA context without exposing the private trunk.",
        ],
    }


def search_packet(query: str) -> dict:
    decision = check_text(query)
    if not decision.allowed:
        return {"policy": decision.to_dict(), "results": []}
    return {"policy": decision.to_dict(), "results": search_careers(query)}
