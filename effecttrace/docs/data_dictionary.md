# EffectTrace Data Dictionary

## ProposalRecord

| Field | Type | Description |
|---|---|---|
| proposalId | Text | Unique identifier. Format: `{daoType}:{proposalNumber}` |
| daoType | DaoType | NNS, SNS, or Unknown |
| title | Text | Proposal title |
| summary | Text | Proposal summary (claim only until verified) |
| status | ProposalStatus | Open, Adopted, Rejected, Executed, Failed, Unknown |
| sourceLinks | SourceLink[] | Evidence/source links |
| updatedAt | Int | Last update timestamp (nanoseconds) |

## EffectTraceRecord

| Field | Type | Description |
|---|---|---|
| traceId | Text | Unique trace ID. Format: `trace:{proposalId}:{timestamp}:{counter}` |
| proposalId | Text | Reference to ProposalRecord |
| publicTitle | Text | Human-readable trace title |
| plainSummary | Text | Plain-language summary |
| effectPath | EffectPath | Structured effect path |
| runtimeTruth | RuntimeTruthBlock | Runtime truth verification state |
| riskProfile | RiskProfile | Risk classification and scores |
| verificationPlan | VerificationPlan | Verification steps |
| status | Text | draft, needs_review, community_reviewed, execution_pending, post_execution_checked, disputed, archived |
| confidence | Text | low, medium, high |

## RuntimeTruthStatus Values

| Value | Meaning |
|---|---|
| ClaimOnly | Proposal text only — no payload or execution evidence |
| PayloadIdentified | On-chain payload has been identified |
| ReviewSupported | Human reviewer has confirmed the claim |
| ExecutionPending | Proposal adopted, execution not yet observed |
| ExecutedNotVerified | Execution observed but after-state not verified |
| VerifiedAfterState | After-state verified with evidence |
| Disputed | Claim or trace content is disputed |
| Unknown | Truth status cannot be determined |

## RiskClass Values

Motion, Informational, ParameterChange, CodeUpgrade, TreasuryAction, GovernanceRuleChange, CanisterControlChange, FrontendAssetChange, RegistryOrNetworkChange, CustomGenericFunction, SystemicOrEmergency, Unknown

## AgentFinding Severity

| Value | Meaning |
|---|---|
| info | Informational note |
| watch | Item to monitor |
| warning | Potential issue requiring attention |
| critical | High-severity issue requiring immediate review |

## AgentFinding Status

draft → reviewed → disputed / retracted
