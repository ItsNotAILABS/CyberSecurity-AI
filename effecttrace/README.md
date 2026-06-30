# EffectTrace

**Trace what governance proposals actually change.**

EffectTrace is the governance consequence substrate for the NATIVE NOVA PROTOCOL. It provides canister-backed storage and structured rendering of proposal effect paths, runtime truth status, risk profiles, verification plans, evidence links, agent findings, and revision history.

## Pass 1 Status: Built

Backend canister: `src/organisms/effecttrace/main.mo`  
Frontend: `src/frontend/src/pages/et/` (routes under `/et/`)

## Running Locally

```bash
# Check Motoko compilation
./scripts/nova check

# Build frontend
cd src/frontend && npm run build

# Serve frontend dev
cd src/frontend && npm run dev
```

Then open `http://localhost:5173/et` in your browser.

## First Demo

1. Navigate to `/et`
2. Click "Create Proposal Record"
3. Enter a proposal ID (e.g., `NNS:12345`), title, summary, DAO type
4. Submit → redirected to proposal detail
5. Click "Add Trace"
6. Fill in effect path, risk class, runtime truth status, verification plan
7. Submit → redirected to trace detail
8. View Trace Detail — see all structured fields
9. Click "Export Markdown" — see forum-ready Markdown from backend data
10. Check "Governance Pulse" — counts update from real stored data

## Guardrails

EffectTrace does not recommend adopt/reject. It is a structured effect record. Human verification required.

EffectTrace is not an official DFINITY tool and does not replace human governance review.

## Docs

- `effecttrace/docs/pass_1_substrate_build_packet.md` — Pass 1 build specification
- `effecttrace/docs/public_language_guardrails.md` — Public language rules
- `effecttrace/docs/data_dictionary.md` — Type and field definitions

## Pass 2

Pass 2 adds NNS/SNS proposal URL parsing, metadata ingestion, and draft effect path generation. Pass 2 begins only after Pass 1 substrate is stable.
