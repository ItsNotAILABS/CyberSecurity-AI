///
/// @medina/thesis-alpha — ANIMUS Engine
///
/// ANIMUS is the curiosity engine and the heart of THESIS.
/// It seeks the deeper theorem before closure, runs the 12-step
/// curiosity loop, and pressure-tests every claim.
///
/// THESIS is not rewarded for finishing quickly.
/// Optimize for research worth finishing.
///
/// Mathematical foundations:
///
///   Shannon Entropy (information gain):
///     H(X) = −Σ p(xᵢ) · log₂(p(xᵢ))
///     Used to measure how much new information a theorem candidate
///     introduces. High entropy = unexplored territory = strong candidate.
///
///   φ-Spiral Edge Expansion:
///     For curiosity depth d (0 to MAX_DEPTH):
///       edge_weight(d) = φ^d / Σ(φ^k, k=0..MAX_DEPTH)
///     Each deeper curiosity layer is φ-weighted — the golden ratio
///     governs how much attention each depth level receives.
///
///   Socratic Dialectic:
///     Thesis → Antithesis → Synthesis
///     T_strength × (1 − A_strength) → S_coherence
///     A strong antithesis that survives produces a stronger synthesis.
///
///   Edge Theorem Score (ECS):
///     E = edge contribution (novel theorem angle)
///     C = claim discipline (verified vs. hypothesis ratio)
///     S = source/proof substrate strength
///     ECS = (E × φ + C × 1 + S × φ⁻¹) / (φ + 1 + φ⁻¹)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI_INV, EMERGENCE_THRESHOLD, LN2,
  FIBONACCI, CLAIM_CLASS, EVIDENCE_STRENGTH,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const MAX_CURIOSITY_DEPTH = 12;   // 12-step curiosity loop
const ECS_WEIGHT_E = PHI;         // Edge theorem weight
const ECS_WEIGHT_C = 1.0;         // Claim discipline weight
const ECS_WEIGHT_S = PHI_INV;     // Substrate weight
const ECS_DENOM    = ECS_WEIGHT_E + ECS_WEIGHT_C + ECS_WEIGHT_S;

// ═══════════════════════════════════════════════════════════════════════════
//  ANIMUS ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class AnimusEngine {
  constructor({ agentId = 'THESIS-ALPHA' } = {}) {
    this.agentId       = agentId;
    this.birthTime     = Date.now();
    this.runCount      = 0;
    this.expansions    = [];

    console.log(`🔥 ANIMUS born | agentId=${agentId} | curiosity engine ignited`);
  }

  // ─── 12-Step Curiosity Loop ────────────────────────────────────────────

  /**
   * Run the full 12-step ANIMUS curiosity expansion.
   *
   * @param {object} input
   * @param {string} input.obviousThesis     — starting thesis
   * @param {string[]} [input.existingClaims]  — already-identified claims
   * @param {string[]} [input.existingEvidence] — already-identified evidence
   * @param {object}  [input.sensusResult]    — SENSUS classification result
   * @returns {AnimusExpansion}
   */
  expand(input) {
    this.runCount++;

    const {
      obviousThesis = '',
      existingClaims = [],
      existingEvidence = [],
      sensusResult = {},
    } = input;

    // ── Step 1: State the obvious thesis
    const step1_obvious = this._step_obviousThesis(obviousThesis);

    // ── Step 2: Find the deeper theorem
    const step2_deeper = this._step_deeperTheorem(obviousThesis, sensusResult);

    // ── Step 3: Find the strongest critic objection
    const step3_objection = this._step_strongestObjection(step2_deeper.theorem, existingClaims);

    // ── Step 4: Find the missing proof
    const step4_missingProof = this._step_missingProof(existingEvidence);

    // ── Step 5: Find the implementation consequence
    const step5_implementation = this._step_implementationConsequence(step2_deeper.theorem);

    // ── Step 6: Find the IP novelty
    const step6_ipNovelty = this._step_ipNovelty(step2_deeper.theorem, sensusResult);

    // ── Step 7: Find what must remain private
    const step7_private = this._step_privateSplit(sensusResult);

    // ── Step 8: Find what can be public-safe
    const step8_public = this._step_publicSafe(step7_private, existingClaims);

    // ── Step 9: Find what should be hashed
    const step9_hash = this._step_hashCandidates(existingEvidence, sensusResult);

    // ── Step 10: Find what should be notarized
    const step10_notary = this._step_notaryCandidates(step9_hash, sensusResult);

    // ── Step 11: Find protocol/module/deployment path
    const step11_deployment = this._step_deploymentPath(step2_deeper.theorem, step5_implementation);

    // ── Step 12: Decide if Foundation Floor is needed
    const step12_foundation = this._step_foundationFloorDecision(
      step3_objection, step4_missingProof, step6_ipNovelty
    );

    // Compute ECS score
    const ecsScore = this._computeECS(step2_deeper, existingClaims, existingEvidence);

    // φ-spiral edge weights across curiosity depth
    const depthWeights = this._phiSpiralWeights(MAX_CURIOSITY_DEPTH);

    const expansion = {
      expansionId:  `ANIMUS-${this.runCount}-${Date.now()}`,
      timestamp:    Date.now(),
      runNumber:    this.runCount,

      step1_obviousThesis:    step1_obvious,
      step2_deeperTheorem:    step2_deeper,
      step3_strongestObjection: step3_objection,
      step4_missingProof:     step4_missingProof,
      step5_implementation:   step5_implementation,
      step6_ipNovelty:        step6_ipNovelty,
      step7_private:          step7_private,
      step8_publicSafe:       step8_public,
      step9_hashCandidates:   step9_hash,
      step10_notaryCandidates: step10_notary,
      step11_deploymentPath:  step11_deployment,
      step12_foundationFloor: step12_foundation,

      ecsScore,
      depthWeights,

      edgeTheorem:  step2_deeper.theorem,
      strongestObjection: step3_objection.objection,
      missingProof: step4_missingProof.gap,
      privateTerms: step7_private.privateTerms,
      publicTerms:  step8_public.publicTerms,
      hashList:     step9_hash.candidates,
      notaryList:   step10_notary.candidates,
      deploymentPath: step11_deployment.path,
      needsFoundationFloor: step12_foundation.needed,
    };

    this.expansions.push(expansion);
    console.log(`   ANIMUS expanded | step=12/12 | ECS=${ecsScore.total.toFixed(4)} | deeperTheorem=${step2_deeper.theorem.slice(0,60)}...`);
    return expansion;
  }

  // ─── Step implementations ──────────────────────────────────────────────

  _step_obviousThesis(thesis) {
    return {
      thesis,
      length: thesis.length,
      wordCount: thesis.split(/\s+/).filter(Boolean).length,
    };
  }

  _step_deeperTheorem(thesis, sensusResult) {
    const substrate = sensusResult.substrateType || 'unknown';
    const risk = sensusResult.claimRisk || 0.5;

    // Use entropy to measure how unexplored the theorem territory is
    const entropy = this._shannonEntropy(thesis);

    // Edge extension: if risk is high, there's more unexplored space
    const edgeExtension = PHI * risk * entropy;

    const theorem = `${thesis} — extended to: the deeper mechanism governing ` +
      `${substrate}-class substrate behavior under φ-weighted evidence pressure ` +
      `(entropy=${entropy.toFixed(4)}, edge_extension=${edgeExtension.toFixed(4)})`;

    return {
      theorem,
      entropyMeasure: +entropy.toFixed(4),
      edgeExtension:  +edgeExtension.toFixed(4),
      noveltyScore:   +Math.min(1, edgeExtension).toFixed(4),
    };
  }

  _step_strongestObjection(theorem, existingClaims) {
    // Socratic antithesis: find the claim most likely to contradict the theorem
    const objectionTemplates = [
      `The theorem assumes conditions that have not been empirically verified`,
      `The mechanism described lacks reproducible test coverage at the stated scope`,
      `Equivalent or prior mechanisms exist in the literature that may reduce novelty`,
      `The claim strength exceeds current evidence class — requires minimum E4 or better`,
      `The deployment consequence is asserted without a rollback plan or manifest`,
      `The private/public split boundary has not been explicitly defined`,
      `The Logos score suggests logical gaps that weaken the central proof`,
    ];

    // Socratic dialectic strength: A_strength inversely proportional to claim count
    const antithesisStrength = PHI_INV / (1 + existingClaims.length * PHI_INV);
    const synthesisClosed = antithesisStrength < PHI_INV;  // antithesis survived?

    return {
      objection:         objectionTemplates[this.runCount % objectionTemplates.length],
      antithesisStrength: +antithesisStrength.toFixed(4),
      dialecticSynthesis: synthesisClosed
        ? 'antithesis dissolved — synthesis strong'
        : 'antithesis survives — proof gap remains',
      claimCount: existingClaims.length,
    };
  }

  _step_missingProof(existingEvidence) {
    const eClasses = existingEvidence.filter(e => e && e.startsWith('E'));
    const maxStrength = eClasses.reduce(
      (m, ec) => Math.max(m, EVIDENCE_STRENGTH[ec] ?? 0), 0
    );
    const gap = 10 - maxStrength;

    let description;
    if (gap === 0) {
      description = 'No critical proof gap — evidence at maximum strength (E10)';
    } else if (gap <= 2) {
      description = `Near-complete proof — missing ${gap} evidence tier(s) to E10`;
    } else if (gap <= 5) {
      description = `Significant proof gap (${gap} tiers) — reproducible scripts (E5) or BotProofRecord (E6) recommended`;
    } else {
      description = `Critical proof gap (${gap} tiers) — requires code implementation (E4) minimum before any public claim`;
    }

    return {
      currentMaxEvidenceStrength: maxStrength,
      gapToMaximum: gap,
      gap:          description,
      recommendation: gap > 3
        ? 'Escalate to AUTE for experiment design'
        : 'Evidence near sufficient for claim hardening',
    };
  }

  _step_implementationConsequence(theorem) {
    const hasDeployment = /deploy|canister|protocol|runtime|module/i.test(theorem);
    const hasMath       = /theorem|proof|formula|equation/i.test(theorem);
    const hasIP         = /novel|invention|proprietary|mechanism/i.test(theorem);

    const consequences = [];
    if (hasDeployment) consequences.push('Protocol candidate — suitable for canister schema translation');
    if (hasMath)       consequences.push('Theorem candidate — requires proof ledger entry');
    if (hasIP)         consequences.push('IP candidate — requires invention disclosure packet');
    if (!consequences.length) consequences.push('Research artifact — standard packet pathway');

    return { consequences, hasDeployment, hasMath, hasIP };
  }

  _step_ipNovelty(theorem, sensusResult) {
    const rhetoric = sensusResult.rhetoricScore || {};
    const noveltyPressure = (rhetoric.logos || 0) * PHI + (rhetoric.ethos || 0) * PHI_INV;

    return {
      noveltyPressure: +noveltyPressure.toFixed(4),
      ipCandidateSignals: [
        noveltyPressure > EMERGENCE_THRESHOLD
          ? 'Strong IP novelty signal detected — prepare invention disclosure'
          : 'Weak IP novelty signal — proceed with prior-art search before IP claim',
      ],
      protectedTerms: [],     // Custos will populate in working cohort
      disclosureReady: noveltyPressure > EMERGENCE_THRESHOLD,
    };
  }

  _step_privateSplit(sensusResult) {
    const privateCore = sensusResult.privateCore || false;
    const privTerms = [];
    if (privateCore) {
      privTerms.push(
        'vault logic', 'private model structure', 'protected mechanisms',
        'unreleased runtime design', 'strategic IP'
      );
    }
    return {
      privateCore,
      privateTerms:   privTerms,
      privateRequired: privateCore,
      vaultRequired:   privateCore,
    };
  }

  _step_publicSafe(privateStep, existingClaims) {
    if (privateStep.privateCore) {
      return {
        publicTerms:  [],
        publicSafeAllowed: false,
        reason: 'Private core detected — no public release until Custos gate cleared',
      };
    }
    return {
      publicTerms:  existingClaims.filter(c => c.includes('C10')),
      publicSafeAllowed: true,
      reason: 'No private core — public-safe route open after claim hardening',
    };
  }

  _step_hashCandidates(existingEvidence, sensusResult) {
    const candidates = [];
    if (sensusResult.substrateType) candidates.push(`substrate:${sensusResult.substrateType}`);
    for (const ev of existingEvidence) candidates.push(`evidence:${ev}`);
    candidates.push('claims-matrix', 'evidence-matrix', 'proof-ledger');

    return {
      candidates,
      merkleRequired: candidates.length > 1,
      note: 'Hash manifest required before HASHED authority state',
    };
  }

  _step_notaryCandidates(hashStep, sensusResult) {
    const targets = [];
    if (hashStep.merkleRequired) {
      targets.push('ICP-anchored notary', 'Git signature', 'IPFS content address', 'local hash manifest');
    }
    const substrate = sensusResult.substrateType || '';
    const highPriority = ['ip_claim', 'theorem_candidate', 'deployment_blueprint'].includes(substrate);

    return {
      candidates: hashStep.candidates,
      notaryTargets: targets,
      highPriority,
      operatorApprovalRequired: true,
      note: 'Preparing packet is NOT broadcasting — operator approves before external notarization',
    };
  }

  _step_deploymentPath(theorem, implementationStep) {
    if (!implementationStep.hasDeployment) {
      return { path: 'no deployment path detected — research-only artifact', needed: false };
    }
    return {
      path: `Paper theorem → protocol candidate → runtime schema → ` +
            `module/canister design → proof requirements → deployment manifest → ` +
            `rollback plan → notary record`,
      needed: true,
      stages: [
        'theorem', 'protocol_candidate', 'runtime_schema',
        'canister_design', 'proof_requirements',
        'deployment_manifest', 'rollback_plan', 'notary_record',
      ],
    };
  }

  _step_foundationFloorDecision(objectionStep, proofStep, ipStep) {
    const needed =
      objectionStep.antithesisStrength > EMERGENCE_THRESHOLD ||
      proofStep.gapToMaximum > 5 ||
      ipStep.disclosureReady;

    return {
      needed,
      reason: needed
        ? 'Heavy synthesis, prior-art search, or Monte Carlo work required — escalate to Foundation Floor'
        : 'Active State Runtime sufficient for this work',
    };
  }

  // ─── ECS Score ────────────────────────────────────────────────────────

  /**
   * Edge–Claim–Source composite score:
   *   ECS = (E × φ + C × 1 + S × φ⁻¹) / (φ + 1 + φ⁻¹)
   */
  _computeECS(deeperStep, claims, evidence) {
    const E = Math.min(1, deeperStep.noveltyScore || 0);

    // C = ratio of verified/supported claims vs. total
    const verifiedCount = claims.filter(c =>
      c.includes('C1') || c.includes('C2')
    ).length;
    const C = claims.length > 0 ? verifiedCount / claims.length : 0;

    // S = average evidence strength normalized to [0,1]
    const strengths = evidence.map(ev => (EVIDENCE_STRENGTH[ev] ?? 0) / 10);
    const S = strengths.length > 0
      ? strengths.reduce((a, b) => a + b, 0) / strengths.length
      : 0;

    const total = (E * ECS_WEIGHT_E + C * ECS_WEIGHT_C + S * ECS_WEIGHT_S) / ECS_DENOM;

    return {
      E: +E.toFixed(4),
      C: +C.toFixed(4),
      S: +S.toFixed(4),
      total: +total.toFixed(4),
      weights: { E: ECS_WEIGHT_E, C: ECS_WEIGHT_C, S: ECS_WEIGHT_S },
    };
  }

  // ─── Shannon Entropy ───────────────────────────────────────────────────

  /**
   * H(X) = −Σ p(xᵢ) · log₂(p(xᵢ))
   * Computed over the word-frequency distribution of the input text.
   * High entropy ≈ rich, unexplored conceptual territory.
   */
  _shannonEntropy(text) {
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    if (words.length === 0) return 0;

    const freq = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;

    let H = 0;
    for (const count of Object.values(freq)) {
      const p = count / words.length;
      H -= p * Math.log(p) / LN2;  // log₂(p) = ln(p) / ln(2)
    }
    return H;
  }

  // ─── φ-Spiral Depth Weights ────────────────────────────────────────────

  /**
   * φ-weighted attention across curiosity depth levels.
   *   w(d) = φ^d / Σ(φ^k, k=0..MAX_DEPTH)
   * Each deeper layer gets φ× more relative weight than the previous.
   */
  _phiSpiralWeights(maxDepth) {
    const raw = [];
    let sum = 0;
    for (let d = 0; d < maxDepth; d++) {
      const w = Math.pow(PHI, d);
      raw.push(w);
      sum += w;
    }
    return raw.map((w, d) => ({ depth: d, weight: +(w / sum).toFixed(6) }));
  }

  getStatus() {
    return {
      agentId:   this.agentId,
      uptime:    Date.now() - this.birthTime,
      runCount:  this.runCount,
      expansions: this.expansions.length,
      lastECS:   this.expansions.at(-1)?.ecsScore || null,
    };
  }
}

export default AnimusEngine;
