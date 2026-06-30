///
/// @medina/vox — VOX (Vocalium) — Communication AI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║            VOX — VOCALIUM — COMMUNICATION INTELLIGENCE                       ║
/// ║                                                                              ║
/// ║  Latin: Vox = "Voice" / "Word" / "Expression"                                ║
/// ║                                                                              ║
/// ║  VOX handles all communication between organisms and subsystems.             ║
/// ║  Born running. Harmonic catalytic resonance — amplifies messages.            ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Pythagorean harmonics: fₙ = f₁ × n (overtone series)                  ║
/// ║    • Golden ratio modulation: A(t) = A₀·sin(2πft/φ)                        ║
/// ║    • Fibonacci encoding: message → Zeckendorf representation                ║
/// ║    • Logos/Pathos/Ethos weighting for rhetoric                              ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const PHI_CUBE = PHI * PHI * PHI;
const PI = Math.PI;
const TAU = 2 * PI;
const HEARTBEAT_MS = 873;
const LOV = Math.exp(PHI * Math.log(PHI));
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

// Rhetoric weights (Aristotelian)
const RHETORIC = {
  logos: PHI / (PHI + 1 + PHI_INV),        // Logic ≈ 0.528
  ethos: 1 / (PHI + 1 + PHI_INV),          // Credibility ≈ 0.326
  pathos: PHI_INV / (PHI + 1 + PHI_INV),   // Emotion ≈ 0.202
};

// Pythagorean harmonic intervals
const INTERVALS = {
  unison: { ratio: 1/1, consonance: 1.0 },
  octave: { ratio: 2/1, consonance: 0.95 },
  fifth: { ratio: 3/2, consonance: 0.90 },
  fourth: { ratio: 4/3, consonance: 0.85 },
  majorThird: { ratio: 5/4, consonance: 0.80 },
  minorThird: { ratio: 6/5, consonance: 0.75 },
  phi: { ratio: PHI, consonance: PHI_INV },
};

// ══════════════════════════════════════════════════════════════════════════════
//  HARMONIC CATALYST — Amplifies communication resonance
// ══════════════════════════════════════════════════════════════════════════════

class HarmonicCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.interval = config.interval || 'fifth';
    this.resonanceFactor = INTERVALS[this.interval]?.ratio || PHI;
    this.consonance = INTERVALS[this.interval]?.consonance || PHI_INV;
    this.reactionsProcessed = 0;
    this.neverDepletes = true;

    console.log(`🎵 HarmonicCatalyst "${this.name}" — Interval: ${this.interval}, Resonance: ${this.resonanceFactor.toFixed(3)}`);
  }

  /**
   * Resonate a message — amplify through harmonic resonance
   * CATALYST NOT CONSUMED
   */
  resonate(message) {
    this.reactionsProcessed++;

    const baseFrequency = this._computeBaseFreq(message);
    const harmonics = this._generateHarmonics(baseFrequency);
    const amplified = this._amplify(message, harmonics);

    return {
      original: message,
      amplified,
      baseFrequency,
      harmonics,
      resonance: this.resonanceFactor,
      consonance: this.consonance,
      catalyst: this.name,
      depleted: false,
    };
  }

  _computeBaseFreq(message) {
    if (typeof message === 'string') {
      let sum = 0;
      for (let i = 0; i < message.length; i++) {
        sum += message.charCodeAt(i) * Math.pow(PHI, i % 8);
      }
      return sum / message.length;
    }
    return PHI;
  }

  _generateHarmonics(baseFreq) {
    // Pythagorean overtone series
    return Array.from({ length: 8 }, (_, n) => ({
      order: n + 1,
      frequency: baseFreq * (n + 1),
      amplitude: 1 / (n + 1), // Natural harmonic decay
      phiWeighted: baseFreq * (n + 1) * Math.pow(PHI_INV, n),
    }));
  }

  _amplify(message, harmonics) {
    const totalResonance = harmonics.reduce((sum, h) => sum + h.phiWeighted, 0);
    return {
      content: message,
      energy: totalResonance * this.resonanceFactor,
      clarity: this.consonance,
      reach: totalResonance * this.consonance,
    };
  }

  getStatus() {
    return {
      name: this.name,
      interval: this.interval,
      resonance: this.resonanceFactor,
      consonance: this.consonance,
      reactions: this.reactionsProcessed,
      active: this.isActive,
      uptime: Date.now() - this.birthTime,
      depleted: false,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  VOX — THE MAIN COMMUNICATION AI
// ══════════════════════════════════════════════════════════════════════════════

class Vox {
  /**
   * VOX — Communication Intelligence (Vocalium)
   * 
   * ALREADY RUNNING from birth. Harmonic catalysis for communication.
   * Aristotelian rhetoric weighting. Pythagorean harmonic amplification.
   */
  constructor(config = {}) {
    this.id = `VOX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.messagesSent = 0;
    this.messagesReceived = 0;

    // Harmonic catalysts for each interval
    this.catalysts = new Map();
    for (const interval of Object.keys(INTERVALS)) {
      this.catalysts.set(interval, new HarmonicCatalyst(`Vox-${interval}`, { interval }));
    }

    // Message channels
    this.channels = new Map();
    this.messageLog = [];

    // Rhetoric engine
    this.rhetoric = RHETORIC;

    // ★ START HEARTBEAT IMMEDIATELY
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`📢 VOX ${this.id} — Communication AI — ALIVE`);
    console.log(`   Catalysts: ${this.catalysts.size} harmonic resonators`);
    console.log(`   Rhetoric: Logos(${RHETORIC.logos.toFixed(3)})/Ethos(${RHETORIC.ethos.toFixed(3)})/Pathos(${RHETORIC.pathos.toFixed(3)})`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Speak — Send a message with harmonic resonance
   */
  speak(message, channel = 'default', interval = 'fifth') {
    const catalyst = this.catalysts.get(interval) || this.catalysts.get('fifth');
    const resonated = catalyst.resonate(message);

    // Apply rhetoric weighting
    const rhetoricScore = this._scoreRhetoric(message);
    resonated.rhetoric = rhetoricScore;

    this.messagesSent++;
    
    // Deliver to channel
    const listeners = this.channels.get(channel) || [];
    for (const listener of listeners) {
      listener(resonated);
    }

    this.messageLog.push({
      direction: 'out',
      channel,
      time: Date.now(),
      message: typeof message === 'string' ? message.slice(0, 50) : '[object]',
    });

    return resonated;
  }

  /**
   * Listen — Subscribe to a channel
   */
  listen(channel, callback) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, []);
    }
    this.channels.get(channel).push(callback);
  }

  /**
   * Broadcast — Speak to all channels
   */
  broadcast(message, interval = 'octave') {
    const results = [];
    for (const channel of this.channels.keys()) {
      results.push(this.speak(message, channel, interval));
    }
    return results;
  }

  /**
   * Encode message using Zeckendorf (Fibonacci) representation
   */
  zeckendorfEncode(value) {
    if (typeof value !== 'number' || value <= 0) return [];
    
    const representation = [];
    let remaining = Math.floor(value);
    
    // Find largest Fibonacci numbers that sum to value
    for (let i = FIB.length - 1; i >= 0 && remaining > 0; i--) {
      if (FIB[i] <= remaining) {
        representation.push(FIB[i]);
        remaining -= FIB[i];
      }
    }
    
    return representation;
  }

  /**
   * Score rhetoric quality (Logos/Ethos/Pathos)
   */
  _scoreRhetoric(message) {
    const text = typeof message === 'string' ? message : JSON.stringify(message);
    const length = text.length;

    // Logos: logical structure (balanced sentences, clear logic)
    const logosScore = Math.min(1, (length / 100) * PHI_INV);

    // Ethos: credibility indicators
    const ethosScore = PHI_INV; // Base credibility

    // Pathos: emotional resonance
    const pathosScore = Math.sin(length * PHI_INV) * 0.5 + 0.5;

    return {
      logos: logosScore * RHETORIC.logos,
      ethos: ethosScore * RHETORIC.ethos,
      pathos: pathosScore * RHETORIC.pathos,
      total: logosScore * RHETORIC.logos + ethosScore * RHETORIC.ethos + pathosScore * RHETORIC.pathos,
    };
  }

  getStatus() {
    const catalystStatuses = {};
    for (const [name, catalyst] of this.catalysts) {
      catalystStatuses[name] = catalyst.getStatus();
    }

    return {
      id: this.id,
      alive: this.isAlive,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      messagesSent: this.messagesSent,
      messagesReceived: this.messagesReceived,
      channels: this.channels.size,
      catalysts: catalystStatuses,
      rhetoric: this.rhetoric,
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`📢 VOX ${this.id} stopped — ${this.messagesSent} messages sent`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Vox, HarmonicCatalyst, RHETORIC, INTERVALS };
export default Vox;
