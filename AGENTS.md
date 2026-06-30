## Environment and tooling

### NOVA Sovereign Build CLI (Primary)
NOVA uses its own sovereign build CLI — `scripts/nova` — which drives `moc`
(the Motoko compiler) directly without requiring the DFX daemon.

**Manifest:** `nova.json` (sovereign project config)

Typical local validation flow:
- `./scripts/nova check`
- `./scripts/nova build`

## Testing expectations
- For Motoko changes, run `./scripts/nova check` (type-check, fast, no daemon needed).
- For full WASM build, run `./scripts/nova build`.
- For frontend changes, run `npm run build` and relevant tests (`npm run test:run`).
- If a full test pass is too expensive, run the most relevant subset and state what was validated.

## Repository map
- `src/frontend/` - Web UI (Vite/React)
- `tests/motoko/` - Motoko test suites and runner
- `.github/workflows/` - CI workflows
- `scripts/nova` - **Sovereign build CLI** (replaces DFX for local dev)
- `nova.json` - Sovereign canister manifest
- `dfx.json` - Legacy DFX config (kept for IC deployment compatibility)
