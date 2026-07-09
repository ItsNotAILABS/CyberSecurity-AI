"""Local HTTP demo API for CyberSecurity-AI.

This is dependency-free and intentionally local-first. It is for demos,
local dashboards, platform pilots, and browser testing. It does not claim
external deployment.
"""

from __future__ import annotations

import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from .careers import list_careers
from .chimeria_bridge import bridge_status
from .platform import architecture_map, platform_routes, platform_summary, search_packet
from .policy import boundary_packet


def _json_bytes(payload: dict | list) -> bytes:
    return json.dumps(payload, indent=2, sort_keys=True).encode("utf-8")


class CyberSecurityAIHandler(BaseHTTPRequestHandler):
    server_version = "CyberSecurityAIHTTP/1.2"

    def do_GET(self) -> None:  # noqa: N802 - stdlib hook
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)
        path = parsed.path.rstrip("/") or "/"

        if path == "/":
            payload = {
                "service": "CyberSecurity-AI",
                "docs": ["/health", "/platform", "/careers", "/search?q=iam", "/bridge", "/architecture", "/routes"],
                "private_trunk_exposed": False,
            }
        elif path == "/health":
            payload = {"ok": True, "service": "CyberSecurity-AI", "private_trunk_exposed": False, "boundary": boundary_packet()}
        elif path == "/platform":
            payload = platform_summary()
        elif path == "/careers":
            payload = {"careers": list_careers()}
        elif path == "/search":
            payload = search_packet(query.get("q", [""])[0])
        elif path == "/bridge":
            payload = bridge_status()
        elif path == "/architecture":
            payload = architecture_map()
        elif path == "/routes":
            payload = platform_routes()
        else:
            self._send({"error": "not_found", "path": path}, status=404)
            return
        self._send(payload)

    def log_message(self, format: str, *args: object) -> None:  # noqa: A002 - stdlib signature
        return

    def _send(self, payload: dict | list, status: int = 200) -> None:
        body = _json_bytes(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run CyberSecurity-AI local HTTP demo API.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8767, type=int)
    args = parser.parse_args(argv)
    server = ThreadingHTTPServer((args.host, args.port), CyberSecurityAIHandler)
    print(f"CyberSecurity-AI HTTP demo API running at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
