"""CyberSecurity-AI platform layer.

This module turns the repo from a single MCP server into a platform surface:
MCP tools, CLI packets, HTTP endpoints, market-ready positioning, real buyer
use cases, capability matrices, and the protected CHIMERIA bridge all read from
the same platform contract.
"""

from __future__ import annotations

from .capabilities import capability_matrix, search_capabilities
from .careers import list_careers, search_careers
from .chimeria_bridge import bridge_status
from .policy import boundary_packet, check_text
from .use_cases import get_use_case, list_use_cases, search_use_cases

PLATFORM_VERSION = "1.3.0"

PLATFORM_SURFACES = (
    {"id": "mcp-stdio", "name": "MCP stdio server", "audience": "Claude Desktop, Cursor, Grok-compatible MCP hosts, local agents", "command": "python -m mcp_server.server"},
    {"id": "cli", "name": "Command line operator", "audience": "local demos, dev loops, operator scripts", "command": "cybersecurity-ai platform"},
    {"id": "http-demo-api", "name": "Local HTTP demo API", "audience": "browser demos, local dashboards, platform pilots", "command": "cybersecurity-ai-http --port 8767"},
    {"id": "browser-dashboard", "name": "Static browser dashboard", "audience": "screenshots, sales demos, local platform exploration", "command": "open dashboard/index.html"},
    {"id": "chimeria-bridge", "name": "Protected CHIMERIA bridge", "audience": "private trunk integration and approved manifest consumption", "command": "export CHIMERIA_BRIDGE_MANIFEST=/secure/path/public_bridge_manifest.json"},
)


def platform_summary() -> dict:
    use_cases = list_use_cases()
    capabilities = capability_matrix()
    return {
        "project": "CyberSecurity-AI",
        "version": PLATFORM_VERSION,
        "positioning": "Public-safe cybersecurity intelligence platform for MCP clients, CLI demos, local HTTP surfaces, browser demos, and CHIMERIA-approved private bridge packets.",
        "private_trunk_exposed": False,
        "career_seed_count": len(list_careers()),
        "use_case_count": len(use_cases),
        "capability_domain_count": len(capabilities),
        "surfaces": list(PLATFORM_SURFACES),
        "use_cases": use_cases,
        "capability_matrix": capabilities,
        "bridge": bridge_status(),
        "boundary": boundary_packet(),
    }


def architecture_map() -> dict:
    return {
        "planes": {
            "client": ["Claude Desktop", "Cursor", "Grok-compatible MCP host", "browser/local dashboard", "terminal", "internal product pilot"],
            "interface": ["MCP stdio", "CLI", "HTTP demo API", "static dashboard"],
            "intelligence": ["career taxonomy", "use-case catalog", "capability matrix", "platform routes", "policy boundary", "safe packet generator"],
            "bridge": ["approved CHIMERIA manifest", "approved fields only", "private_trunk_exposed=false", "no trunk import"],
            "proof": ["pytest contract tests", "MCP smoke test", "GitHub Actions", "schemas", "claim boundary docs", "release PR"],
            "market": ["buyer packets", "demo scripts", "screenshots", "MCP client setup", "local API docs"],
        },
        "flows": [
            "client -> MCP/CLI/HTTP/dashboard -> policy check -> career/use-case/capability packet -> optional CHIMERIA bridge status",
            "private CHIMERIA trunk -> approved manifest export -> CyberSecurity-AI bridge adapter -> public-safe output",
            "buyer problem -> use-case packet -> workflow outputs -> MCP tools -> demo proof",
        ],
    }


def platform_routes() -> dict:
    return {
        "routes": {
            "/health": "service health, version, boundary status",
            "/platform": "platform summary packet",
            "/careers": "public-safe career list",
            "/use-cases": "real buyer use-case catalog",
            "/capabilities": "capability matrix by security domain",
            "/search?q=...": "career, use-case, and capability search",
            "/bridge": "CHIMERIA approved-manifest bridge status",
            "/architecture": "architecture and flow map",
        },
        "mcp_tools": [
            "career_list", "career_get", "career_search", "career_invoke", "career_triple_route",
            "chimeria_bridge_status", "chimeria_route", "platform_summary", "platform_routes",
            "architecture_map", "market_packet", "policy_check", "use_case_list", "use_case_get",
            "capability_matrix", "demo_packet",
        ],
        "cli_commands": ["platform", "routes", "architecture", "bridge", "careers", "career", "search", "market", "policy"],
    }


def market_packet(audience: str = "platform buyers") -> dict:
    decision = check_text(audience)
    return {
        "audience": audience,
        "policy": decision.to_dict(),
        "headline": "Cybersecurity intelligence for every MCP host.",
        "one_liner": "CyberSecurity-AI turns cybersecurity roles, skills, use cases, and defensive workflows into live AI tools.",
        "platforms": [surface["audience"] for surface in PLATFORM_SURFACES],
        "safe_pitches": [
            "Launch a defensive cybersecurity MCP in minutes.",
            "Map SOC, IR, GRC, IAM, cloud security, and threat-intel roles into AI-ready packets.",
            "Turn buyer problems into demo-ready security workflows.",
            "Connect approved private CHIMERIA context without exposing the private trunk.",
        ],
        "demo_use_cases": [u["id"] for u in list_use_cases()],
    }


def search_packet(query: str) -> dict:
    decision = check_text(query)
    if not decision.allowed:
        return {"policy": decision.to_dict(), "careers": [], "use_cases": [], "capabilities": []}
    return {
        "policy": decision.to_dict(),
        "careers": search_careers(query),
        "use_cases": search_use_cases(query),
        "capabilities": search_capabilities(query),
    }


def demo_packet(use_case_id: str = "soc-onboarding-copilot") -> dict:
    use_case = get_use_case(use_case_id) or get_use_case("soc-onboarding-copilot")
    return {
        "demo_id": use_case_id,
        "use_case": use_case,
        "platform": {"version": PLATFORM_VERSION, "surfaces": list(PLATFORM_SURFACES)},
        "bridge": bridge_status(),
        "boundary": boundary_packet(),
        "operator_script": [
            "python -m pip install -e .",
            "cybersecurity-ai platform",
            f"cybersecurity-ai market --audience '{use_case['buyer'] if use_case else 'security buyers'}'",
            "cybersecurity-ai-http --host 127.0.0.1 --port 8767",
            "open http://127.0.0.1:8767/platform",
        ],
    }
