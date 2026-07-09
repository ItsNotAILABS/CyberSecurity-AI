"""Protected CHIMERIA bridge adapter.

CyberSecurity-AI is market-facing. CHIMERIA is the private trunk. This module
lets CyberSecurity-AI consume approved CHIMERIA packets without exposing private
implementation details.

Supported sources:
- CHIMERIA_BRIDGE_MANIFEST: path to an approved JSON manifest exported from the
  private CHIMERIA repo.
- CHIMERIA_BRIDGE_DIR: directory containing public_bridge_manifest.json.

If no approved packet is present, the adapter returns a closed, public-safe
status instead of failing or inventing private state.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

APPROVED_FIELDS = {
    "project",
    "version",
    "status",
    "public_summary",
    "approved_capabilities",
    "approved_products",
    "approved_controls",
    "release_boundary",
    "evidence_level",
    "generated_at",
}

DEFAULT_BOUNDARY = (
    "CHIMERIA is a private trunk. CyberSecurity-AI may only consume approved "
    "public-safe bridge manifests. Private code, doctrine internals, controls, "
    "and implementation details are not exposed through this package."
)


def _load_json(path: Path) -> dict[str, Any] | None:
    try:
        if path.exists() and path.is_file():
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
    except Exception as exc:  # defensive: bridge must not break public MCP
        return {"bridge_error": str(exc)}
    return None


def find_manifest() -> tuple[dict[str, Any] | None, str | None]:
    explicit = os.getenv("CHIMERIA_BRIDGE_MANIFEST")
    if explicit:
        data = _load_json(Path(explicit))
        if data is not None:
            return data, explicit

    bridge_dir = os.getenv("CHIMERIA_BRIDGE_DIR")
    if bridge_dir:
        path = Path(bridge_dir) / "public_bridge_manifest.json"
        data = _load_json(path)
        if data is not None:
            return data, str(path)

    return None, None


def sanitize_manifest(data: dict[str, Any]) -> dict[str, Any]:
    safe = {key: data.get(key) for key in APPROVED_FIELDS if key in data}
    safe.setdefault("release_boundary", DEFAULT_BOUNDARY)
    safe.setdefault("evidence_level", "approved-public-packet-required")
    safe["private_trunk_exposed"] = False
    return safe


def bridge_status() -> dict[str, Any]:
    data, source = find_manifest()
    if data is None:
        return {
            "connected": False,
            "private_trunk_exposed": False,
            "source": None,
            "release_boundary": DEFAULT_BOUNDARY,
            "next_step": "Export an approved CHIMERIA public_bridge_manifest.json and set CHIMERIA_BRIDGE_MANIFEST or CHIMERIA_BRIDGE_DIR.",
        }
    safe = sanitize_manifest(data)
    safe["connected"] = True
    safe["source"] = source
    return safe


def route_packet(intent: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    payload = payload or {}
    status = bridge_status()
    return {
        "route": "cybersecurity-ai-to-chimeria",
        "intent": intent,
        "accepted": bool(status.get("connected")),
        "public_safe": True,
        "private_trunk_exposed": False,
        "bridge_status": status,
        "payload_summary": {
            "keys": sorted(payload.keys()),
            "item_count": len(payload),
        },
    }
