"""CyberSecurity-AI command-line operator."""

from __future__ import annotations

import argparse
import json

from .careers import get_career, list_careers
from .chimeria_bridge import bridge_status
from .platform import architecture_map, market_packet, platform_routes, platform_summary, search_packet
from .policy import check_text


def emit(payload: object) -> None:
    print(json.dumps(payload, indent=2, sort_keys=True))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="cybersecurity-ai", description="CyberSecurity-AI platform CLI")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("platform", help="Print platform summary")
    sub.add_parser("routes", help="Print MCP and HTTP route map")
    sub.add_parser("architecture", help="Print architecture map")
    sub.add_parser("bridge", help="Print CHIMERIA bridge status")

    p_list = sub.add_parser("careers", help="List careers")
    p_list.add_argument("--team", default=None)
    p_list.add_argument("--stage", default=None)

    p_get = sub.add_parser("career", help="Get one career")
    p_get.add_argument("id")

    p_search = sub.add_parser("search", help="Search careers safely")
    p_search.add_argument("query")

    p_market = sub.add_parser("market", help="Generate market packet")
    p_market.add_argument("--audience", default="platform buyers")

    p_policy = sub.add_parser("policy", help="Check text against public-safe policy")
    p_policy.add_argument("text")

    args = parser.parse_args(argv)
    if args.cmd == "platform" or args.cmd is None:
        emit(platform_summary())
    elif args.cmd == "routes":
        emit(platform_routes())
    elif args.cmd == "architecture":
        emit(architecture_map())
    elif args.cmd == "bridge":
        emit(bridge_status())
    elif args.cmd == "careers":
        emit({"careers": list_careers(team=args.team, stage=args.stage)})
    elif args.cmd == "career":
        emit(get_career(args.id) or {"error": "career_not_found", "id": args.id})
    elif args.cmd == "search":
        emit(search_packet(args.query))
    elif args.cmd == "market":
        emit(market_packet(args.audience))
    elif args.cmd == "policy":
        emit(check_text(args.text).to_dict())
    else:
        parser.print_help()
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
