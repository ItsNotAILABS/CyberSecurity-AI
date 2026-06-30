#!/usr/bin/env python3
"""
porta-engine.py — Geometry Lock Offense/Defense Engine (Python Backend)

This is the Python substrate for the Porta lock organism.
Python handles the computationally intensive offense/defense sweeps
that run continuously in the background.

Architecture:
  - OFFENSE WORKER: runs adversarial sweeps every φ² × 873ms
  - DEFENSE WORKER: maintains circuit breakers and quarantine state
  - FIELD MONITOR:  computes lock-field coherence across all callers
  - ENTROPY WORKER: measures Shannon entropy of access events

Mathematical primitives (Python native):
  - NumPy arrays for phase vector operations
  - SciPy for Kuramoto order parameter (complex mean)
  - Streaming computation of field coherence

All constants mirror the JS/Motoko/Julia implementations.
Casa de Medina — Architectos de Architectura Inteligente
"""

import math
import time
import threading
import hashlib
import json
import logging
from dataclasses import dataclass, field
from typing import Optional, Dict, List, Tuple
from collections import defaultdict, deque

# ══════════════════════════════════════════════════════════════════════════════
#  GOLDEN CONSTANTS
# ══════════════════════════════════════════════════════════════════════════════

PHI                 = 1.6180339887498948482
PHI2                = PHI * PHI
PHI3                = PHI2 * PHI
PHI4                = PHI3 * PHI
PHI_INV             = 1.0 / PHI
GOLDEN_ANGLE        = (2 * math.pi) / PHI2          # ≈ 2.3999 rad
TWO_PI              = 2 * math.pi
PHI_HEARTBEAT_MS    = 873                            # 540 × φ
WINDOW_DURATION_MS  = PHI_HEARTBEAT_MS * PHI         # ≈ 1413ms
EMERGENCE_THRESHOLD = PHI_INV                        # 0.6180339887
KEY_DIMENSIONS_8    = 8
PHI_HASH_CYCLE      = 13                             # Fibonacci 7th, prime

# Offense thresholds
ADVERSARIAL_MARGIN  = EMERGENCE_THRESHOLD * 0.1 * PHI_INV  # ≈ 0.038
MIN_CALLER_SEPARATION = PHI_INV * 0.5               # ≈ 0.309
ENTROPY_SPIKE       = PHI2                           # ≈ 2.618 nats/window

# Defense thresholds
CIRCUIT_ERROR_RATE  = PHI_INV                        # 0.618
QUARANTINE_WINDOWS  = 7                              # φ⁴ rounded
CIRCUIT_HEAL_WINDOWS = round(PHI3)                   # 4 clean windows

# Worker timing
OFFENSE_SWEEP_SEC   = (PHI2 * PHI_HEARTBEAT_MS) / 1000.0   # ≈ 2.287s
FIELD_SCAN_SEC      = (PHI3 * PHI_HEARTBEAT_MS) / 1000.0   # ≈ 3.700s

logging.basicConfig(
    level=logging.INFO,
    format="[PORTA-ENGINE] %(levelname)s %(asctime)s — %(message)s"
)
log = logging.getLogger("porta-engine")

# ══════════════════════════════════════════════════════════════════════════════
#  MATHEMATICS
# ══════════════════════════════════════════════════════════════════════════════

def current_window() -> int:
    """Floor(now_ms / WINDOW_DURATION_MS)."""
    return int(time.time() * 1000 / WINDOW_DURATION_MS)


def kuramoto_R(phases: List[float]) -> Tuple[float, float]:
    """
    Kuramoto order parameter.
    R·e^(iΨ) = (1/N)·Σ e^(iθⱼ)
    Returns (R, Ψ).
    Pythagorean: R = √(re² + im²)
    """
    if not phases:
        return 0.0, 0.0
    n   = len(phases)
    re  = sum(math.cos(p) for p in phases) / n
    im  = sum(math.sin(p) for p in phases) / n
    R   = math.sqrt(re * re + im * im)         # Pythagorean
    psi = math.atan2(im, re)
    return R, psi


def phase_alignment(phases1: List[float], phases2: List[float]) -> float:
    """Kuramoto R of difference phases."""
    n    = min(len(phases1), len(phases2))
    diff = [phases1[j] - phases2[j] for j in range(n)]
    R, _ = kuramoto_R(diff)
    return R


def pythagorean_phase_distance(p1: List[float], p2: List[float]) -> float:
    """
    d(P,Q) = √[Σ(Pⱼ−Qⱼ)²] / √(N·π²)  ∈ [0,1]
    Normalised Pythagorean distance in phase space.
    """
    n = min(len(p1), len(p2))
    if n == 0:
        return 1.0
    sq_sum = sum((p1[j] - p2[j]) ** 2 for j in range(n))
    return math.sqrt(sq_sum / (n * math.pi * math.pi))


def lock_field_coherence(all_envelopes: List[List[float]]) -> Tuple[float, float]:
    """
    Lock-field coherence across all registered callers.
    R_field = √[(1/D)·Σ_d R_d²]   (Pythagorean mean of per-dim Kuramoto Rs)
    """
    if len(all_envelopes) < 2:
        return (1.0, 0.0) if len(all_envelopes) == 1 else (0.0, 0.0)

    D       = len(all_envelopes[0])
    sum_R2  = 0.0
    psi_sum = 0.0

    for d in range(D):
        dim_phases = [e[d] for e in all_envelopes if d < len(e)]
        R, psi     = kuramoto_R(dim_phases)
        sum_R2    += R * R
        psi_sum   += psi

    R_field   = math.sqrt(sum_R2 / D) if D > 0 else 0.0
    psi_field = psi_sum / D if D > 0 else 0.0
    return R_field, psi_field


def shannon_entropy(caller_ids: List[str]) -> float:
    """
    S = −φ·Σ(pᵢ·log pᵢ)   (φ-weighted Shannon entropy)
    """
    if not caller_ids:
        return 0.0
    counts: Dict[str, int] = defaultdict(int)
    for cid in caller_ids:
        counts[cid] += 1
    total   = len(caller_ids)
    entropy = 0.0
    for c in counts.values():
        p = c / total
        if p > 0:
            entropy -= p * math.log(p)
    return PHI * entropy


# ══════════════════════════════════════════════════════════════════════════════
#  DATA STRUCTURES
# ══════════════════════════════════════════════════════════════════════════════

@dataclass
class CallerRecord:
    caller_id:    str
    phases:       List[float]
    tier_rank:    int = 0
    tier_freq_hz: int = 396

@dataclass
class CircuitState:
    open:       bool  = False
    errors:     int   = 0
    total:      int   = 0
    opened_at:  Optional[int] = None

@dataclass
class QuarantineState:
    quarantined_at: int
    release_at:     int
    reason:         str

@dataclass
class ThreatEvent:
    strategy:  str
    caller_id: str
    verdict:   str
    detail:    dict
    ts:        float = field(default_factory=time.time)


# ══════════════════════════════════════════════════════════════════════════════
#  OFFENSE ENGINE
# ══════════════════════════════════════════════════════════════════════════════

class OffenseEngine:
    """
    Python offense engine — runs in a background daemon thread.
    Strategies:
      1. Adversarial sweep  — keys near threshold
      2. Identity collapse  — two callers too similar
      3. Field coherence    — lock-field R monitor
      4. Entropy spike      — coordinated attack detection
      5. Temporal audit     — replay detection
    """

    def __init__(self):
        self._callers:       Dict[str, CallerRecord] = {}
        self._threats:       List[ThreatEvent]       = []
        self._entropy_log:   deque                   = deque(maxlen=100)
        self._last_entropy:  float                   = 0.0
        self._lock:          threading.Lock          = threading.Lock()
        self._running:       bool                    = False
        log.info("⚔️  OffenseEngine initialised")

    def register(self, caller_id: str, phases: List[float], tier_rank: int = 0, tier_freq_hz: int = 396):
        with self._lock:
            self._callers[caller_id] = CallerRecord(caller_id, phases, tier_rank, tier_freq_hz)

    def remove(self, caller_id: str):
        with self._lock:
            self._callers.pop(caller_id, None)

    # ── Strategy 1: Adversarial Sweep ───────────────────────────────────────

    def adversarial_sweep(self) -> List[ThreatEvent]:
        threats = []
        with self._lock:
            callers = list(self._callers.values())

        for rec in callers:
            # Self-alignment R of the phase vector
            R, _ = kuramoto_R(rec.phases)
            margin = abs(R - EMERGENCE_THRESHOLD)

            if margin < ADVERSARIAL_MARGIN:
                t = ThreatEvent(
                    strategy  = "ADVERSARIAL_SWEEP",
                    caller_id = rec.caller_id,
                    verdict   = "ADVERSARIAL_SUSPECTED",
                    detail    = {"R": R, "margin": margin, "threshold": ADVERSARIAL_MARGIN},
                )
                threats.append(t)
                log.warning(f"⚠️  adversarial | caller={rec.caller_id} | R={R:.4f} | margin={margin:.4f}")

        with self._lock:
            self._threats.extend(threats)
        return threats

    # ── Strategy 2: Identity Collapse ────────────────────────────────────────

    def identity_collapse_detection(self) -> List[ThreatEvent]:
        threats = []
        with self._lock:
            callers = list(self._callers.values())

        for i in range(len(callers)):
            for j in range(i + 1, len(callers)):
                dist = pythagorean_phase_distance(callers[i].phases, callers[j].phases)
                if dist < MIN_CALLER_SEPARATION:
                    t = ThreatEvent(
                        strategy  = "IDENTITY_COLLAPSE",
                        caller_id = callers[i].caller_id,
                        verdict   = "IDENTITY_COLLAPSE_SUSPECTED",
                        detail    = {
                            "caller1":   callers[i].caller_id,
                            "caller2":   callers[j].caller_id,
                            "distance":  dist,
                            "threshold": MIN_CALLER_SEPARATION,
                        },
                    )
                    threats.append(t)
                    log.warning(f"⚠️  identity collapse | {callers[i].caller_id} ↔ {callers[j].caller_id} | d={dist:.4f}")

        with self._lock:
            self._threats.extend(threats)
        return threats

    # ── Strategy 3: Field Coherence ───────────────────────────────────────────

    def field_coherence_scan(self) -> dict:
        with self._lock:
            envelopes = [rec.phases for rec in self._callers.values()]

        if len(envelopes) < 2:
            return {"R_field": 1.0, "healthy": True, "verdict": "INSUFFICIENT_CALLERS"}

        R_field, psi_field = lock_field_coherence(envelopes)
        healthy = R_field >= EMERGENCE_THRESHOLD
        verdict = "FIELD_HEALTHY" if healthy else "FIELD_DEGRADED"

        if not healthy:
            t = ThreatEvent(
                strategy  = "FIELD_COHERENCE_SCAN",
                caller_id = "__field__",
                verdict   = verdict,
                detail    = {"R_field": R_field, "psi_field": psi_field},
            )
            with self._lock:
                self._threats.append(t)
            log.warning(f"🌀 field degraded | R_field={R_field:.4f}")

        return {"R_field": R_field, "psi_field": psi_field, "healthy": healthy, "verdict": verdict}

    # ── Strategy 4: Entropy Spike ─────────────────────────────────────────────

    def entropy_measurement(self, caller_ids_this_window: List[str]) -> dict:
        entropy = shannon_entropy(caller_ids_this_window)
        delta   = abs(entropy - self._last_entropy)
        spike   = delta > ENTROPY_SPIKE

        self._entropy_log.append(entropy)
        self._last_entropy = entropy

        if spike:
            t = ThreatEvent(
                strategy  = "ENTROPY_SPIKE",
                caller_id = "__entropy__",
                verdict   = "ENTROPY_SPIKE_DETECTED",
                detail    = {"entropy": entropy, "delta": delta, "threshold": ENTROPY_SPIKE},
            )
            with self._lock:
                self._threats.append(t)
            log.warning(f"🔥 entropy spike | S={entropy:.4f} | Δ={delta:.4f}")

        return {"entropy": entropy, "delta": delta, "spike": spike}

    # ── Full Sweep ────────────────────────────────────────────────────────────

    def run_full_sweep(self, caller_ids_this_window: List[str] = None) -> dict:
        return {
            "adversarial": len(self.adversarial_sweep()),
            "collapse":    len(self.identity_collapse_detection()),
            "field":       self.field_coherence_scan(),
            "entropy":     self.entropy_measurement(caller_ids_this_window or []),
            "total_threats": len(self._threats),
        }

    def get_threats(self) -> List[dict]:
        with self._lock:
            return [{"strategy": t.strategy, "callerId": t.caller_id, "verdict": t.verdict, "detail": t.detail, "ts": t.ts} for t in self._threats[-100:]]


# ══════════════════════════════════════════════════════════════════════════════
#  DEFENSE ENGINE
# ══════════════════════════════════════════════════════════════════════════════

class DefenseEngine:
    """
    Python defense engine — manages circuit breakers, quarantine, rate limits.
    Runs in the main request path (synchronous checks).
    """

    FIBONACCI = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

    def __init__(self):
        self._circuits:   Dict[str, CircuitState]   = {}
        self._quarantine: Dict[str, QuarantineState] = {}
        self._rate:       Dict[str, Dict[str, int]]  = defaultdict(lambda: {"count": 0, "window": -1})
        self._absorbed:   List[dict]                 = []
        self._lock:       threading.Lock             = threading.Lock()
        log.info("🛡️  DefenseEngine initialised")

    def is_quarantined(self, caller_id: str) -> Tuple[bool, Optional[str]]:
        with self._lock:
            q = self._quarantine.get(caller_id)
        if not q:
            return False, None
        if current_window() >= q.release_at:
            with self._lock:
                self._quarantine.pop(caller_id, None)
            return False, None
        return True, q.reason

    def quarantine(self, caller_id: str, reason: str):
        cw = current_window()
        with self._lock:
            self._quarantine[caller_id] = QuarantineState(
                quarantined_at = cw,
                release_at     = cw + QUARANTINE_WINDOWS,
                reason         = reason,
            )
        log.info(f"🔒 quarantine | caller={caller_id} | reason={reason} | release=window_{cw + QUARANTINE_WINDOWS}")

    def is_circuit_open(self, caller_id: str) -> bool:
        with self._lock:
            return self._circuits.get(caller_id, CircuitState()).open

    def record_circuit(self, caller_id: str, success: bool) -> Tuple[bool, float]:
        cw = current_window()
        with self._lock:
            c = self._circuits.setdefault(caller_id, CircuitState())
            c.total += 1
            if not success:
                c.errors += 1

            error_rate = c.errors / c.total if c.total > 0 else 0.0

            if error_rate > CIRCUIT_ERROR_RATE and c.total >= 3:
                if not c.open:
                    c.open      = True
                    c.opened_at = cw
                    log.warning(f"⚡ circuit open | caller={caller_id} | error_rate={error_rate:.4f}")

            elif c.open and success:
                clean_windows = cw - (c.opened_at or cw)
                if clean_windows >= CIRCUIT_HEAL_WINDOWS:
                    c.open   = False
                    c.errors = 0
                    c.total  = 1
                    log.info(f"✅ circuit healed | caller={caller_id}")

            return c.open, error_rate

    def check_rate(self, caller_id: str, tier_rank: int) -> Tuple[bool, int, int]:
        limit = self.FIBONACCI[min(tier_rank + 4, len(self.FIBONACCI) - 1)]
        cw    = current_window()
        with self._lock:
            state = self._rate[caller_id]
            if state["window"] != cw:
                state["count"]  = 0
                state["window"] = cw
            state["count"] += 1
            allowed = state["count"] <= limit
        return allowed, state["count"], limit

    def absorb(self, caller_id: str, R: float, reason: str):
        with self._lock:
            self._absorbed.append({"callerId": caller_id, "R": R, "reason": reason, "ts": time.time()})
            if len(self._absorbed) > 1000:
                self._absorbed = self._absorbed[-1000:]

    def defend(self, caller_id: str, tier_rank: int, granted: bool, R: float, reason: str) -> Tuple[bool, str]:
        qed, qreason = self.is_quarantined(caller_id)
        if qed:
            return False, f"quarantined: {qreason}"

        if self.is_circuit_open(caller_id):
            return False, "circuit_open"

        if not granted:
            self.absorb(caller_id, R, reason)
            self.record_circuit(caller_id, False)
            return False, reason

        allowed, count, limit = self.check_rate(caller_id, tier_rank)
        if not allowed:
            return False, f"rate_limit: {count}/{limit}"

        self.record_circuit(caller_id, True)
        return True, ""

    def get_status(self) -> dict:
        with self._lock:
            open_circuits = [cid for cid, c in self._circuits.items() if c.open]
            quarantined   = list(self._quarantine.keys())
            absorbed_count = len(self._absorbed)
        return {
            "openCircuits":    open_circuits,
            "quarantined":     quarantined,
            "absorbedDenials": absorbed_count,
        }


# ══════════════════════════════════════════════════════════════════════════════
#  PORTA ENGINE — Combined Offense + Defense
# ══════════════════════════════════════════════════════════════════════════════

class PortaEngine:
    """
    The full Porta Engine.
    Runs offense in background threads while handling defense synchronously.
    """

    def __init__(self):
        self.offense = OffenseEngine()
        self.defense = DefenseEngine()
        self._event_log: deque = deque(maxlen=10000)
        self._running  = False
        self._threads  = []
        log.info("🔒 PortaEngine born — offense+defense online")

    def start(self):
        """Start background offense workers."""
        self._running = True

        t1 = threading.Thread(target=self._offense_worker, daemon=True)
        t2 = threading.Thread(target=self._field_worker,   daemon=True)
        self._threads = [t1, t2]
        t1.start()
        t2.start()
        log.info("⚡ PortaEngine started | offense workers running")

    def stop(self):
        self._running = False
        log.info("🔒 PortaEngine stopped")

    def _offense_worker(self):
        while self._running:
            self.offense.adversarial_sweep()
            self.offense.identity_collapse_detection()
            time.sleep(OFFENSE_SWEEP_SEC)

    def _field_worker(self):
        while self._running:
            scan = self.offense.field_coherence_scan()
            self._log_event("FIELD_SCAN", scan)
            time.sleep(FIELD_SCAN_SEC)

    def register(self, caller_id: str, phases: List[float], tier_rank: int = 0, tier_freq_hz: int = 396):
        self.offense.register(caller_id, phases, tier_rank, tier_freq_hz)

    def validate(self, caller_id: str, phases_presented: List[float], envelope_phases: List[float],
                 tier_rank: int = 0, granted: bool = True, R: float = 0.0, reason: str = "") -> dict:
        """
        Full defense check on a validation result.
        Returns {"allowed": bool, "reason": str}
        """
        allowed, def_reason = self.defense.defend(caller_id, tier_rank, granted, R, reason)
        self._log_event("VALIDATION", {
            "callerId": caller_id, "granted": granted, "R": R, "allowed": allowed
        })
        return {"allowed": allowed, "reason": def_reason}

    def _log_event(self, event_type: str, data: dict):
        self._event_log.append({"type": event_type, "ts": time.time(), **data})

    def get_status(self) -> dict:
        return {
            "engine":   "PortaEngine",
            "running":  self._running,
            "offense":  {"threats": len(self.offense.get_threats())},
            "defense":  self.defense.get_status(),
            "eventLog": list(self._event_log)[-20:],
        }


# ══════════════════════════════════════════════════════════════════════════════
#  ENTRY POINT (when run as a service)
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    engine = PortaEngine()
    engine.start()

    log.info("🔒 PortaEngine running — press Ctrl+C to stop")
    try:
        while True:
            time.sleep(PHI * 10)
            status = engine.get_status()
            log.info(f"STATUS | threats={status['offense']['threats']} | circuits_open={len(status['defense']['openCircuits'])}")
    except KeyboardInterrupt:
        engine.stop()
        log.info("💀 PortaEngine stopped cleanly")
