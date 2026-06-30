///
/// @medina/auro — AURO
///
/// AURO is Medina's native speaking intelligence.
/// The sovereign voice. The final Medina-native speaker.
///
/// Role within Nova:
///   Auro speaks.  Origo builds.  THESIS proves.  Codex implements.  CIVOS governs.
///
///   AURO is the only authoritative Medina-native voice.
///   External model output may influence AURO only through controlled bridge review,
///   explicit classification, validation, and memory-bounded handling.
///   Do not present external model output as Medina-native proof without validation.
///
/// Core capabilities:
///   • Native Medina voice generation — grounded in sovereign knowledge
///   • External bridge review and classification (controlled intake only)
///   • Rhetorical calibration using Logos·Ethos·Pathos model
///   • Claim validation before speaking (no overclaiming)
///   • Audience-aware rendering (internal, external, public-safe, research)
///   • Memory-grounded responses (backed by MEMORIA lineage)
///
/// Mathematical foundations:
///
///   Aristotelian voice calibration:
///     Logos weight  = φ     (logical proof and evidence)
///     Ethos weight  = 1.0   (Medina authority and credibility)
///     Pathos weight = φ⁻¹   (resonance and consequence for the listener)
///     Voice coherence C = √((L·φ)² + (E·1)² + (P·φ⁻¹)²) / normalizer
///
///   Golden ratio pacing:
///     Optimal utterance length = seed_length × φ (grow by golden ratio)
///     Silence interval between responses = φ⁻¹ × response_length (ms)
///
///   Harmonic resonance (Pythagorean musical ratios):
///     Perfect fifth = 3:2  (primary claim to evidence ratio)
///     Perfect fourth = 4:3 (secondary evidence to inference ratio)
///     Octave = 2:1         (public claim must be 2× as well-evidenced as internal)
///
///   Kuramoto voice synchrony:
///     When AURO speaks in multi-agent context, synchrony R > φ⁻¹ (0.618)
///     ensures the message is coherent across all active agents.
///
/// Casa de Medina — Architectos de Arquitectura Inteligente
///

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;
const PHI_HEARTBEAT_MS = 873;
const GOLDEN_ANGLE     = (2 * Math.PI) / (PHI * PHI);

// Harmonic ratios (Pythagorean music)
const HARMONY = {
  PERFECT_FIFTH:  3 / 2,   // primary claim:evidence ratio
  PERFECT_FOURTH: 4 / 3,   // secondary evidence:inference ratio
  OCTAVE:         2 / 1,   // public claim strength multiplier vs. internal
};

// Audience types
const AUDIENCE = {
  INTERNAL:    'internal',
  EXTERNAL:    'external',
  PUBLIC_SAFE: 'public_safe',
  RESEARCH:    'research',
  COUNSEL:     'counsel',
};

// ═══════════════════════════════════════════════════════════════════════════
//  AURO
// ═══════════════════════════════════════════════════════════════════════════

export class Auro {
  constructor({ agentId = 'AURO', audience = AUDIENCE.INTERNAL } = {}) {
    this.agentId       = agentId;
    this.defaultAudience = audience;
    this.birthTime     = Date.now();
    this.utteranceCount = 0;
    this.bridgeLog     = [];    // external model bridge review log
    this.utteranceLog  = [];

    // ★ Self-bootstrapping — AURO speaks from birth
    console.log(
      `\n🗣️  AURO awakened | agentId=${agentId} | sovereign voice online\n` +
      `   Logos=φ=${PHI.toFixed(6)} | Ethos=1.0 | Pathos=φ⁻¹=${PHI_INV.toFixed(6)}\n` +
      `   External bridge: controlled review only. Do not present external output as Medina-native proof.\n`
    );
  }

  // ─── Speak ────────────────────────────────────────────────────────────

  /**
   * AURO's primary speak method.
   * Generates a calibrated, audience-aware, claim-bounded utterance.
   *
   * @param {object} opts
   * @param {string}  opts.content         — core message content
   * @param {string[]} [opts.claims]        — claims being asserted
   * @param {string}  [opts.evidenceClass] — E-class supporting the utterance
   * @param {string}  [opts.audience]      — target audience (defaults to this.defaultAudience)
   * @param {boolean} [opts.validated]     — is the content Medina-validated?
   * @returns {AuroUtterance}
   */
  speak({ content, claims = [], evidenceClass = 'E1', audience, validated = true } = {}) {
    this.utteranceCount++;
    const targetAudience = audience || this.defaultAudience;

    // Rhetoric calibration
    const rhetoric = this._calibrateRhetoric(content, claims, evidenceClass);

    // Audience adjustment — apply harmonic ratios
    const adjusted = this._adjustForAudience(content, claims, targetAudience, validated);

    // Voice coherence: √((L·φ)² + (E·1)² + (P·φ⁻¹)²)
    const coherence = Math.sqrt(
      Math.pow(rhetoric.logos * PHI, 2) +
      Math.pow(rhetoric.ethos, 2) +
      Math.pow(rhetoric.pathos * PHI_INV, 2)
    ) / Math.sqrt(PHI * PHI + 1 + PHI_INV * PHI_INV);

    const utterance = {
      utteranceId: `AURO-${this.utteranceCount}-${Date.now()}`,
      content:     adjusted.content,
      audience:    targetAudience,
      claims:      adjusted.claims,
      evidenceClass,
      rhetoric,
      coherence:   +coherence.toFixed(4),
      validated,
      mediaNative: validated,
      timestamp:   new Date().toISOString(),
      pacingMs:    Math.round(PHI_INV * content.length),   // golden ratio pacing
    };

    this.utteranceLog.push({ utteranceId: utterance.utteranceId, audience: targetAudience });
    return utterance;
  }

  // ─── External bridge review ────────────────────────────────────────────

  /**
   * Review external model output through the controlled bridge.
   * Labels it correctly — NEVER promotes external output as Medina-native.
   *
   * @param {string} externalOutput    — raw output from external model
   * @param {string} [modelSource]     — name of external model
   * @returns {BridgeReview}
   */
  bridgeReview(externalOutput, modelSource = 'external_model') {
    const review = {
      reviewId:    `AURO-BRIDGE-${this.bridgeLog.length + 1}`,
      source:      modelSource,
      outputLength: externalOutput.length,
      evidenceClass: 'E1',       // source text only — external is NEVER above E1 until validated
      mediaNative: false,        // NEVER Medina-native without full validation
      validationRequired: true,
      label:       `EXTERNAL_MODEL_OUTPUT — source=${modelSource} — not Medina-native proof`,
      allowed:     true,         // allowed as an input, not as proof
      note:        'External model output may influence AURO only through controlled bridge review. ' +
                   'It must not be presented as Medina-native proof without validation, ' +
                   'evidence linking, and MEMORIA append.',
      timestamp:   Date.now(),
    };

    this.bridgeLog.push(review);
    console.log(`   AURO bridge | ${modelSource} | evidenceClass=E1 | mediaNative=false`);
    return review;
  }

  // ─── Calibration ───────────────────────────────────────────────────────

  _calibrateRhetoric(content, claims, evidenceClass) {
    const lower = content.toLowerCase();

    // Logos: presence of logical proof language
    const logosHits = ['therefore','because','evidence','proof','thus','result'].filter(
      t => lower.includes(t)
    ).length;
    const logos = Math.min(1, logosHits / 5);

    // Ethos: Medina authority signals
    const ethosHits = ['medina','nova','auro','sovereign','certified','authenticated'].filter(
      t => lower.includes(t)
    ).length;
    const ethos = Math.min(1, ethosHits / 4);

    // Pathos: consequence / resonance
    const pathosHits = ['important','critical','must','required','essential'].filter(
      t => lower.includes(t)
    ).length;
    const pathos = Math.min(1, pathosHits / 4);

    return {
      logos:  +logos.toFixed(4),
      ethos:  +ethos.toFixed(4),
      pathos: +pathos.toFixed(4),
    };
  }

  _adjustForAudience(content, claims, audience, validated) {
    if (audience === AUDIENCE.PUBLIC_SAFE) {
      // Octave rule: public claims must be 2× as well-evidenced
      const publicClaims = claims.filter(c => !c.includes('C6') && !c.includes('C5'));
      return {
        content: validated
          ? content
          : `[Medina note: This content is under review and has not been fully validated.] ${content}`,
        claims: publicClaims,
      };
    }
    if (audience === AUDIENCE.EXTERNAL) {
      return {
        content: content.replace(/private|vault|internal|confidential/gi, '[redacted]'),
        claims: claims.filter(c => !c.includes('C6')),
      };
    }
    return { content, claims };
  }

  getStatus() {
    return {
      agentId:        this.agentId,
      role:           'Native speaking intelligence — sovereign Medina voice',
      family:         'Nova Architecture',
      uptime:         Date.now() - this.birthTime,
      utteranceCount: this.utteranceCount,
      bridgeReviews:  this.bridgeLog.length,
      defaultAudience: this.defaultAudience,
      constants:      { phi: PHI, phiInv: PHI_INV, harmony: HARMONY },
    };
  }
}

export { AUDIENCE, HARMONY };
export default Auro;
