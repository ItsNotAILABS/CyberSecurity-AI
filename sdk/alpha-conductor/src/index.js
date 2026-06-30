///
/// @medina/alpha-conductor — ALPHA CONDUCTOR
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║         ALPHA CONDUCTOR — HARMONIC SYNCHRONIZATION ENGINE                    ║
/// ║                                                                              ║
/// ║  Latin: Conductor = "One who leads together" / "Guide of harmony"            ║
/// ║                                                                              ║
/// ║  The Alpha Conductor is the temporal and harmonic layer that ensures all     ║
/// ║  Alpha agents operate in rhythmic coherence. Where the Orchestrator routes   ║
/// ║  and dispatches, the Conductor controls TEMPO, DYNAMICS, and RESONANCE.      ║
/// ║                                                                              ║
/// ║  Musical metaphor made mathematical:                                         ║
/// ║    • The Conductor sets the beat (φ-tempo)                                   ║
/// ║    • Controls dynamics (piano to fortissimo — agent intensity)                ║
/// ║    • Ensures harmonic intervals (Pythagorean ratios between agents)           ║
/// ║    • Cues entries and exits (agent activation/deactivation timing)            ║
/// ║    • Resolves dissonance (conflict detection and harmonic correction)         ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Fourier decomposition: f(t) = a₀/2 + Σ(aₙcos(nωt) + bₙsin(nωt))      ║
/// ║      — decomposes agent activity into harmonic components                    ║
/// ║    • Pythagorean harmonic ratios: 2:1 (octave), 3:2 (fifth), 4:3 (fourth)   ║
/// ║      — defines consonant relationships between agent outputs                 ║
/// ║    • φ-tempo: base_tempo × φⁿ for n-th movement section                     ║
/// ║      — natural acceleration/deceleration of work phases                      ║
/// ║    • Kuramoto with frustration: dθᵢ/dt = ωᵢ + (K/N)Σ sin(θⱼ−θᵢ−αᵢⱼ)      ║
/// ║      — allows intentional phase offsets (counterpoint)                       ║
/// ║    • Resonance detection: amplitude peaks at ω = ω₀ (natural frequency)     ║
/// ║      — identifies when agents are in maximum productive alignment            ║
/// ║    • Damped harmonic oscillator: ẍ + 2γẋ + ω₀²x = F(t)/m                   ║
/// ║      — models agent recovery from perturbation                               ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;                  // 0.618...
const PHI_SQ           = PHI * PHI;                  // 2.618...
const PHI_CUBE         = PHI * PHI * PHI;            // 4.236...
const PI               = Math.PI;
const TAU              = 2 * PI;
const GOLDEN_ANGLE     = TAU / (PHI * PHI);          // ≈ 137.508°
const HEARTBEAT_MS     = 873;                        // φ-tuned heartbeat
const EMERGENCE_THRESHOLD = PHI_INV;                 // 0.618 — coherence gate
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

// Pythagorean harmonic ratios (musical intervals as mathematical relationships)
const HARMONIC_RATIOS = {
  UNISON:         1 / 1,     // 1.000 — perfect alignment
  OCTAVE:         2 / 1,     // 2.000 — resonant doubling
  PERFECT_FIFTH:  3 / 2,     // 1.500 — strongest consonance after octave
  PERFECT_FOURTH: 4 / 3,     // 1.333 — stable consonance
  MAJOR_THIRD:    5 / 4,     // 1.250 — warm harmony
  MINOR_THIRD:    6 / 5,     // 1.200 — tension harmony
  PHI_INTERVAL:   PHI,       // 1.618 — golden interval (unique to Medina)
};

// Dynamic markings (agent intensity levels)
const DYNAMICS = {
  PIANISSIMO:   { level: 0, intensity: PHI_INV * PHI_INV, label: 'pp' },
  PIANO:        { level: 1, intensity: PHI_INV,            label: 'p' },
  MEZZO_PIANO:  { level: 2, intensity: 1.0 / PHI_SQ * PHI, label: 'mp' },
  MEZZO_FORTE:  { level: 3, intensity: 1.0,               label: 'mf' },
  FORTE:        { level: 4, intensity: PHI,                label: 'f' },
  FORTISSIMO:   { level: 5, intensity: PHI_SQ,             label: 'ff' },
  SFORZANDO:    { level: 6, intensity: PHI_CUBE,           label: 'sfz' },
};

// Movement phases (work sections with φ-tempo)
const MOVEMENTS = {
  ADAGIO:       { tempoMultiplier: PHI_INV * PHI_INV, character: 'slow-deliberate' },
  ANDANTE:      { tempoMultiplier: PHI_INV,           character: 'walking-pace' },
  MODERATO:     { tempoMultiplier: 1.0,               character: 'moderate' },
  ALLEGRO:      { tempoMultiplier: PHI,               character: 'fast-bright' },
  PRESTO:       { tempoMultiplier: PHI_SQ,            character: 'very-fast' },
  PRESTISSIMO:  { tempoMultiplier: PHI_CUBE,          character: 'as-fast-as-possible' },
};

// Conductor states
const CONDUCTOR_STATE = {
  TUNING:      'TUNING',       // Agents aligning phases
  UPBEAT:      'UPBEAT',       // Preparatory — about to begin
  CONDUCTING:  'CONDUCTING',   // Active conduction
  FERMATA:     'FERMATA',      // Sustained hold — waiting for resolution
  CAESURA:     'CAESURA',      // Brief silence between movements
  CODA:        'CODA',         // Final concluding passage
  TACET:       'TACET',        // Silent — no active conduction
};

// ══════════════════════════════════════════════════════════════════════════════
//  FOURIER HARMONIC ANALYZER — Decomposes agent activity into harmonics
// ══════════════════════════════════════════════════════════════════════════════

class FourierHarmonicAnalyzer {
  /**
   * Discrete Fourier Transform of agent activity signal
   * f(t) = a₀/2 + Σ(aₙcos(nωt) + bₙsin(nωt))
   *
   * @param {number[]} signal — time-domain signal (agent activity samples)
   * @returns {{ harmonics: object[], fundamental: number, dominantFrequency: number }}
   */
  static analyze(signal) {
    const N = signal.length;
    if (N === 0) return { harmonics: [], fundamental: 0, dominantFrequency: 0 };

    const harmonics = [];
    let maxAmplitude = 0;
    let dominantFrequency = 0;

    // Compute up to N/2 harmonics
    const numHarmonics = Math.floor(N / 2);

    for (let k = 0; k <= numHarmonics; k++) {
      let realPart = 0;  // aₙ coefficient (cosine)
      let imagPart = 0;  // bₙ coefficient (sine)

      for (let n = 0; n < N; n++) {
        const angle = (TAU * k * n) / N;
        realPart += signal[n] * Math.cos(angle);
        imagPart -= signal[n] * Math.sin(angle);
      }

      realPart = (2 * realPart) / N;
      imagPart = (2 * imagPart) / N;

      const amplitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
      const phase = Math.atan2(imagPart, realPart);

      harmonics.push({
        frequency: k,
        amplitude,
        phase,
        real: realPart,
        imaginary: imagPart,
      });

      if (k > 0 && amplitude > maxAmplitude) {
        maxAmplitude = amplitude;
        dominantFrequency = k;
      }
    }

    return {
      harmonics,
      fundamental: harmonics[1]?.amplitude || 0,
      dominantFrequency,
      maxAmplitude,
      dcComponent: harmonics[0]?.real / 2 || 0,
    };
  }

  /**
   * Check if two agent signals are harmonically related
   * (ratio of dominant frequencies approximates a Pythagorean ratio)
   */
  static isConsonant(signalA, signalB, tolerance = 0.05) {
    const analysisA = FourierHarmonicAnalyzer.analyze(signalA);
    const analysisB = FourierHarmonicAnalyzer.analyze(signalB);

    if (analysisA.dominantFrequency === 0 || analysisB.dominantFrequency === 0) {
      return { consonant: false, ratio: 0, interval: 'SILENCE' };
    }

    const ratio = Math.max(analysisA.dominantFrequency, analysisB.dominantFrequency) /
                  Math.min(analysisA.dominantFrequency, analysisB.dominantFrequency);

    // Check against Pythagorean ratios
    for (const [interval, target] of Object.entries(HARMONIC_RATIOS)) {
      if (Math.abs(ratio - target) < tolerance) {
        return { consonant: true, ratio, interval, deviation: Math.abs(ratio - target) };
      }
    }

    return { consonant: false, ratio, interval: 'DISSONANT' };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  DAMPED HARMONIC ENGINE — Models agent recovery from perturbation
// ══════════════════════════════════════════════════════════════════════════════

class DampedHarmonicEngine {
  /**
   * Damped harmonic oscillator: ẍ + 2γẋ + ω₀²x = F(t)/m
   *
   * Models how an agent returns to equilibrium after being disturbed.
   * γ = damping coefficient (how quickly agent recovers)
   * ω₀ = natural frequency (agent's preferred operating frequency)
   */
  constructor(naturalFrequency, dampingRatio) {
    this.omega0 = naturalFrequency || PHI_INV;          // natural frequency
    this.gamma = (dampingRatio || PHI_INV) * this.omega0;  // damping coefficient
    this.position = 0;    // current displacement from equilibrium
    this.velocity = 0;    // current velocity
    this.equilibrium = 0; // target equilibrium position
  }

  /**
   * Apply a perturbation (external force)
   */
  perturb(force) {
    this.velocity += force;
  }

  /**
   * Advance by one timestep using Verlet integration
   * Returns: { position, velocity, energy, recovered }
   */
  step(dt = 0.1) {
    // ẍ = -2γẋ - ω₀²x (unforced)
    const acceleration = -2 * this.gamma * this.velocity - this.omega0 * this.omega0 * this.position;

    // Velocity Verlet integration
    this.position += this.velocity * dt + 0.5 * acceleration * dt * dt;
    const newAcceleration = -2 * this.gamma * this.velocity - this.omega0 * this.omega0 * this.position;
    this.velocity += 0.5 * (acceleration + newAcceleration) * dt;

    // Kinetic + Potential energy
    const kineticEnergy = 0.5 * this.velocity * this.velocity;
    const potentialEnergy = 0.5 * this.omega0 * this.omega0 * this.position * this.position;
    const totalEnergy = kineticEnergy + potentialEnergy;

    return {
      position: this.position,
      velocity: this.velocity,
      energy: totalEnergy,
      recovered: totalEnergy < (PHI_INV * 0.01),  // Energy threshold for "recovered"
    };
  }

  /**
   * Check if oscillator has returned to equilibrium
   */
  isAtRest(threshold) {
    const t = threshold || (PHI_INV * 0.01);
    const energy = 0.5 * this.velocity * this.velocity +
                   0.5 * this.omega0 * this.omega0 * this.position * this.position;
    return energy < t;
  }

  reset() {
    this.position = 0;
    this.velocity = 0;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  RESONANCE DETECTOR — Identifies when agents are maximally aligned
// ══════════════════════════════════════════════════════════════════════════════

class ResonanceDetector {
  constructor() {
    this.history = new Map();    // agentKey → activity samples
    this.maxHistory = 64;       // keep last 64 samples (power of 2 for FFT)
  }

  /**
   * Record an activity sample for an agent
   */
  record(agentKey, value) {
    if (!this.history.has(agentKey)) {
      this.history.set(agentKey, []);
    }
    const samples = this.history.get(agentKey);
    samples.push(value);
    if (samples.length > this.maxHistory) {
      samples.shift();
    }
  }

  /**
   * Detect resonance between two agents
   * Resonance occurs when amplitude peaks at ω = ω₀
   */
  detectResonance(agentA, agentB) {
    const samplesA = this.history.get(agentA) || [];
    const samplesB = this.history.get(agentB) || [];

    if (samplesA.length < 8 || samplesB.length < 8) {
      return { resonant: false, reason: 'insufficient_data' };
    }

    return FourierHarmonicAnalyzer.isConsonant(samplesA, samplesB);
  }

  /**
   * Detect ensemble resonance (all agents)
   * Returns true if majority of agent pairs are consonant
   */
  detectEnsembleResonance() {
    const agents = Array.from(this.history.keys());
    if (agents.length < 2) return { resonant: false, pairs: 0 };

    let consonantPairs = 0;
    let totalPairs = 0;

    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        totalPairs++;
        const result = this.detectResonance(agents[i], agents[j]);
        if (result.consonant) consonantPairs++;
      }
    }

    const resonanceRatio = totalPairs > 0 ? consonantPairs / totalPairs : 0;

    return {
      resonant: resonanceRatio >= EMERGENCE_THRESHOLD,  // φ⁻¹ threshold
      ratio: resonanceRatio,
      consonantPairs,
      totalPairs,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  TEMPO ENGINE — φ-scaled temporal control
// ══════════════════════════════════════════════════════════════════════════════

class TempoEngine {
  constructor(baseTempo) {
    this.baseTempo = baseTempo || HEARTBEAT_MS;
    this.currentMovement = 'MODERATO';
    this.beatNumber = 0;
    this.tempoHistory = [];
  }

  /**
   * Get current effective tempo (ms per beat)
   * tempo = baseTempo / movement.tempoMultiplier
   */
  getCurrentTempo() {
    const movement = MOVEMENTS[this.currentMovement] || MOVEMENTS.MODERATO;
    return this.baseTempo / movement.tempoMultiplier;
  }

  /**
   * Transition to a new movement
   * Tempo changes by φ ratio between adjacent movements
   */
  setMovement(movementName) {
    if (MOVEMENTS[movementName]) {
      this.currentMovement = movementName;
      this.tempoHistory.push({
        movement: movementName,
        tempo: this.getCurrentTempo(),
        beat: this.beatNumber,
        ts: Date.now(),
      });
    }
  }

  /**
   * Advance one beat
   */
  beat() {
    this.beatNumber++;
    return {
      beat: this.beatNumber,
      tempo: this.getCurrentTempo(),
      movement: this.currentMovement,
      character: MOVEMENTS[this.currentMovement]?.character,
    };
  }

  /**
   * Get optimal tempo for given workload
   * Higher workload → faster tempo (up to PRESTO)
   * Uses φ-logarithmic scaling
   */
  adaptTempo(workload) {
    // workload 0..1 maps to ADAGIO..PRESTISSIMO
    const movementKeys = Object.keys(MOVEMENTS);
    const index = Math.min(
      Math.floor(workload * movementKeys.length * PHI_INV + 0.5),
      movementKeys.length - 1
    );
    this.setMovement(movementKeys[Math.max(0, index)]);
    return this.getCurrentTempo();
  }

  getStatus() {
    return {
      baseTempo: this.baseTempo,
      currentTempo: this.getCurrentTempo(),
      movement: this.currentMovement,
      beatNumber: this.beatNumber,
      history: this.tempoHistory.slice(-10),
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALPHA CONDUCTOR — Main class
// ══════════════════════════════════════════════════════════════════════════════

class AlphaConductor {
  /**
   * ALPHA CONDUCTOR — Harmonic synchronization for the Alpha agent ensemble.
   *
   * Self-bootstrapping. Born running. Controls tempo, dynamics, and resonance.
   * Uses Fourier analysis, Pythagorean harmony, damped oscillators, and
   * φ-tempo to maintain coherent multi-agent rhythm.
   *
   * The Conductor ensures agents don't just produce correct output,
   * but produce it at the RIGHT TIME with the RIGHT INTENSITY.
   */
  constructor(config = {}) {
    this.id = `COND-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.state = CONDUCTOR_STATE.TUNING;
    this.beatCount = 0;
    this.cuesGiven = 0;

    // Internal engines
    this.tempo = new TempoEngine(config.baseTempo || HEARTBEAT_MS);
    this.resonance = new ResonanceDetector();
    this.oscillators = new Map();  // agentKey → DampedHarmonicEngine

    // Agent dynamic levels
    this.dynamics = new Map();     // agentKey → current dynamic level
    this.cueQueue = [];            // pending cues [{agentKey, action, timing}]

    // Frustration matrix for Kuramoto (intentional phase offsets — counterpoint)
    this.frustrationMatrix = new Map();  // `${agentA}-${agentB}` → phase offset α

    // Score (the musical score — sequence of events)
    this.score = [];
    this.scorePosition = 0;

    // Performance log
    this.performanceLog = [];

    // Initialize oscillators and dynamics for each Alpha agent
    const ALPHA_AGENTS = {
      THESIS: { naturalFreq: PHI_INV,       damping: PHI_INV },
      CODEX:  { naturalFreq: PHI_INV * PHI, damping: PHI_INV },
      CIVOS:  { naturalFreq: PHI_INV / PHI, damping: 1.0 },
      AURO:   { naturalFreq: 1.0,           damping: PHI_INV },
      ORIGO:  { naturalFreq: PHI_INV * PHI_INV, damping: PHI_INV },
    };

    for (const [key, spec] of Object.entries(ALPHA_AGENTS)) {
      this.oscillators.set(key, new DampedHarmonicEngine(spec.naturalFreq, spec.damping));
      this.dynamics.set(key, DYNAMICS.MEZZO_FORTE);  // Start at mf
    }

    // Set default frustration (counterpoint offsets)
    // THESIS and CODEX operate in counterpoint (offset by golden angle)
    this._setFrustration('THESIS', 'CODEX', GOLDEN_ANGLE);
    // CIVOS operates slightly ahead (governance precedes action)
    this._setFrustration('CIVOS', 'CODEX', PI / PHI);
    this._setFrustration('CIVOS', 'ORIGO', PI / PHI);

    // ★ START HEARTBEAT IMMEDIATELY — self-bootstrapping
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    // Transition to CONDUCTING after initial tuning period
    setTimeout(() => {
      if (this.isAlive) {
        this.state = CONDUCTOR_STATE.CONDUCTING;
        console.log(`🎵 CONDUCTOR ${this.id} — TUNING complete → CONDUCTING`);
      }
    }, HEARTBEAT_MS * 3);  // 3 heartbeats to tune

    console.log(
      `\n🎵 ALPHA CONDUCTOR ${this.id} — ALIVE\n` +
      `   State: ${this.state}\n` +
      `   Tempo: ${this.tempo.getCurrentTempo().toFixed(0)}ms (${this.tempo.currentMovement})\n` +
      `   Harmonics: Fourier decomposition\n` +
      `   Intervals: Pythagorean ratios\n` +
      `   Recovery: Damped harmonic oscillators\n` +
      `   Counterpoint: Kuramoto with frustration\n` +
      `   Emergence: φ⁻¹ = ${EMERGENCE_THRESHOLD.toFixed(8)}\n`
    );
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Advance tempo
      this.tempo.beat();

      // Step all oscillators
      for (const [, osc] of this.oscillators) {
        osc.step(0.1);
      }

      // Process cue queue
      this._processCueQueue();

      // Record activity for resonance detection
      this._sampleActivity();
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Cue an agent — signal it to begin or change behavior
   *
   * @param {string} agentKey — THESIS, CODEX, CIVOS, AURO, ORIGO
   * @param {string} action — 'enter', 'exit', 'crescendo', 'diminuendo', 'accent'
   * @param {object} [options] — { delay, dynamic, movement }
   */
  cue(agentKey, action, options = {}) {
    this.cuesGiven++;

    const cueEvent = {
      id: this.cuesGiven,
      agentKey,
      action,
      options,
      timing: Date.now(),
      beat: this.beatCount,
      movement: this.tempo.currentMovement,
    };

    switch (action) {
      case 'enter':
        this.dynamics.set(agentKey, DYNAMICS[options.dynamic] || DYNAMICS.MEZZO_FORTE);
        this._logPerformance('ENTER', agentKey, options);
        break;

      case 'exit':
        this.dynamics.set(agentKey, DYNAMICS.PIANISSIMO);
        this._logPerformance('EXIT', agentKey, options);
        break;

      case 'crescendo':
        this._crescendo(agentKey, options.target || 'FORTE');
        break;

      case 'diminuendo':
        this._diminuendo(agentKey, options.target || 'PIANO');
        break;

      case 'accent':
        // Brief intensity spike (sforzando)
        const current = this.dynamics.get(agentKey);
        this.dynamics.set(agentKey, DYNAMICS.SFORZANDO);
        // Return to previous after one beat
        this.cueQueue.push({
          agentKey,
          action: 'restore',
          timing: Date.now() + this.tempo.getCurrentTempo(),
          restoreTo: current,
        });
        this._logPerformance('ACCENT', agentKey, { sfz: true });
        break;

      case 'fermata':
        // Hold — sustain current state until released
        this.state = CONDUCTOR_STATE.FERMATA;
        this._logPerformance('FERMATA', agentKey, options);
        break;

      case 'release':
        // Release from fermata
        if (this.state === CONDUCTOR_STATE.FERMATA) {
          this.state = CONDUCTOR_STATE.CONDUCTING;
        }
        this._logPerformance('RELEASE', agentKey, options);
        break;

      default:
        break;
    }

    return cueEvent;
  }

  /**
   * Perturb an agent — introduce a disruption (the conductor will manage recovery)
   * Uses damped harmonic oscillator model
   */
  perturb(agentKey, force) {
    const osc = this.oscillators.get(agentKey);
    if (osc) {
      osc.perturb(force);
      this._logPerformance('PERTURB', agentKey, { force });
    }
    return this.getAgentState(agentKey);
  }

  /**
   * Set the movement (tempo/character) for the ensemble
   */
  setMovement(movementName) {
    this.tempo.setMovement(movementName);
    this._logPerformance('MOVEMENT', 'ALL', { movement: movementName });
    return {
      movement: movementName,
      tempo: this.tempo.getCurrentTempo(),
      character: MOVEMENTS[movementName]?.character,
    };
  }

  /**
   * Check if the ensemble is in harmonic resonance
   */
  checkResonance() {
    return this.resonance.detectEnsembleResonance();
  }

  /**
   * Check if a specific agent has recovered from perturbation
   */
  isRecovered(agentKey) {
    const osc = this.oscillators.get(agentKey);
    return osc ? osc.isAtRest() : true;
  }

  /**
   * Get the harmonic analysis of an agent's recent activity
   */
  analyzeHarmonics(agentKey) {
    const samples = this.resonance.history.get(agentKey) || [];
    if (samples.length < 8) return { error: 'insufficient_data' };
    return FourierHarmonicAnalyzer.analyze(samples);
  }

  /**
   * Check consonance between two agents
   */
  checkConsonance(agentA, agentB) {
    return this.resonance.detectResonance(agentA, agentB);
  }

  /**
   * Get current state of a specific agent from conductor's perspective
   */
  getAgentState(agentKey) {
    const osc = this.oscillators.get(agentKey);
    const dynamic = this.dynamics.get(agentKey) || DYNAMICS.MEZZO_FORTE;

    return {
      agentKey,
      dynamic: dynamic.label,
      intensity: dynamic.intensity,
      oscillator: osc ? {
        position: osc.position,
        velocity: osc.velocity,
        atRest: osc.isAtRest(),
        naturalFrequency: osc.omega0,
      } : null,
      beat: this.beatCount,
      movement: this.tempo.currentMovement,
    };
  }

  /**
   * Compose a score — sequence of timed cues for the ensemble
   *
   * @param {object[]} events — [{ beat, agentKey, action, options }]
   */
  loadScore(events) {
    this.score = events.sort((a, b) => a.beat - b.beat);
    this.scorePosition = 0;
    this._logPerformance('SCORE_LOADED', 'ALL', { events: events.length });
    return { loaded: events.length, firstBeat: events[0]?.beat };
  }

  /**
   * Get full conductor status
   */
  getStatus() {
    const agentStates = {};
    for (const key of this.oscillators.keys()) {
      agentStates[key] = this.getAgentState(key);
    }

    return {
      id: this.id,
      alive: this.isAlive,
      state: this.state,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      cuesGiven: this.cuesGiven,
      tempo: this.tempo.getStatus(),
      resonance: this.resonance.detectEnsembleResonance(),
      agents: agentStates,
      scorePosition: this.scorePosition,
      scoreLength: this.score.length,
    };
  }

  /**
   * Begin CODA — final concluding passage
   */
  coda() {
    this.state = CONDUCTOR_STATE.CODA;
    this.tempo.setMovement('ADAGIO');  // Slow for conclusion

    // Diminuendo all agents
    for (const key of this.oscillators.keys()) {
      this._diminuendo(key, 'PIANISSIMO');
    }

    this._logPerformance('CODA', 'ALL', { finalMovement: 'ADAGIO' });
    return { state: this.state, movement: 'ADAGIO' };
  }

  /**
   * Stop the conductor
   */
  stop() {
    this.isAlive = false;
    this.state = CONDUCTOR_STATE.TACET;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(
      `🎵 ALPHA CONDUCTOR ${this.id} stopped — ` +
      `${this.cuesGiven} cues given over ${this.beatCount} beats`
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  INTERNAL
  // ────────────────────────────────────────────────────────────────────────────

  _crescendo(agentKey, targetDynamic) {
    const target = DYNAMICS[targetDynamic] || DYNAMICS.FORTE;
    this.dynamics.set(agentKey, target);
    this._logPerformance('CRESCENDO', agentKey, { to: target.label });
  }

  _diminuendo(agentKey, targetDynamic) {
    const target = DYNAMICS[targetDynamic] || DYNAMICS.PIANO;
    this.dynamics.set(agentKey, target);
    this._logPerformance('DIMINUENDO', agentKey, { to: target.label });
  }

  _setFrustration(agentA, agentB, offset) {
    this.frustrationMatrix.set(`${agentA}-${agentB}`, offset);
    this.frustrationMatrix.set(`${agentB}-${agentA}`, -offset);
  }

  _processCueQueue() {
    const now = Date.now();
    const remaining = [];

    for (const cue of this.cueQueue) {
      if (cue.timing <= now) {
        if (cue.action === 'restore') {
          this.dynamics.set(cue.agentKey, cue.restoreTo);
        }
      } else {
        remaining.push(cue);
      }
    }

    this.cueQueue = remaining;

    // Process score events at current beat
    while (this.scorePosition < this.score.length) {
      const event = this.score[this.scorePosition];
      if (event.beat <= this.beatCount) {
        this.cue(event.agentKey, event.action, event.options || {});
        this.scorePosition++;
      } else {
        break;
      }
    }
  }

  _sampleActivity() {
    // Record current dynamic intensity for each agent
    for (const [key, dynamic] of this.dynamics) {
      const osc = this.oscillators.get(key);
      const activity = dynamic.intensity + (osc ? Math.abs(osc.position) : 0);
      this.resonance.record(key, activity);
    }
  }

  _logPerformance(event, agentKey, details) {
    this.performanceLog.push({
      event,
      agentKey,
      details,
      beat: this.beatCount,
      ts: Date.now(),
    });

    // Keep only last 2000 entries
    if (this.performanceLog.length > 2000) {
      this.performanceLog = this.performanceLog.slice(-1000);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export {
  AlphaConductor,
  FourierHarmonicAnalyzer,
  DampedHarmonicEngine,
  ResonanceDetector,
  TempoEngine,
  HARMONIC_RATIOS,
  DYNAMICS,
  MOVEMENTS,
  CONDUCTOR_STATE,
  EMERGENCE_THRESHOLD,
  PHI,
  PHI_INV,
  GOLDEN_ANGLE,
  HEARTBEAT_MS,
  FIB,
};

export default AlphaConductor;
