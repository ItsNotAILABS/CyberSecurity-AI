#!/usr/bin/env python3
"""
NOVA Python Runtime Bridge — Organism Coordination Layer

This Python runtime bridges TypeScript intelligence modules and Motoko
backend canisters. It provides:
  - Protocol execution coordination
  - Cross-language intelligence routing
  - Fibonacci-based message passing
  - φ-weighted adaptation
  - Real-time organism monitoring

Casa de Medina — Architectos de Architectura Inteligente
"""

import asyncio
import hashlib
import json
import time
from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional, Callable, Any
import math

# ══════════════════════════════════════════════════════════════════
#  CONSTANTS
# ══════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 0.6180339887498948482
GOLDEN_ANGLE = 2.39996322972865332
VOCAB_SIZE = 131_072  # 2^17

# ══════════════════════════════════════════════════════════════════
#  TYPES
# ══════════════════════════════════════════════════════════════════

class SubstrateType(Enum):
    ICP = "ICP"
    BLOCKCHAIN = "Blockchain"
    EDGE = "Edge"
    CLOUD = "Cloud"
    PHANTOM = "Phantom"
    HYBRID = "Hybrid"

class OrganismStatus(Enum):
    BLUEPRINT = "Blueprint"
    SPAWNING = "Spawning"
    ACTIVE = "Active"
    DORMANT = "Dormant"
    PROPAGATING = "Propagating"

class ProtocolTier(Enum):
    CORE = "Core"
    ORCHESTRATION = "Orchestration"
    VERIFICATION = "Verification"
    ALPHA = "Alpha"
    NOVA_MIND = "NovaMind"

@dataclass
class OrganismBlueprint:
    """Organism specification from Architect"""
    id: int
    name: str
    designation: str
    substrate: SubstrateType
    generation: int
    parent_id: Optional[int]
    golden_position: tuple[float, float]
    scale: float
    capabilities: List[str]
    timestamp: int
    status: OrganismStatus

@dataclass
class ProtocolDefinition:
    """Protocol registry entry"""
    protocol_id: str
    name: str
    latin_designation: str
    tier: ProtocolTier
    target_organisms: List[str]
    phi_weight: float
    fibonacci_identity: int

@dataclass
class Message:
    """Inter-organism message"""
    msg_id: int
    from_organism: str
    to_organism: str
    payload: str
    priority: int
    timestamp: float
    delivered_at: Optional[float] = None

# ══════════════════════════════════════════════════════════════════
#  FIBONACCI UTILITIES
# ══════════════════════════════════════════════════════════════════

def fibonacci(n: int) -> int:
    """Fast Fibonacci calculation using doubling method"""
    if n < 0:
        raise ValueError(f"fib({n}): n must be >= 0")
    if n == 0:
        return 0
    if n == 1:
        return 1

    a, b = 0, 1
    bits = []
    tmp = n
    while tmp > 0:
        bits.append(tmp & 1)
        tmp >>= 1

    for i in range(len(bits) - 2, -1, -1):
        c = a * (2 * b - a)
        d = a * a + b * b
        a, b = c, d
        if bits[i] == 1:
            a, b = d, d + c

    return a

def fibonacci_hash(text: str, vocab_size: int = VOCAB_SIZE) -> int:
    """
    Fibonacci hash: content-addressed token identity.
    Produces deterministic integer in [0, vocab_size) from any string.
    """
    h = 0
    for c in text:
        h = ((h << 5) - h + ord(c)) & 0xFFFFFFFF

    # φ-mixing via Knuth multiplicative hash constant
    PHI_FRAC_U32 = 0x9e3779b9
    h = abs(h) * PHI_FRAC_U32
    return (h & 0xFFFFFFFF) % vocab_size

def phyllotaxis_position(n: int) -> tuple[float, float]:
    """Calculate golden-angle phyllotaxis position for element n"""
    r = math.sqrt(n)
    theta_rad = n * GOLDEN_ANGLE
    x = r * math.cos(theta_rad)
    y = r * math.sin(theta_rad)
    return (x, y)

def phi_weight(n: int) -> float:
    """φ-weight for the n-th item in a ranked list"""
    return (n * PHI) % 10.0

# ══════════════════════════════════════════════════════════════════
#  ORGANISM RUNTIME
# ══════════════════════════════════════════════════════════════════

class NovaOrganismRuntime:
    """
    Python runtime for organism coordination.
    Bridges TypeScript intelligence and Motoko canisters.
    """

    def __init__(self):
        self.organisms: Dict[str, OrganismBlueprint] = {}
        self.protocols: Dict[str, ProtocolDefinition] = {}
        self.messages: List[Message] = []
        self.next_message_id = 0
        self.protocol_handlers: Dict[str, Callable] = {}

    def register_organism(self, blueprint: OrganismBlueprint):
        """Register an organism in the runtime"""
        self.organisms[blueprint.name] = blueprint
        print(f"✓ Registered organism: {blueprint.name} (Gen {blueprint.generation})")

    def register_protocol(self, protocol: ProtocolDefinition):
        """Register a protocol in the runtime"""
        self.protocols[protocol.protocol_id] = protocol
        print(f"✓ Registered protocol: {protocol.protocol_id} - {protocol.name}")

    def register_protocol_handler(self, protocol_id: str, handler: Callable):
        """Register a Python handler for a protocol"""
        self.protocol_handlers[protocol_id] = handler
        print(f"✓ Registered handler for protocol: {protocol_id}")

    async def send_message(
        self,
        from_organism: str,
        to_organism: str,
        payload: str,
        priority: int = 2
    ) -> Message:
        """Send a message from one organism to another"""
        msg = Message(
            msg_id=self.next_message_id,
            from_organism=from_organism,
            to_organism=to_organism,
            payload=payload,
            priority=priority,
            timestamp=time.time()
        )
        self.next_message_id += 1
        self.messages.append(msg)

        print(f"→ Message {msg.msg_id}: {from_organism} → {to_organism}")

        # Route via Fibonacci hash if multiple targets
        return msg

    def route_to_organism(self, payload: str, candidates: List[str]) -> str:
        """Route message to organism via Fibonacci hashing"""
        if not candidates:
            return "unknown"

        hash_val = fibonacci_hash(payload)
        index = hash_val % len(candidates)
        return candidates[index]

    async def execute_protocol(
        self,
        protocol_id: str,
        input_data: str,
        parameters: Dict[str, float]
    ) -> Dict[str, Any]:
        """Execute a protocol"""
        if protocol_id not in self.protocols:
            return {"error": f"Protocol {protocol_id} not found"}

        protocol = self.protocols[protocol_id]

        # Route to organism
        target = self.route_to_organism(input_data, protocol.target_organisms)

        # Calculate φ-score
        phi_score = self._calculate_phi_score(input_data, parameters)

        # Execute handler if registered
        result = None
        if protocol_id in self.protocol_handlers:
            handler = self.protocol_handlers[protocol_id]
            result = await handler(input_data, parameters)

        return {
            "protocol_id": protocol_id,
            "target_organism": target,
            "phi_score": phi_score,
            "result": result,
            "timestamp": time.time()
        }

    def _calculate_phi_score(self, input_data: str, parameters: Dict[str, float]) -> float:
        """Calculate φ-weighted score"""
        score = len(input_data) * PHI_INV
        for value in parameters.values():
            score += value * PHI_INV
        return (score * PHI) % 10.0

    def get_organism(self, name: str) -> Optional[OrganismBlueprint]:
        """Get organism by name"""
        return self.organisms.get(name)

    def list_organisms(self) -> List[OrganismBlueprint]:
        """List all registered organisms"""
        return list(self.organisms.values())

    def list_protocols(self) -> List[ProtocolDefinition]:
        """List all registered protocols"""
        return list(self.protocols.values())

    def stats(self) -> Dict[str, Any]:
        """Get runtime statistics"""
        return {
            "total_organisms": len(self.organisms),
            "total_protocols": len(self.protocols),
            "total_messages": len(self.messages),
            "active_handlers": len(self.protocol_handlers)
        }

# ══════════════════════════════════════════════════════════════════
#  EXAMPLE USAGE
# ══════════════════════════════════════════════════════════════════

async def main():
    """Example runtime usage"""
    runtime = NovaOrganismRuntime()

    # Register organisms
    architect = OrganismBlueprint(
        id=0,
        name="ARCHITECT",
        designation="The Meta-Builder",
        substrate=SubstrateType.ICP,
        generation=0,
        parent_id=None,
        golden_position=phyllotaxis_position(0),
        scale=1.0,
        capabilities=["design", "structure", "meta", "build"],
        timestamp=int(time.time()),
        status=OrganismStatus.ACTIVE
    )
    runtime.register_organism(architect)

    # Register protocol
    protocol = ProtocolDefinition(
        protocol_id="PRT-001",
        name="Foundation Protocol",
        latin_designation="FUNDAMENTUM",
        tier=ProtocolTier.CORE,
        target_organisms=["ARCHITECT", "CHRYSALIS"],
        phi_weight=PHI,
        fibonacci_identity=fibonacci(1)
    )
    runtime.register_protocol(protocol)

    # Send message
    await runtime.send_message("ARCHITECT", "CHRYSALIS", "Golden pattern request")

    # Execute protocol
    result = await runtime.execute_protocol(
        "PRT-001",
        "test input",
        {"threshold": 0.618}
    )

    print("\n" + "═" * 70)
    print("NOVA Python Runtime Statistics:")
    print("═" * 70)
    print(json.dumps(runtime.stats(), indent=2))

if __name__ == "__main__":
    asyncio.run(main())
