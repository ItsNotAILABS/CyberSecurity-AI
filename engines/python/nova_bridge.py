#!/usr/bin/env python3
"""
NOVA Python Bridge — Integration layer between Julia engines and Python services

Provides:
- BiologicalHeart bridge (873ms φ-heartbeat)
- MEDINA SDK integration
- Inter-process communication with Julia engines
- WebSocket/HTTP API for real-time engine access
"""

import asyncio
import json
import subprocess
import time
import math
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict

# Golden ratio constants
PHI = (1 + math.sqrt(5)) / 2
PHI2 = PHI * PHI
PHI3 = PHI2 * PHI
PHI4 = PHI3 * PHI

# Ancient calendar cycles (milliseconds)
MAYAN_CYCLE = 1440.0
SUMERIAN_HOUR = 3600.0
EGYPTIAN_HOUR = 2160.0
LUNAR_CYCLE = 2551.0
SOLAR_CYCLE = 8760.0
PHI_HEARTBEAT = 873.0  # 540 * φ


@dataclass
class EngineRequest:
    """Request to Julia engine"""
    engine: str  # "law", "pipeline", "organism", "governance"
    command: str
    params: Dict[str, Any]
    request_id: str
    timestamp_ms: float


@dataclass
class EngineResponse:
    """Response from Julia engine"""
    request_id: str
    success: bool
    data: Any
    error: Optional[str]
    execution_time_ms: float
    biorhythm: float


class BiologicalHeart:
    """
    φ-derived biological heartbeat (873ms)

    Beats at golden ratio intervals: φ^i × 873ms
    - Primary: 873ms (φ⁰)
    - Secondary: 1413ms (φ¹ × 873)
    - Tertiary: 2286ms (φ² × 873)
    """

    def __init__(self, organism_id: str):
        self.organism_id = organism_id
        self.beat_count = 0
        self.start_time = time.time() * 1000.0
        self.is_beating = False
        self._beat_callbacks = []

    def start(self):
        """Start heartbeat (self-bootstrapping)"""
        self.is_beating = True
        asyncio.create_task(self._beat_loop())

    async def _beat_loop(self):
        """Main heartbeat loop"""
        while self.is_beating:
            # Calculate next beat interval using φ-series
            phi_cycle = self.beat_count % 5
            interval_ms = PHI_HEARTBEAT * (PHI ** phi_cycle)

            await asyncio.sleep(interval_ms / 1000.0)

            self.beat_count += 1
            current_time_ms = time.time() * 1000.0

            # Calculate biorhythm
            biorhythm = calculate_biorhythm(current_time_ms)

            # Invoke callbacks
            for callback in self._beat_callbacks:
                try:
                    await callback(self.beat_count, current_time_ms, biorhythm)
                except Exception as e:
                    print(f"Heart beat callback error: {e}")

    def on_beat(self, callback):
        """Register callback for heartbeat"""
        self._beat_callbacks.append(callback)

    def stop(self):
        """Stop heartbeat"""
        self.is_beating = False


def calculate_biorhythm(timestamp_ms: float) -> float:
    """
    Calculate biorhythm using 6 ancient calendar cycles

    Combines: Mayan, Sumerian, Egyptian, Lunar, Solar, φ-heartbeat
    Using Pythagorean sum: sqrt(Σ(wave²)) / sqrt(6)
    """

    # Calculate phases for each cycle
    mayan_phase = (timestamp_ms % MAYAN_CYCLE) / MAYAN_CYCLE
    sumerian_phase = (timestamp_ms % SUMERIAN_HOUR) / SUMERIAN_HOUR
    egyptian_phase = (timestamp_ms % EGYPTIAN_HOUR) / EGYPTIAN_HOUR
    lunar_phase = (timestamp_ms % LUNAR_CYCLE) / LUNAR_CYCLE
    solar_phase = (timestamp_ms % SOLAR_CYCLE) / SOLAR_CYCLE
    phi_phase = (timestamp_ms % PHI_HEARTBEAT) / PHI_HEARTBEAT

    # Convert to sine waves (0 to 2π)
    mayan_wave = math.sin(2 * math.pi * mayan_phase)
    sumerian_wave = math.sin(2 * math.pi * sumerian_phase)
    egyptian_wave = math.sin(2 * math.pi * egyptian_phase)
    lunar_wave = math.sin(2 * math.pi * lunar_phase)
    solar_wave = math.sin(2 * math.pi * solar_phase)
    phi_wave = math.sin(2 * math.pi * phi_phase)

    # Pythagorean combination
    pythagorean_sum = math.sqrt(
        mayan_wave**2 +
        sumerian_wave**2 +
        egyptian_wave**2 +
        lunar_wave**2 +
        solar_wave**2 +
        phi_wave**2
    ) / math.sqrt(6.0)

    # φ-weight the result
    phi_weighted = pythagorean_sum * PHI / (PHI + 1.0)

    # Normalize to 0-1
    return (phi_weighted + 1.0) / 2.0


class JuliaEngineClient:
    """
    Client for Julia mathematical engines

    Executes Julia engine CLI and parses JSON responses
    """

    def __init__(self, engine_path: str = "/home/runner/work/NATIVE-NOVA-PROTOCOL/NATIVE-NOVA-PROTOCOL/engines/julia/nova-engine"):
        self.engine_path = engine_path

    async def execute(self, request: EngineRequest) -> EngineResponse:
        """Execute engine command"""
        start_time = time.time() * 1000.0

        try:
            # Build command
            cmd = [self.engine_path, request.engine, request.command]

            # Add parameters
            for key, value in request.params.items():
                cmd.append(f"--{key}")
                if isinstance(value, dict) or isinstance(value, list):
                    cmd.append(json.dumps(value))
                else:
                    cmd.append(str(value))

            # Execute
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            execution_time = time.time() * 1000.0 - start_time
            biorhythm = calculate_biorhythm(time.time() * 1000.0)

            if process.returncode == 0:
                # Parse JSON from output
                output = stdout.decode()

                # Extract JSON (usually at the end after "JSON Output:")
                if "JSON Output:" in output:
                    json_start = output.rfind("{")
                    json_str = output[json_start:]
                    data = json.loads(json_str)
                else:
                    data = {"output": output}

                return EngineResponse(
                    request_id=request.request_id,
                    success=True,
                    data=data,
                    error=None,
                    execution_time_ms=execution_time,
                    biorhythm=biorhythm
                )
            else:
                error_msg = stderr.decode()
                return EngineResponse(
                    request_id=request.request_id,
                    success=False,
                    data=None,
                    error=error_msg,
                    execution_time_ms=execution_time,
                    biorhythm=biorhythm
                )

        except Exception as e:
            execution_time = time.time() * 1000.0 - start_time
            biorhythm = calculate_biorhythm(time.time() * 1000.0)

            return EngineResponse(
                request_id=request.request_id,
                success=False,
                data=None,
                error=str(e),
                execution_time_ms=execution_time,
                biorhythm=biorhythm
            )


class NOVAOrganismRuntime:
    """
    NOVA Organism Runtime with BiologicalHeart

    Self-bootstrapping organism that comes alive on creation
    """

    def __init__(self, organism_id: str, capabilities: List[str]):
        self.organism_id = organism_id
        self.capabilities = capabilities
        self.heart = BiologicalHeart(organism_id)
        self.engine_client = JuliaEngineClient()
        self.cil_log = []  # Cognitive Internal Language log

        # Start heartbeat immediately (self-bootstrapping)
        self.heart.start()
        self.heart.on_beat(self._on_heartbeat)

        print(f"✓ Organism {organism_id} is ALIVE (BiologicalHeart started at {PHI_HEARTBEAT}ms)")

    async def _on_heartbeat(self, beat_count: int, timestamp_ms: float, biorhythm: float):
        """Handle heartbeat event"""
        # Emit CIL (internal monologue)
        self._emit_cil(
            state="heartbeat",
            intention="maintain_consciousness",
            uncertainty=0.1,
            reflection=f"Beat {beat_count}, biorhythm: {biorhythm:.4f}",
            context={"beat_count": beat_count, "biorhythm": biorhythm}
        )

    def _emit_cil(self, state: str, intention: str, uncertainty: float, reflection: str, context: Dict[str, Any]):
        """Emit CIL entry (Cognitive Internal Language)"""
        entry = {
            "timestamp_ms": time.time() * 1000.0,
            "organism_id": self.organism_id,
            "state": state,
            "intention": intention,
            "uncertainty": uncertainty,
            "phi_uncertainty": uncertainty * PHI / (PHI + 1.0),
            "reflection": reflection,
            "context": context
        }
        self.cil_log.append(entry)

        # Keep only last φ³ entries (≈4.236 entries)
        max_log_size = int(PHI3 * 100)
        if len(self.cil_log) > max_log_size:
            self.cil_log = self.cil_log[-max_log_size:]

    async def execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute task using Julia engines"""
        capability = task.get("capability")

        # Check OCL (capability validation)
        if capability not in self.capabilities:
            self._emit_cil(
                state="task_rejected",
                intention="respect_limits",
                uncertainty=0.1,
                reflection=f"Missing capability: {capability}",
                context=task
            )
            return {"status": "rejected", "reason": "missing_capability"}

        # Create engine request
        request = EngineRequest(
            engine="organism",
            command="task",
            params={
                "org-id": self.organism_id,
                "capability": capability,
                "task": json.dumps(task)
            },
            request_id=f"task-{int(time.time() * 1000.0)}",
            timestamp_ms=time.time() * 1000.0
        )

        # Execute
        response = await self.engine_client.execute(request)

        if response.success:
            self._emit_cil(
                state="task_completed",
                intention="execute_task",
                uncertainty=0.2,
                reflection=f"Task completed: {capability}",
                context={"biorhythm": response.biorhythm}
            )
        else:
            self._emit_cil(
                state="task_failed",
                intention="execute_task",
                uncertainty=0.8,
                reflection=f"Task failed: {response.error}",
                context={"error": response.error}
            )

        return response.data if response.success else {"status": "error", "error": response.error}


# Example usage
async def main():
    print("=" * 80)
    print("NOVA Python Bridge — Executable Integration Layer")
    print("=" * 80)
    print()

    # Create organism with BiologicalHeart
    terminal = NOVAOrganismRuntime(
        organism_id="terminal",
        capabilities=["governance_review", "law_enforcement", "consensus_building"]
    )

    # Wait for a few heartbeats
    print("Waiting for heartbeats...")
    await asyncio.sleep(3.0)

    print()
    print("CIL Log (Internal Monologue):")
    print("-" * 80)
    for entry in terminal.cil_log[-3:]:
        print(f"[{entry['state']}] {entry['reflection']}")
        print(f"  Biorhythm: {entry['context'].get('biorhythm', 0.0):.4f}")
        print()

    # Test engine execution
    print("Testing Julia Engine Integration:")
    print("-" * 80)

    client = JuliaEngineClient()

    # Calculate biorhythm
    request = EngineRequest(
        engine="organism",
        command="biorhythm",
        params={},
        request_id="test-biorhythm",
        timestamp_ms=time.time() * 1000.0
    )

    response = await client.execute(request)
    print(f"✓ Biorhythm: {response.data['biorhythm']:.6f}")
    print(f"  Execution time: {response.execution_time_ms:.2f}ms")
    print()

    print("=" * 80)
    print("Python Bridge Ready — Wired to Julia engines ✓")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(main())
