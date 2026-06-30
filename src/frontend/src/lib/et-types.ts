/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

export type DaoType = 'NNS' | 'SNS' | 'Unknown';
export type ProposalStatus = 'Open' | 'Adopted' | 'Rejected' | 'Executed' | 'Failed' | 'Unknown';
export type RiskClass = 'Motion' | 'Informational' | 'ParameterChange' | 'CodeUpgrade' | 'TreasuryAction' | 'GovernanceRuleChange' | 'CanisterControlChange' | 'FrontendAssetChange' | 'RegistryOrNetworkChange' | 'CustomGenericFunction' | 'SystemicOrEmergency' | 'Unknown';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';
export type RuntimeTruthStatus = 'ClaimOnly' | 'PayloadIdentified' | 'ReviewSupported' | 'ExecutionPending' | 'ExecutedNotVerified' | 'VerifiedAfterState' | 'Disputed' | 'Unknown';
export type AffectedSystem = 'NNS' | 'SNS' | 'SNSDappCanister' | 'ProtocolCanister' | 'Registry' | 'LedgerOrTreasury' | 'FrontendAssetCanister' | 'GovernanceRule' | 'CustomGenericFunction' | 'Unknown';
export type EvidenceType = 'Proposal' | 'ForumThread' | 'Documentation' | 'Github' | 'Dashboard' | 'ReviewerNote' | 'CanisterQuery' | 'WasmHash' | 'TreasuryRecord' | 'RegistryRecord' | 'ManualNote' | 'Other';

export interface SourceLink {
  id: string;
  linkLabel: string;
  url?: string;
  evidenceType: EvidenceType;
  note?: string;
  addedAt: number;
}

export interface ProposalRecord {
  proposalId: string;
  daoType: DaoType;
  title: string;
  summary: string;
  url?: string;
  topic?: string;
  proposalType?: string;
  status: ProposalStatus;
  sourceLinks: SourceLink[];
  updatedAt: number;
}

export interface EffectPath {
  claim: string;
  affectedSystem: AffectedSystem;
  targetCanisterId?: string;
  targetMethod?: string;
  affectedState: string;
  expectedAfterState: string;
  executionTrigger: string;
  unknowns: string[];
}

export interface RuntimeTruthBlock {
  claimObserved: boolean;
  payloadObserved: boolean;
  targetIdentified: boolean;
  reviewerConfirmed: boolean;
  executionObserved: boolean;
  afterStateVerified: boolean;
  truthStatus: RuntimeTruthStatus;
  unresolvedQuestions: string[];
}

export interface RiskScores {
  technical: number;
  treasury: number;
  governance: number;
  irreversibility: number;
  verificationDifficulty: number;
  precedentWeight: number;
}

export interface RiskProfile {
  riskClass: RiskClass;
  riskLevel: RiskLevel;
  scores: RiskScores;
  explanation: string;
  openRiskQuestions: string[];
}

export interface VerificationStep {
  id: string;
  stepLabel: string;
  description: string;
  evidenceType: EvidenceType;
  completed: boolean;
  resultNote?: string;
}

export interface VerificationPlan {
  summary: string;
  steps: VerificationStep[];
  status: string;
}

export interface GovernanceMemoryLink {
  id: string;
  relatedProposalId?: string;
  relationType: string;
  description: string;
  sourceLinks: SourceLink[];
  createdAt: number;
}

export interface AgentFinding {
  findingId: string;
  proposalId: string;
  traceId?: string;
  agent: string;
  finding: string;
  severity: string;
  evidence: SourceLink[];
  status: string;
  createdAt: number;
  updatedAt: number;
}

export interface EffectTraceRecord {
  traceId: string;
  proposalId: string;
  publicTitle: string;
  plainSummary: string;
  effectPath: EffectPath;
  runtimeTruth: RuntimeTruthBlock;
  riskProfile: RiskProfile;
  verificationPlan: VerificationPlan;
  memoryLinks: GovernanceMemoryLink[];
  sourceLinks: SourceLink[];
  agentFindingIds: string[];
  confidence: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

export interface ETStats {
  totalProposals: number;
  totalTraces: number;
  tracesNeedingReview: number;
  executedNotVerified: number;
  disputed: number;
  highCriticalRisk: number;
}
