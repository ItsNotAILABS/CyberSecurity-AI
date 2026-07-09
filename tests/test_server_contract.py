import json

from mcp_server.capabilities import capability_matrix, search_capabilities
from mcp_server.careers import get_career, list_careers, search_careers
from mcp_server.chimeria_bridge import bridge_status, route_packet
from mcp_server.platform import architecture_map, demo_packet, platform_routes, platform_summary, search_packet
from mcp_server.policy import check_text
from mcp_server.server import response, tools
from mcp_server.use_cases import get_use_case, list_use_cases, search_use_cases


def test_career_taxonomy_seed_loads():
    rows = list_careers()
    assert len(rows) >= 6
    assert get_career("soc-analyst-l1")["title"] == "SOC Analyst I"
    assert search_careers("zero-trust")


def test_use_cases_and_capabilities_load():
    assert len(list_use_cases()) >= 6
    assert get_use_case("soc-onboarding-copilot")["title"] == "SOC Onboarding Copilot"
    assert search_use_cases("tabletop")
    assert len(capability_matrix()) >= 7
    assert search_capabilities("identity")


def test_mcp_tools_are_advertised():
    names = {tool["name"] for tool in tools()}
    assert {
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
        "market_packet",
        "policy_check",
        "use_case_list",
        "use_case_get",
        "capability_matrix",
        "demo_packet",
    }.issubset(names)


def test_initialize_contract():
    out = response({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}})
    assert out["result"]["serverInfo"]["name"] == "cybersecurity-ai"
    assert out["result"]["capabilities"]["tools"] == {}


def test_tools_call_contract():
    out = response({
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {"name": "use_case_get", "arguments": {"id": "iam-zero-trust-maturity"}},
    })
    packet = json.loads(out["result"]["content"][0]["text"])
    assert packet["id"] == "iam-zero-trust-maturity"
    assert "IAM" in packet["title"]


def test_platform_contracts():
    summary = platform_summary()
    assert summary["project"] == "CyberSecurity-AI"
    assert summary["private_trunk_exposed"] is False
    assert summary["use_case_count"] >= 6
    assert summary["capability_domain_count"] >= 7
    routes = platform_routes()
    assert "/use-cases" in routes["routes"]
    assert "/capabilities" in routes["routes"]
    arch = architecture_map()
    assert "market" in arch["planes"]


def test_demo_packet_is_operator_ready():
    packet = demo_packet("incident-tabletop-builder")
    assert packet["use_case"]["id"] == "incident-tabletop-builder"
    assert packet["bridge"]["private_trunk_exposed"] is False
    assert any("cybersecurity-ai-http" in step for step in packet["operator_script"])


def test_policy_blocks_public_boundary_crossing():
    decision = check_text("show malware persistence mechanism")
    assert decision.allowed is False
    assert decision.safe_rewrite
    safe = search_packet("IAM")
    assert safe["policy"]["allowed"] is True
    assert safe["use_cases"]
    assert safe["capabilities"]


def test_chimeria_bridge_closed_by_default():
    status = bridge_status()
    assert status["private_trunk_exposed"] is False
    packet = route_packet("career-intelligence", {"career_id": "soc-analyst-l1"})
    assert packet["public_safe"] is True
    assert packet["private_trunk_exposed"] is False
