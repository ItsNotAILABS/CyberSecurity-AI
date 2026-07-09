import json

from mcp_server.careers import get_career, list_careers, search_careers
from mcp_server.chimeria_bridge import bridge_status, route_packet
from mcp_server.server import response, tools


def test_career_taxonomy_seed_loads():
    rows = list_careers()
    assert len(rows) >= 6
    assert get_career("soc-analyst-l1")["title"] == "SOC Analyst I"
    assert search_careers("zero-trust")


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
        "params": {"name": "career_get", "arguments": {"id": "iam-engineer"}},
    })
    packet = json.loads(out["result"]["content"][0]["text"])
    assert packet["id"] == "iam-engineer"
    assert "Identity" in packet["team"]


def test_chimeria_bridge_closed_by_default():
    status = bridge_status()
    assert status["private_trunk_exposed"] is False
    packet = route_packet("career-intelligence", {"career_id": "soc-analyst-l1"})
    assert packet["public_safe"] is True
    assert packet["private_trunk_exposed"] is False
