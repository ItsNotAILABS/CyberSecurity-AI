# MCP Client Setup

## Install

```bash
git clone https://github.com/ItsNotAILABS/CyberSecurity-AI.git
cd CyberSecurity-AI
python -m pip install -e .
```

## Universal stdio command

```bash
python -m mcp_server.server
```

or, after editable install:

```bash
cybersecurity-ai-mcp
```

## MCP configuration

```json
{
  "mcpServers": {
    "cybersecurity-ai": {
      "command": "python",
      "args": ["-m", "mcp_server.server"],
      "cwd": "/absolute/path/to/CyberSecurity-AI",
      "env": {
        "MESIE_CAREER_PILLAR": "cybersecurity"
      }
    }
  }
}
```

## Optional CHIMERIA private bridge

CyberSecurity-AI does not expose the CHIMERIA trunk. To connect approved private context, export a public-safe bridge manifest from the private Chimeria repo and set one of:

```bash
export CHIMERIA_BRIDGE_MANIFEST=/secure/path/public_bridge_manifest.json
```

or:

```bash
export CHIMERIA_BRIDGE_DIR=/secure/path/chimeria-bridge
```

The adapter only reads approved fields and always reports `private_trunk_exposed=false`.

## Smoke test by hand

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n' | python -m mcp_server.server
```

## Python tests

```bash
python -m pip install -e .
python -m pytest -q
```
