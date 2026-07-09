"""CyberSecurity-AI MCP stdio server."""

from __future__ import annotations

import json
import sys
from typing import Any, Callable

from .capabilities import capability_matrix
from .careers import get_career, list_careers, search_careers
from .chimeria_bridge import bridge_status, route_packet
from .platform import architecture_map, demo_packet, market_packet, platform_routes, platform_summary
from .policy import check_text
from .use_cases import get_use_case, list_use_cases

SERVER_NAME = "cybersecurity-ai"
SERVER_VERSION = "1.3.0"


def _tool(name: str, description: str, schema: dict[str, Any]) -> dict[str, Any]:
    return {"name": name, "description": description, "inputSchema": schema}


def tools() -> list[dict[str, Any]]:
    empty = {"type": "object", "properties": {}, "additionalProperties": False}
    return [
        _tool("career_list", "List public-safe cybersecurity careers by optional team or stage.", {"type": "object", "properties": {"team": {"type": "string"}, "stage": {"type": "string"}}, "additionalProperties": False}),
        _tool("career_get", "Get one public-safe compressed career profile by id.", {"type": "object", "required": ["id"], "properties": {"id": {"type": "string"}}, "additionalProperties": False}),
        _tool("career_search", "Search public-safe cybersecurity careers and capability categories.", {"type": "object", "required": ["query"], "properties": {"query": {"type": "string"}}, "additionalProperties": False}),
        _tool("career_invoke", "Create a defensive career intelligence packet for a safe platform use case.", {"type": "object", "required": ["intent"], "properties": {"intent": {"type": "string"}, "career_id": {"type": "string"}, "platform": {"type": "string"}}, "additionalProperties": False}),
        _tool("career_triple_route", "Return the MESIE P1/P2/P3 route map and CHIMERIA private-bridge status.", empty),
        _tool("chimeria_bridge_status", "Check whether an approved private CHIMERIA bridge manifest is available.", empty),
        _tool("chimeria_route", "Route a public-safe intent packet toward the private CHIMERIA bridge manifest boundary.", {"type": "object", "required": ["intent"], "properties": {"intent": {"type": "string"}, "payload": {"type": "object"}}, "additionalProperties": False}),
        _tool("platform_summary", "Return the full CyberSecurity-AI platform packet for demos, pilots, and marketing.", empty),
        _tool("platform_routes", "Return MCP, HTTP, CLI, dashboard, and bridge route inventory.", empty),
        _tool("architecture_map", "Return platform architecture planes and data flows.", empty),
        _tool("market_packet", "Create a market-safe positioning packet for an audience.", {"type": "object", "properties": {"audience": {"type": "string"}}, "additionalProperties": False}),
        _tool("policy_check", "Check a phrase against the public CyberSecurity-AI boundary.", {"type": "object", "required": ["text"], "properties": {"text": {"type": "string"}}, "additionalProperties": False}),
        _tool("use_case_list", "List real buyer use cases with workflows, outputs, and MCP tools.", {"type": "object", "properties": {"buyer": {"type": "string"}}, "additionalProperties": False}),
        _tool("use_case_get", "Get one real buyer use-case packet by id.", {"type": "object", "required": ["id"], "properties": {"id": {"type": "string"}}, "additionalProperties": False}),
        _tool("capability_matrix", "Return defensive cybersecurity capability domains, outputs, and maturity levels.", empty),
        _tool("demo_packet", "Return a polished demo packet for a specific use case.", {"type": "object", "properties": {"use_case_id": {"type": "string"}}, "additionalProperties": False}),
    ]


def _content(payload: Any) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": json.dumps(payload, indent=2, sort_keys=True)}]}


def call_tool(name: str, args: dict[str, Any] | None = None) -> dict[str, Any]:
    args = args or {}
    handlers: dict[str, Callable[[dict[str, Any]], Any]] = {
        "career_list": lambda a: list_careers(team=a.get("team"), stage=a.get("stage")),
        "career_get": lambda a: get_career(str(a.get("id", ""))) or {"error": "career_not_found", "id": a.get("id")},
        "career_search": lambda a: search_careers(str(a.get("query", ""))),
        "career_invoke": career_invoke,
        "career_triple_route": lambda a: triple_route(),
        "chimeria_bridge_status": lambda a: bridge_status(),
        "chimeria_route": lambda a: route_packet(str(a.get("intent", "")), a.get("payload") if isinstance(a.get("payload"), dict) else {}),
        "platform_summary": lambda a: platform_summary(),
        "platform_routes": lambda a: platform_routes(),
        "architecture_map": lambda a: architecture_map(),
        "market_packet": lambda a: market_packet(str(a.get("audience", "platform buyers"))),
        "policy_check": lambda a: check_text(str(a.get("text", ""))).to_dict(),
        "use_case_list": lambda a: list_use_cases(buyer=a.get("buyer")),
        "use_case_get": lambda a: get_use_case(str(a.get("id", ""))) or {"error": "use_case_not_found", "id": a.get("id")},
        "capability_matrix": lambda a: capability_matrix(),
        "demo_packet": lambda a: demo_packet(str(a.get("use_case_id", "soc-onboarding-copilot"))),
    }
    if name not in handlers:
        return _content({"error": "unknown_tool", "name": name})
    return _content(handlers[name](args))


def career_invoke(args: dict[str, Any]) -> dict[str, Any]:
    intent = str(args.get("intent", ""))
    decision = check_text(intent)
    if not decision.allowed:
        return {"policy": decision.to_dict(), "career": None, "safe_use_only": True}
    career_id = str(args.get("career_id", "")).strip()
    career = get_career(career_id) if career_id else None
    return {
        "intent": intent,
        "platform": args.get("platform", "generic-mcp-host"),
        "career": career,
        "safe_use_only": True,
        "policy": decision.to_dict(),
        "blocked_scope": ["exploit instructions", "malware or persistence workflows", "unauthorized access guidance", "private CHIMERIA trunk internals"],
        "bridge": route_packet("career-intelligence", {"career_id": career_id, "intent": intent}),
    }


def triple_route() -> dict[str, Any]:
    return {
        "protocol": "MESIE-CAREER-TRIPLE-PROTOCOL/1.3",
        "p1_loom": "career taxonomy, use-case catalog, platform memory, and market-safe role intelligence",
        "p2_mcp": "stdio MCP tools exposed by this package",
        "p3_bridge": "optional approved CHIMERIA public manifest bridge",
        "http_hub_default": "http://127.0.0.1:8767",
        "private_trunk_exposed": False,
        "platform": platform_summary(),
        "chimeria": bridge_status(),
    }


def response(req: dict[str, Any]) -> dict[str, Any]:
    method = req.get("method")
    req_id = req.get("id")
    params = req.get("params") if isinstance(req.get("params"), dict) else {}
    if method == "initialize":
        result = {"protocolVersion": "2024-11-05", "serverInfo": {"name": SERVER_NAME, "version": SERVER_VERSION}, "capabilities": {"tools": {}}}
    elif method == "tools/list":
        result = {"tools": tools()}
    elif method == "tools/call":
        result = call_tool(str(params.get("name", "")), params.get("arguments") if isinstance(params.get("arguments"), dict) else {})
    else:
        return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"Method not found: {method}"}}
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


def main() -> int:
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            out = response(req if isinstance(req, dict) else {})
        except Exception as exc:
            out = {"jsonrpc": "2.0", "id": None, "error": {"code": -32000, "message": str(exc)}}
        sys.stdout.write(json.dumps(out, separators=(",", ":")) + "\n")
        sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
