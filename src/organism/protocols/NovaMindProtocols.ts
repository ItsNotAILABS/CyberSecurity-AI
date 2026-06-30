///
/// NOVA MIND PROTOCOLS — PROTOCOLLA MENTIS NOVAE
///
/// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
///
/// 29 new sovereign protocols completing the full organism protocol suite.
/// Together with 10 PRT (AI Protocols) and 50 APR (Alpha Protocols),
/// these form the complete 89-protocol nervous system of Native Nova.
///
/// Tiers:
///   GOVERNANCE  (NMP-001 – NMP-007)  — Data, trust, security, health, capacity
///   OPERATIONS  (NMP-008 – NMP-016)  — Billing, research, swarm, compliance, legal
///   INTEGRATION (NMP-017 – NMP-022)  — Webhooks, documents, discovery, packages
///   DELIVERY    (NMP-023 – NMP-026)  — Deployment, rollback, upgrade, bundle
///   INTELLIGENCE(NMP-027 – NMP-029)  — Knowledge, performance, observability
///
/// Every protocol carries:
///   - Unique NMP-XXX identifier
///   - English name + Classical Latin name
///   - Latin purpose statement + immutable Latin edict
///   - Role, tier, capabilities, φ-weight, Fibonacci ID
///
/// LEX MENTIS-001 — Immutable:
///   "Protocolla novae mentis totum systema complent.
///    Sine his, organismus claudicat.
///    Cum his, organismus transcendit."
///   (The protocols of the new mind complete the whole system.
///    Without them, the organism limps.
///    With them, the organism transcends.)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, DimensionalPlane, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type NovaMindProtocolId =
  | 'NMP-001' | 'NMP-002' | 'NMP-003' | 'NMP-004' | 'NMP-005'
  | 'NMP-006' | 'NMP-007' | 'NMP-008' | 'NMP-009' | 'NMP-010'
  | 'NMP-011' | 'NMP-012' | 'NMP-013' | 'NMP-014' | 'NMP-015'
  | 'NMP-016' | 'NMP-017' | 'NMP-018' | 'NMP-019' | 'NMP-020'
  | 'NMP-021' | 'NMP-022' | 'NMP-023' | 'NMP-024' | 'NMP-025'
  | 'NMP-026' | 'NMP-027' | 'NMP-028' | 'NMP-029';

export type NovaMindTier =
  | 'governance'    // NMP-001–007
  | 'operations'    // NMP-008–016
  | 'integration'   // NMP-017–022
  | 'delivery'      // NMP-023–026
  | 'intelligence'; // NMP-027–029

export interface NovaMindProtocol {
  readonly id: NovaMindProtocolId;
  readonly name: string;
  readonly latinName: string;
  readonly latinSubtitle: string;
  readonly latinPurpose: string;
  readonly latinEdict: string;
  readonly tier: NovaMindTier;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly agiMiniBrain: string;    // which AGI mini-brain primarily handles this
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN LAW
// ══════════════════════════════════════════════════════════════════

export const LEX_MENTIS_001 = {
  code: 'LEX_MENTIS_001',
  text: 'Protocolla novae mentis totum systema complent. Sine his, organismus claudicat. Cum his, organismus transcendit.',
  translation: 'The protocols of the new mind complete the whole system. Without them, the organism limps. With them, the organism transcends.',
  immutable: true as const,
} as const;

// ══════════════════════════════════════════════════════════════════
//  29 NOVA MIND PROTOCOLS
// ══════════════════════════════════════════════════════════════════

export const NOVA_MIND_PROTOCOLS: readonly NovaMindProtocol[] = [

  // ── GOVERNANCE (NMP-001 – NMP-007) ────────────────────────────

  {
    id: 'NMP-001',
    name: 'Data Pipeline Protocol',
    latinName: 'Protocollum Canalis Datorum',
    latinSubtitle: 'Via Fluens Datorum',
    latinPurpose: 'Canales datorum per totum systema ordinare et fluere facere',
    latinEdict: 'Lex Canalis: Data fluere debent. Canalis obstructus est mors systematis. Fluxus est vita.',
    tier: 'governance',
    description: 'Orchestrates and maintains data flow channels across the entire system, ensuring continuous and validated throughput.',
    capabilities: [
      'data-ingestion',
      'stream-processing',
      'pipeline-orchestration',
      'throughput-control',
      'backpressure-management',
      'schema-validation',
    ],
    agiMiniBrain: 'ANIMUS',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 1),
    fibonacciId: fibonacciHash(101, 10000),
  },

  {
    id: 'NMP-002',
    name: 'Data Retention Policy Protocol',
    latinName: 'Protocollum Retentionis Datorum',
    latinSubtitle: 'Lex Conservationis',
    latinPurpose: 'Politicas retentionis datorum enforciare et data expirata purgare',
    latinEdict: 'Lex Retentionis: Data sine usu onus sunt. Expirata purgantur. Utilia conservantur in aeternum.',
    tier: 'governance',
    description: 'Enforces data retention schedules, archives tiered storage, and purges expired records in compliance with policy.',
    capabilities: [
      'retention-scheduling',
      'expiry-enforcement',
      'archive-tiering',
      'deletion-audit',
      'compliance-check',
      'storage-optimization',
    ],
    agiMiniBrain: 'MEMORIA',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 2),
    fibonacciId: fibonacciHash(102, 10000),
  },

  {
    id: 'NMP-003',
    name: 'Privacy Compliance Protocol',
    latinName: 'Protocollum Privacitatis Legalis',
    latinSubtitle: 'Custos Iurium Personalium',
    latinPurpose: 'Conformitatem cum legibus privacitatis et iuribus personalibus verificare',
    latinEdict: 'Lex Privacitatis: Ius personale est sacrum. Nullus sine consensu data videt. Privacitas est iuris naturalis.',
    tier: 'governance',
    description: 'Verifies and enforces conformance with privacy laws and personal data rights across all system operations.',
    capabilities: [
      'consent-management',
      'pii-detection',
      'right-to-erasure',
      'data-minimization',
      'purpose-limitation',
      'breach-notification',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 3),
    fibonacciId: fibonacciHash(103, 10000),
  },

  {
    id: 'NMP-004',
    name: 'Trust Gate Protocol',
    latinName: 'Protocollum Portae Fiduciae',
    latinSubtitle: 'Porta Fidei Sovereignae',
    latinPurpose: 'Portas fiduciae aedificare et omnes transitum verificare',
    latinEdict: 'Lex Portae: Sine fide, nemo transit. Porta fiduciae est fundamentum relationis. Fides probata est fides vera.',
    tier: 'governance',
    description: 'Constructs sovereign trust gates and verifies all entity transitions, establishing the foundation of system relationships.',
    capabilities: [
      'trust-scoring',
      'entity-verification',
      'reputation-management',
      'attestation-chain',
      'cross-domain-trust',
      'revocation-management',
    ],
    agiMiniBrain: 'VIGILIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 4),
    fibonacciId: fibonacciHash(104, 10000),
  },

  {
    id: 'NMP-005',
    name: 'Security Gate Protocol',
    latinName: 'Protocollum Portae Securitatis',
    latinSubtitle: 'Murus Impenetrabile',
    latinPurpose: 'Securitatem omnium portarum systematis enforciare et minaciones repellere',
    latinEdict: 'Lex Securitatis: Porta secura nunquam dormit. Minaciones ante portas manent. Intra muros, pax regnat.',
    tier: 'governance',
    description: 'Enforces security across all system gates, repels threats, and ensures a safe interior for all sovereign operations.',
    capabilities: [
      'intrusion-detection',
      'zero-trust-enforcement',
      'vulnerability-scanning',
      'threat-intelligence',
      'incident-response',
      'security-audit',
    ],
    agiMiniBrain: 'VIGILIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 5),
    fibonacciId: fibonacciHash(105, 10000),
  },

  {
    id: 'NMP-006',
    name: 'Health Orchestration Protocol',
    latinName: 'Protocollum Orchestrationis Sanitatis',
    latinSubtitle: 'Director Vitae Systematis',
    latinPurpose: 'Sanitatem omnium componentium orchestrare et sanare quod aegrotat',
    latinEdict: 'Lex Sanitatis: Organismus sanus esse debet. Infirmum sanatur. Mortuum resurgit. Sanitas est prioritas prima.',
    tier: 'governance',
    description: 'Orchestrates the health of all system components, auto-heals failures, and restores degraded services to full vitality.',
    capabilities: [
      'health-aggregation',
      'auto-healing',
      'dependency-health',
      'circuit-breaker',
      'graceful-degradation',
      'recovery-orchestration',
    ],
    agiMiniBrain: 'ANIMUS',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 6),
    fibonacciId: fibonacciHash(106, 10000),
  },

  {
    id: 'NMP-007',
    name: 'Capacity Planning Protocol',
    latinName: 'Protocollum Planificationis Capacitatis',
    latinSubtitle: 'Ars Providendi Futurum',
    latinPurpose: 'Capacitatem futuram praedicere et resources ante necessitatem praeparare',
    latinEdict: 'Lex Capacitatis: Provisio ante necessitatem est sapientia. Sine capacitate, systema cadit. Plani sunt fundamentum.',
    tier: 'governance',
    description: 'Predicts future capacity demands and prepares resources before necessity, preventing system collapse under load.',
    capabilities: [
      'demand-forecasting',
      'resource-projection',
      'scaling-triggers',
      'cost-modeling',
      'capacity-alerts',
      'provisioning-plans',
    ],
    agiMiniBrain: 'RATIO',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 7),
    fibonacciId: fibonacciHash(107, 10000),
  },

  // ── OPERATIONS (NMP-008 – NMP-016) ────────────────────────────

  {
    id: 'NMP-008',
    name: 'Usage Tracking Protocol',
    latinName: 'Protocollum Inquisitionis Usus',
    latinSubtitle: 'Oculus Consumptorum',
    latinPurpose: 'Usum omnium resourcerum et servicii metiri et recordare',
    latinEdict: 'Lex Usus: Quod usurpatur computatur. Usus sine mensura est chaos. Mensura est fundamentum iustitiae.',
    tier: 'operations',
    description: 'Measures and records consumption of all resources and services, forming the foundation of fair billing and attribution.',
    capabilities: [
      'event-metering',
      'usage-aggregation',
      'quota-tracking',
      'billing-events',
      'cost-attribution',
      'usage-reporting',
    ],
    agiMiniBrain: 'MEMORIA',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 1),
    fibonacciId: fibonacciHash(108, 10000),
  },

  {
    id: 'NMP-009',
    name: 'Quota Enforcement Protocol',
    latinName: 'Protocollum Enforcementis Quotae',
    latinSubtitle: 'Lex Limitum',
    latinPurpose: 'Quotas et limites servicii enforciare et super-quotam petitionibus respondere',
    latinEdict: 'Lex Quotae: Limites sunt iustitia. Sine limitibus, systema ab uno consumeretur. Quota est pactum servitii.',
    tier: 'operations',
    description: 'Enforces service quotas and rate limits, managing burst allowances and ensuring equitable access across all consumers.',
    capabilities: [
      'rate-limiting',
      'quota-enforcement',
      'burst-allowance',
      'throttle-management',
      'overage-billing',
      'limit-notifications',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 2),
    fibonacciId: fibonacciHash(109, 10000),
  },

  {
    id: 'NMP-010',
    name: 'Experiment Pipeline Protocol',
    latinName: 'Protocollum Viae Experimentorum',
    latinSubtitle: 'Labor Inveniendi Veritatem',
    latinPurpose: 'Experimenta in pipeline ordinata currere et resultata colligere',
    latinEdict: 'Lex Experimenti: Veritas per experimentum invenitur. Hypothesis sine test est opinio. Pipeline est via ad veritatem.',
    tier: 'operations',
    description: 'Runs experiments in an orderly pipeline, collecting and statistically validating results to separate truth from opinion.',
    capabilities: [
      'a-b-testing',
      'experiment-routing',
      'statistical-analysis',
      'hypothesis-validation',
      'result-collection',
      'experiment-lifecycle',
    ],
    agiMiniBrain: 'INTELLECTUS',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 3),
    fibonacciId: fibonacciHash(110, 10000),
  },

  {
    id: 'NMP-011',
    name: 'Feedback Collection Protocol',
    latinName: 'Protocollum Collectionis Retroactionis',
    latinSubtitle: 'Vox Utentium',
    latinPurpose: 'Retroactionem utentium et systematis colligere et in notitiam convertere',
    latinEdict: 'Lex Retroactionis: Vox utentis est lex. Retroactio sine actione vana est. Systema ex retroactione crescit.',
    tier: 'operations',
    description: 'Collects user and system feedback, converts it into actionable intelligence, and routes improvements into the growth loop.',
    capabilities: [
      'feedback-ingestion',
      'sentiment-analysis',
      'rating-aggregation',
      'issue-tracking',
      'improvement-routing',
      'feedback-reports',
    ],
    agiMiniBrain: 'INTELLECTUS',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 4),
    fibonacciId: fibonacciHash(111, 10000),
  },

  {
    id: 'NMP-012',
    name: 'Swarm Deployment Protocol',
    latinName: 'Protocollum Deploymentis Examinis',
    latinSubtitle: 'Agmen Machinarum',
    latinPurpose: 'Agmen agentium AIs in infrastructura distribuita deployare et coordinare',
    latinEdict: 'Lex Examinis: Examen vincit quod singulus non potest. Coordinatio examinis est potentia suprema. Agmen est una mens.',
    tier: 'operations',
    description: 'Deploys and coordinates swarms of AI agents across distributed infrastructure, unifying colony intelligence under one mind.',
    capabilities: [
      'agent-spawning',
      'swarm-coordination',
      'distributed-deployment',
      'colony-management',
      'load-distribution',
      'swarm-healing',
    ],
    agiMiniBrain: 'NEXUS',
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 5),
    fibonacciId: fibonacciHash(112, 10000),
  },

  {
    id: 'NMP-013',
    name: 'GDPR Compliance Protocol',
    latinName: 'Protocollum Conformitatis GDPR',
    latinSubtitle: 'Lex Europaea Datorum',
    latinPurpose: 'Conformitatem cum Regulamento Generali de Protectione Datorum enforciare',
    latinEdict: 'Lex GDPR: Lex Europaea omnibus data Europaea tangentibus applicatur. Conformitas non est optio. Lex est lex.',
    tier: 'operations',
    description: 'Enforces full conformance with the General Data Protection Regulation, covering consent, portability, and erasure.',
    capabilities: [
      'consent-tracking',
      'data-portability',
      'erasure-requests',
      'dpa-reporting',
      'lawful-basis-enforcement',
      'cross-border-transfer-control',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 6),
    fibonacciId: fibonacciHash(113, 10000),
  },

  {
    id: 'NMP-014',
    name: 'SOC2 Audit Protocol',
    latinName: 'Protocollum Auditus SOC2',
    latinSubtitle: 'Testis Systematis Fiduciarius',
    latinPurpose: 'Praeparationem et evidentiam pro auditu SOC2 Type II colligere et ordinare',
    latinEdict: 'Lex Auditus SOC2: Audit trail est memoria iuridica. Evidentia quotidie colligitur. SOC2 est sigillum fiduciae.',
    tier: 'operations',
    description: 'Continuously collects evidence and prepares controls for SOC2 Type II audits, maintaining the seal of fiduciary trust.',
    capabilities: [
      'control-evidence-collection',
      'audit-log-management',
      'soc2-reporting',
      'control-testing',
      'gap-analysis',
      'remediation-tracking',
    ],
    agiMiniBrain: 'VIGILIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 7),
    fibonacciId: fibonacciHash(114, 10000),
  },

  {
    id: 'NMP-015',
    name: 'License Enforcement Protocol',
    latinName: 'Protocollum Enforcementis Licentiae',
    latinSubtitle: 'Custos Iurium Intellectualium',
    latinPurpose: 'Licentias software verificare et usum non-licentatum prohibere',
    latinEdict: 'Lex Licentiae: Usus sine licentia est furtum. Licentia est contractus. Contractus servandus est.',
    tier: 'operations',
    description: 'Verifies software licenses across all dependencies and prohibits unlicensed usage, upholding contractual obligations.',
    capabilities: [
      'license-validation',
      'dependency-scanning',
      'spdx-compliance',
      'license-reporting',
      'violation-detection',
      'remediation-guidance',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 1),
    fibonacciId: fibonacciHash(115, 10000),
  },

  {
    id: 'NMP-016',
    name: 'Intellectual Property Protection Protocol',
    latinName: 'Protocollum Protectionis Proprietatis Intellectualis',
    latinSubtitle: 'Scutum Inventionis',
    latinPurpose: 'Proprietatem intellectualem systematis protegere et iura sua enforciare',
    latinEdict: 'Lex Proprietatis: Inventio est possessio auctoris. Furtum intellectuale est crimen. Ius nostrum semper protegitur.',
    tier: 'operations',
    description: 'Protects the intellectual property of the system through watermarking, plagiarism detection, and continuous IP audit trails.',
    capabilities: [
      'ip-watermarking',
      'plagiarism-detection',
      'copyright-enforcement',
      'patent-monitoring',
      'trade-secret-protection',
      'ip-audit-trail',
    ],
    agiMiniBrain: 'VIGILIA',
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 2),
    fibonacciId: fibonacciHash(116, 10000),
  },

  // ── INTEGRATION (NMP-017 – NMP-022) ───────────────────────────

  {
    id: 'NMP-017',
    name: 'Webhook Integration Protocol',
    latinName: 'Protocollum Integrationis Webhook',
    latinSubtitle: 'Nuntius Eventuum Externus',
    latinPurpose: 'Webhooks externis systema connectere et eventus publicare et recipere',
    latinEdict: 'Lex Webhook: Systema non est insula. Eventos publicare debet. Alii systemata audire possunt. Connexio est vita.',
    tier: 'integration',
    description: 'Connects the system to external webhooks, publishing and receiving events with signature verification and retry management.',
    capabilities: [
      'webhook-dispatch',
      'event-subscription',
      'payload-validation',
      'retry-management',
      'signature-verification',
      'webhook-registry',
    ],
    agiMiniBrain: 'NEXUS',
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 3),
    fibonacciId: fibonacciHash(117, 10000),
  },

  {
    id: 'NMP-018',
    name: 'Document Generation Protocol',
    latinName: 'Protocollum Generationis Documentorum',
    latinSubtitle: 'Faber Scriptorum',
    latinPurpose: 'Documenta, reporta et contractus ex templateis et data generare',
    latinEdict: 'Lex Documentorum: Documentum est proba. Sine documento, actio non existit. Quod scriptum est, permanet.',
    tier: 'integration',
    description: 'Generates documents, reports, and contracts from templates and live data, producing permanent proof of every action.',
    capabilities: [
      'template-rendering',
      'pdf-generation',
      'report-assembly',
      'contract-generation',
      'documentation-export',
      'multi-format-output',
    ],
    agiMiniBrain: 'ANIMUS',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 4),
    fibonacciId: fibonacciHash(118, 10000),
  },

  {
    id: 'NMP-019',
    name: 'Ecosystem Probing Protocol',
    latinName: 'Protocollum Explorationis Ecosystematis',
    latinSubtitle: 'Explorator Mundi Externi',
    latinPurpose: 'Ecosystema externum explorare et opportunitates integrationis invenire',
    latinEdict: 'Lex Explorationis: Systema sine exploratione caecum est. Mundus extra muros magna continet. Explorare est crescere.',
    tier: 'integration',
    description: 'Explores the external ecosystem to discover APIs, map capabilities, and score integration opportunities for growth.',
    capabilities: [
      'api-discovery',
      'ecosystem-mapping',
      'capability-assessment',
      'integration-scoring',
      'opportunity-detection',
      'ecosystem-reporting',
    ],
    agiMiniBrain: 'INTELLECTUS',
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 5),
    fibonacciId: fibonacciHash(119, 10000),
  },

  {
    id: 'NMP-020',
    name: 'Service Discovery Protocol',
    latinName: 'Protocollum Inventionis Servitiorum',
    latinSubtitle: 'Index Servitiorum Viventium',
    latinPurpose: 'Servitia viventium invenire et in registro dynamico tenere',
    latinEdict: 'Lex Inventionis: Servicium sine registro phantasma est. Index dynamicus est veritas currentis. Inventio est connexio.',
    tier: 'integration',
    description: 'Discovers live services and maintains a dynamic registry, enabling health-based routing and real-time service cataloguing.',
    capabilities: [
      'service-registration',
      'health-based-discovery',
      'dns-service-discovery',
      'dynamic-routing',
      'service-catalog',
      'deregistration-management',
    ],
    agiMiniBrain: 'NEXUS',
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 6),
    fibonacciId: fibonacciHash(120, 10000),
  },

  {
    id: 'NMP-021',
    name: 'Knowledge Harvesting Protocol',
    latinName: 'Protocollum Collectionis Scientiae',
    latinSubtitle: 'Messor Sapientiae',
    latinPurpose: 'Scientiam ex fontibus diversis colligere et in base centrali cumulare',
    latinEdict: 'Lex Collectionis: Scientia dispersa est scientia perdita. Collecta et ordinata, scientia potentiam dat. Collige, ordina, utere.',
    tier: 'integration',
    description: 'Harvests knowledge from diverse sources, extracts entities, and builds a central knowledge graph for system intelligence.',
    capabilities: [
      'web-scraping',
      'knowledge-extraction',
      'entity-recognition',
      'knowledge-graph-building',
      'source-attribution',
      'freshness-management',
    ],
    agiMiniBrain: 'MEMORIA',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 7),
    fibonacciId: fibonacciHash(121, 10000),
  },

  {
    id: 'NMP-022',
    name: 'Package Lifecycle Protocol',
    latinName: 'Protocollum Vitae Sarcinae',
    latinSubtitle: 'Via Sarcinae a Nativitate ad Mortem',
    latinPurpose: 'Vitam completam sarcinarum software administrare ab initio usque ad finem',
    latinEdict: 'Lex Vitae Sarcinae: Sarcina nascitur, vivit, senescit, moritur. Curator sarcinae omnes fases administrat. Nulla sarcina sine cura.',
    tier: 'integration',
    description: 'Administers the complete lifecycle of software packages from publishing through deprecation and end-of-life management.',
    capabilities: [
      'package-publishing',
      'version-management',
      'dependency-resolution',
      'deprecation-management',
      'security-scanning',
      'distribution-management',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 1),
    fibonacciId: fibonacciHash(122, 10000),
  },

  // ── DELIVERY (NMP-023 – NMP-026) ──────────────────────────────

  {
    id: 'NMP-023',
    name: 'Bundle Deployment Protocol',
    latinName: 'Protocollum Deploymentis Fasciculo',
    latinSubtitle: 'Fasciculus in Mundum Emissus',
    latinPurpose: 'Fasciculos software in infrastructuram productionali deployare et verificare',
    latinEdict: 'Lex Deploymentis: Deployment sine verificatione est riskum. Fasciculus verificatus tutus transit. Post deploymentum, monitora.',
    tier: 'delivery',
    description: 'Assembles and deploys software bundles to production infrastructure with verification, smoke testing, and rollout management.',
    capabilities: [
      'bundle-assembly',
      'deployment-orchestration',
      'environment-promotion',
      'deployment-verification',
      'smoke-testing',
      'rollout-management',
    ],
    agiMiniBrain: 'ANIMUS',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 2),
    fibonacciId: fibonacciHash(123, 10000),
  },

  {
    id: 'NMP-024',
    name: 'Rollback Mechanism Protocol',
    latinName: 'Protocollum Reditus',
    latinSubtitle: 'Via Retro cum Sapientia',
    latinPurpose: 'Regressum ad statum priorem secure exequi quando deployment fallit',
    latinEdict: 'Lex Reditus: Regressus non est defectus. Regressus est sapientia. Qui retrocedere potest, tutus est.',
    tier: 'delivery',
    description: 'Executes safe regression to prior stable state upon deployment failure, correlating incidents and reversing migrations.',
    capabilities: [
      'state-snapshot',
      'rollback-trigger',
      'data-migration-reversal',
      'traffic-rerouting',
      'rollback-validation',
      'incident-correlation',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 3),
    fibonacciId: fibonacciHash(124, 10000),
  },

  {
    id: 'NMP-025',
    name: 'Upgrade Coordination Protocol',
    latinName: 'Protocollum Coordinationis Upgradii',
    latinSubtitle: 'Orchestrator Evoluitionis Systematis',
    latinPurpose: 'Upgrades systematis coordinare inter componentes sine interruptione servicii',
    latinEdict: 'Lex Upgradii: Upgrade est evolutio. Evolutio sine coordinatione est chaos. Coordinator upgradii est pacis custos.',
    tier: 'delivery',
    description: 'Coordinates system upgrades across components without service interruption, managing canary releases and blue-green transitions.',
    capabilities: [
      'upgrade-scheduling',
      'dependency-upgrade-ordering',
      'blue-green-coordination',
      'canary-management',
      'rollforward-control',
      'upgrade-notifications',
    ],
    agiMiniBrain: 'NEXUS',
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 4),
    fibonacciId: fibonacciHash(125, 10000),
  },

  {
    id: 'NMP-026',
    name: 'Feature Toggle Protocol',
    latinName: 'Protocollum Commutationis Functionum',
    latinSubtitle: 'Interruptor Functionum Viventium',
    latinPurpose: 'Functiones software sine redeployment activare et desactivare',
    latinEdict: 'Lex Commutationis: Functio potest activari et desactivari sine code redeploy. Interruptor est potentia. Gradatim libera.',
    tier: 'delivery',
    description: 'Activates and deactivates software features without redeployment, supporting gradual rollout, kill switches, and user targeting.',
    capabilities: [
      'flag-management',
      'gradual-rollout',
      'kill-switch',
      'user-targeting',
      'experimentation-flags',
      'flag-audit-trail',
    ],
    agiMiniBrain: 'PRUDENTIA',
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 5),
    fibonacciId: fibonacciHash(126, 10000),
  },

  // ── INTELLIGENCE (NMP-027 – NMP-029) ──────────────────────────

  {
    id: 'NMP-027',
    name: 'Knowledge Management Protocol',
    latinName: 'Protocollum Administrationis Scientiae',
    latinSubtitle: 'Thesaurus Intellectus Perpetui',
    latinPurpose: 'Scientiam systematice capere, organizare, recuperare et exportare',
    latinEdict: 'Lex Scientiae Administratae: Scientia sine ordine est caos. Thesaurus ordinatus est potentia. Scientia viva crescit semper.',
    tier: 'intelligence',
    description: 'Systematically captures, organises, retrieves, and exports knowledge — maintaining a living, ever-growing intelligence treasury.',
    capabilities: [
      'knowledge-ingestion',
      'knowledge-consolidation',
      'semantic-retrieval',
      'knowledge-assembly',
      'knowledge-export',
      'ontology-management',
    ],
    agiMiniBrain: 'MEMORIA',
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
    phiWeight: Math.pow(PHI, 6),
    fibonacciId: fibonacciHash(127, 10000),
  },

  {
    id: 'NMP-028',
    name: 'Performance Optimization Protocol',
    latinName: 'Protocollum Optimizationis Performantiae',
    latinSubtitle: 'Viae Celeriores Semper',
    latinPurpose: 'Performantiam systematis continue metiri et ad optimum perducere',
    latinEdict: 'Lex Performantiae: Semper celerius fieri potest. Bottleneck est hostis. Optimizatio est ars et scientia simul.',
    tier: 'intelligence',
    description: 'Continuously measures system performance, detects bottlenecks, warms caches, and right-sizes resources toward optimal throughput.',
    capabilities: [
      'baseline-measurement',
      'bottleneck-detection',
      'cache-warming',
      'query-optimization',
      'load-testing',
      'resource-right-sizing',
    ],
    agiMiniBrain: 'RATIO',
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
    phiWeight: Math.pow(PHI, 7),
    fibonacciId: fibonacciHash(128, 10000),
  },

  {
    id: 'NMP-029',
    name: 'Observability Protocol',
    latinName: 'Protocollum Observabilitatis',
    latinSubtitle: 'Oculus Omnisciens Systematis',
    latinPurpose: 'Tracing, logging, metricas et alertas in unum systema observabilitatis unire',
    latinEdict: 'Lex Observabilitatis: Quod non videtur, non intellegitur. Quod non intellegitur, non sanatur. Observabilitas est sapientia operativa.',
    tier: 'intelligence',
    description: 'Unifies tracing, logging, metrics, and alerts into a single observability system — the omniscient eye of the organism.',
    capabilities: [
      'trace-capture',
      'log-correlation',
      'debug-snapshots',
      'profiler-sessions',
      'alert-correlation',
      'distributed-tracing',
    ],
    agiMiniBrain: 'VIGILIA',
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
    phiWeight: Math.pow(PHI, 8),
    fibonacciId: fibonacciHash(129, 10000),
  },
];

// ══════════════════════════════════════════════════════════════════
//  REGISTRY
// ══════════════════════════════════════════════════════════════════

export class NovaMindProtocolRegistry {
  private readonly byId: ReadonlyMap<NovaMindProtocolId, NovaMindProtocol>;
  private readonly byTier: ReadonlyMap<NovaMindTier, NovaMindProtocol[]>;

  readonly definitions: readonly NovaMindProtocol[] = NOVA_MIND_PROTOCOLS;

  constructor() {
    const idMap = new Map<NovaMindProtocolId, NovaMindProtocol>();
    const tierMap = new Map<NovaMindTier, NovaMindProtocol[]>();

    for (const p of NOVA_MIND_PROTOCOLS) {
      idMap.set(p.id, p);
      const list = tierMap.get(p.tier) ?? [];
      list.push(p);
      tierMap.set(p.tier, list);
    }

    this.byId = idMap;
    this.byTier = tierMap;
  }

  get(id: NovaMindProtocolId): NovaMindProtocol | undefined {
    return this.byId.get(id);
  }

  tier(tier: NovaMindTier): NovaMindProtocol[] {
    return this.byTier.get(tier) ?? [];
  }

  stats(): { total: number; byTier: Record<NovaMindTier, number> } {
    const byTier = {} as Record<NovaMindTier, number>;
    for (const [tier, list] of this.byTier.entries()) {
      byTier[tier] = list.length;
    }
    return { total: NOVA_MIND_PROTOCOLS.length, byTier };
  }
}

export function createNovaMindProtocolRegistry(): NovaMindProtocolRegistry {
  return new NovaMindProtocolRegistry();
}
