///
/// tests/thesis-alpha-constants.test.js
///
/// Comprehensive test coverage for sdk/thesis-alpha/src/constants.js
///
/// Covers:
///   - Mathematical constants: PHI, PHI2, PHI3, PHI4, PHI_INV, GOLDEN_ANGLE
///   - Claim classes: C1-C12 and their release rules
///   - Evidence classes: E0-E10 and their strengths
///   - Authority states and transitions
///   - Lifecycle states
///   - Substrate types
///   - Surface router surfaces
///   - Cohort roles
///   - Runtime layers
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  PHI, PHI2, PHI3, PHI4, PHI_INV, PHI_INV2,
  GOLDEN_ANGLE, TWO_PI, PHI_HEARTBEAT_MS,
  EMERGENCE_THRESHOLD, FIBONACCI, PYTHAGORAS_3_4_5, RHETORIC,
  LN2,
  CLAIM_CLASS, CLAIM_RELEASE_RULES, CLAIM_PRIVATE_GATE, CLAIM_PROOF_REQUIRED,
  EVIDENCE_CLASS, EVIDENCE_STRENGTH, CLAIM_MIN_EVIDENCE,
  AUTHORITY_STATE, AUTHORITY_TRANSITIONS,
  LIFECYCLE, LIFECYCLE_TERMINALS,
  SUBSTRATE_TYPE, SURFACE, COHORT_ROLE, RUNTIME_LAYER,
} from '../sdk/thesis-alpha/src/constants.js';

// ─── Mathematical Constants ──────────────────────────────────────────────────

describe('Mathematical Constants', () => {
  test('PHI equals golden ratio (1 + √5) / 2', () => {
    const expected = (1 + Math.sqrt(5)) / 2;
    assert.ok(Math.abs(PHI - expected) < 1e-10);
  });

  test('PHI2 equals PHI squared', () => {
    const expected = PHI * PHI;
    assert.ok(Math.abs(PHI2 - expected) < 1e-10);
  });

  test('PHI3 equals PHI cubed', () => {
    const expected = PHI * PHI * PHI;
    assert.ok(Math.abs(PHI3 - expected) < 1e-10);
  });

  test('PHI4 equals PHI to the fourth power', () => {
    const expected = PHI * PHI * PHI * PHI;
    assert.ok(Math.abs(PHI4 - expected) < 1e-10);
  });

  test('PHI_INV equals 1/PHI', () => {
    const expected = 1.0 / PHI;
    assert.ok(Math.abs(PHI_INV - expected) < 1e-10);
  });

  test('PHI_INV2 equals 1/PHI squared', () => {
    const expected = (1.0 / PHI) * (1.0 / PHI);
    assert.ok(Math.abs(PHI_INV2 - expected) < 1e-10);
  });

  test('PHI × PHI_INV equals 1', () => {
    const product = PHI * PHI_INV;
    assert.ok(Math.abs(product - 1.0) < 1e-10);
  });

  test('GOLDEN_ANGLE equals 2π/φ² ≈ 137.508°', () => {
    const expected = (2 * Math.PI) / (PHI * PHI);
    assert.ok(Math.abs(GOLDEN_ANGLE - expected) < 1e-10);
    // Also check it's approximately 137.508 degrees
    const degrees = GOLDEN_ANGLE * (180 / Math.PI);
    assert.ok(Math.abs(degrees - 137.508) < 0.01);
  });

  test('TWO_PI equals 2π', () => {
    assert.ok(Math.abs(TWO_PI - 2 * Math.PI) < 1e-10);
  });

  test('PHI_HEARTBEAT_MS equals 873', () => {
    assert.strictEqual(PHI_HEARTBEAT_MS, 873);
  });

  test('EMERGENCE_THRESHOLD equals PHI_INV', () => {
    assert.strictEqual(EMERGENCE_THRESHOLD, PHI_INV);
  });

  test('LN2 equals Math.LN2', () => {
    assert.strictEqual(LN2, Math.LN2);
  });
});

// ─── Fibonacci Sequence ─────────────────────────────────────────────────────

describe('FIBONACCI', () => {
  test('contains first 20 Fibonacci numbers', () => {
    assert.strictEqual(FIBONACCI.length, 20);
  });

  test('first two values are 0 and 1', () => {
    assert.strictEqual(FIBONACCI[0], 0);
    assert.strictEqual(FIBONACCI[1], 1);
  });

  test('each value is sum of previous two', () => {
    for (let i = 2; i < FIBONACCI.length; i++) {
      assert.strictEqual(FIBONACCI[i], FIBONACCI[i - 1] + FIBONACCI[i - 2]);
    }
  });

  test('contains expected specific values', () => {
    assert.strictEqual(FIBONACCI[10], 55);
    assert.strictEqual(FIBONACCI[15], 610);
    assert.strictEqual(FIBONACCI[19], 4181);
  });
});

// ─── Pythagorean Triple ─────────────────────────────────────────────────────

describe('PYTHAGORAS_3_4_5', () => {
  test('has correct values', () => {
    assert.strictEqual(PYTHAGORAS_3_4_5.a, 3);
    assert.strictEqual(PYTHAGORAS_3_4_5.b, 4);
    assert.strictEqual(PYTHAGORAS_3_4_5.c, 5);
  });

  test('satisfies a² + b² = c²', () => {
    const { a, b, c } = PYTHAGORAS_3_4_5;
    assert.strictEqual(a * a + b * b, c * c);
  });
});

// ─── Aristotelian Rhetoric Weights ──────────────────────────────────────────

describe('RHETORIC', () => {
  test('LOGOS weight equals PHI', () => {
    assert.strictEqual(RHETORIC.LOGOS, PHI);
  });

  test('ETHOS weight equals 1.0', () => {
    assert.strictEqual(RHETORIC.ETHOS, 1.0);
  });

  test('PATHOS weight equals PHI_INV', () => {
    assert.strictEqual(RHETORIC.PATHOS, PHI_INV);
  });

  test('weights are in descending order: LOGOS > ETHOS > PATHOS', () => {
    assert.ok(RHETORIC.LOGOS > RHETORIC.ETHOS);
    assert.ok(RHETORIC.ETHOS > RHETORIC.PATHOS);
  });
});

// ─── Claim Classes ──────────────────────────────────────────────────────────

describe('CLAIM_CLASS', () => {
  test('contains all 12 claim classes C1-C12', () => {
    const expectedKeys = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12'];
    assert.deepStrictEqual(Object.keys(CLAIM_CLASS), expectedKeys);
  });

  test('each claim class has a string value', () => {
    for (const key of Object.keys(CLAIM_CLASS)) {
      assert.strictEqual(typeof CLAIM_CLASS[key], 'string');
      assert.ok(CLAIM_CLASS[key].length > 0);
    }
  });

  test('C1 is VERIFIED_IMPLEMENTATION', () => {
    assert.strictEqual(CLAIM_CLASS.C1, 'VERIFIED_IMPLEMENTATION');
  });

  test('C6 is PRIVATE_INTERNAL', () => {
    assert.strictEqual(CLAIM_CLASS.C6, 'PRIVATE_INTERNAL');
  });

  test('C12 is NOTARIZATION_AUTHORSHIP', () => {
    assert.strictEqual(CLAIM_CLASS.C12, 'NOTARIZATION_AUTHORSHIP');
  });
});

describe('CLAIM_RELEASE_RULES', () => {
  test('has rule for each claim class', () => {
    for (const key of Object.keys(CLAIM_CLASS)) {
      assert.ok(key in CLAIM_RELEASE_RULES, `missing rule for ${key}`);
    }
  });

  test('C6 is never public', () => {
    assert.ok(CLAIM_RELEASE_RULES.C6.includes('never'));
  });

  test('C10 is public safe', () => {
    assert.ok(CLAIM_RELEASE_RULES.C10.includes('public safe'));
  });
});

describe('CLAIM_PRIVATE_GATE', () => {
  test('is a Set', () => {
    assert.ok(CLAIM_PRIVATE_GATE instanceof Set);
  });

  test('contains C6', () => {
    assert.ok(CLAIM_PRIVATE_GATE.has('C6'));
  });

  test('does not contain public-safe claims', () => {
    assert.ok(!CLAIM_PRIVATE_GATE.has('C10'));
  });
});

describe('CLAIM_PROOF_REQUIRED', () => {
  test('is a Set', () => {
    assert.ok(CLAIM_PROOF_REQUIRED instanceof Set);
  });

  test('contains C1, C11, C12', () => {
    assert.ok(CLAIM_PROOF_REQUIRED.has('C1'));
    assert.ok(CLAIM_PROOF_REQUIRED.has('C11'));
    assert.ok(CLAIM_PROOF_REQUIRED.has('C12'));
  });
});

// ─── Evidence Classes ───────────────────────────────────────────────────────

describe('EVIDENCE_CLASS', () => {
  test('contains all 11 evidence classes E0-E10', () => {
    const expectedKeys = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'];
    assert.deepStrictEqual(Object.keys(EVIDENCE_CLASS), expectedKeys);
  });

  test('E0 is NO_EVIDENCE', () => {
    assert.strictEqual(EVIDENCE_CLASS.E0, 'NO_EVIDENCE');
  });

  test('E10 is EXTERNAL_VALIDATION', () => {
    assert.strictEqual(EVIDENCE_CLASS.E10, 'EXTERNAL_VALIDATION');
  });
});

describe('EVIDENCE_STRENGTH', () => {
  test('has ordinal value for each evidence class', () => {
    for (const key of Object.keys(EVIDENCE_CLASS)) {
      assert.ok(key in EVIDENCE_STRENGTH, `missing strength for ${key}`);
    }
  });

  test('E0 has strength 0', () => {
    assert.strictEqual(EVIDENCE_STRENGTH.E0, 0);
  });

  test('E10 has strength 10', () => {
    assert.strictEqual(EVIDENCE_STRENGTH.E10, 10);
  });

  test('strengths are in ascending order', () => {
    for (let i = 0; i < 10; i++) {
      const current = EVIDENCE_STRENGTH[`E${i}`];
      const next = EVIDENCE_STRENGTH[`E${i + 1}`];
      assert.ok(next > current, `E${i + 1} should be stronger than E${i}`);
    }
  });
});

describe('CLAIM_MIN_EVIDENCE', () => {
  test('has minimum evidence for each claim class', () => {
    for (const key of Object.keys(CLAIM_CLASS)) {
      assert.ok(key in CLAIM_MIN_EVIDENCE, `missing min evidence for ${key}`);
    }
  });

  test('C6 (private) requires E0', () => {
    assert.strictEqual(CLAIM_MIN_EVIDENCE.C6, 'E0');
  });

  test('C12 (notarization) requires E8', () => {
    assert.strictEqual(CLAIM_MIN_EVIDENCE.C12, 'E8');
  });
});

// ─── Authority States ───────────────────────────────────────────────────────

describe('AUTHORITY_STATE', () => {
  test('contains all 12 authority states', () => {
    assert.strictEqual(Object.keys(AUTHORITY_STATE).length, 12);
  });

  test('includes DRAFT state', () => {
    assert.strictEqual(AUTHORITY_STATE.DRAFT, 'DRAFT');
  });

  test('includes PUBLIC_SAFE state', () => {
    assert.strictEqual(AUTHORITY_STATE.PUBLIC_SAFE, 'PUBLIC_SAFE');
  });

  test('includes PRIVATE_VAULT state', () => {
    assert.strictEqual(AUTHORITY_STATE.PRIVATE_VAULT, 'PRIVATE_VAULT');
  });
});

describe('AUTHORITY_TRANSITIONS', () => {
  test('has transitions for each authority state', () => {
    for (const state of Object.keys(AUTHORITY_STATE)) {
      assert.ok(state in AUTHORITY_TRANSITIONS, `missing transitions for ${state}`);
    }
  });

  test('DRAFT can transition to INTERNAL_RESEARCH or PRIVATE_VAULT', () => {
    assert.deepStrictEqual(AUTHORITY_TRANSITIONS.DRAFT, ['INTERNAL_RESEARCH', 'PRIVATE_VAULT']);
  });

  test('PUBLIC_SAFE is terminal (no transitions)', () => {
    assert.deepStrictEqual(AUTHORITY_TRANSITIONS.PUBLIC_SAFE, []);
  });

  test('PRIVATE_VAULT is terminal (no transitions)', () => {
    assert.deepStrictEqual(AUTHORITY_TRANSITIONS.PRIVATE_VAULT, []);
  });
});

// ─── Lifecycle States ───────────────────────────────────────────────────────

describe('LIFECYCLE', () => {
  test('is an array', () => {
    assert.ok(Array.isArray(LIFECYCLE));
  });

  test('starts with RAW_INPUT', () => {
    assert.strictEqual(LIFECYCLE[0], 'RAW_INPUT');
  });

  test('ends with OPERATOR_REVIEW', () => {
    assert.strictEqual(LIFECYCLE[LIFECYCLE.length - 1], 'OPERATOR_REVIEW');
  });

  test('contains all expected lifecycle stages', () => {
    assert.ok(LIFECYCLE.includes('SUBSTRATE_CLASSIFIED'));
    assert.ok(LIFECYCLE.includes('CLAIMS_EXTRACTED'));
    assert.ok(LIFECYCLE.includes('HASHED'));
    assert.ok(LIFECYCLE.includes('MEMORY_APPENDED'));
  });
});

describe('LIFECYCLE_TERMINALS', () => {
  test('is an array', () => {
    assert.ok(Array.isArray(LIFECYCLE_TERMINALS));
  });

  test('contains PUBLIC_SAFE', () => {
    assert.ok(LIFECYCLE_TERMINALS.includes('PUBLIC_SAFE'));
  });

  test('contains PRIVATE_VAULT', () => {
    assert.ok(LIFECYCLE_TERMINALS.includes('PRIVATE_VAULT'));
  });
});

// ─── Substrate Types ────────────────────────────────────────────────────────

describe('SUBSTRATE_TYPE', () => {
  test('contains all expected substrate types', () => {
    const expectedTypes = [
      'PAPER_DRAFT', 'DISSERTATION', 'RUNTIME_PAPER', 'THEOREM_CANDIDATE',
      'PROTOCOL_CANDIDATE', 'IP_CLAIM', 'PROOF_RECORD', 'MEMORY_RECORD',
      'SIGNED_RIPPLE', 'PUBLIC_CLAIM', 'PRIVATE_CORE', 'BLOCKCHAIN_NOTARY',
      'CODE_APPENDIX', 'REPRODUCIBILITY_ARTIFACT', 'DEPLOYMENT_BLUEPRINT',
    ];
    for (const type of expectedTypes) {
      assert.ok(type in SUBSTRATE_TYPE, `missing substrate type: ${type}`);
    }
  });

  test('PAPER_DRAFT value is paper_draft', () => {
    assert.strictEqual(SUBSTRATE_TYPE.PAPER_DRAFT, 'paper_draft');
  });

  test('PRIVATE_CORE value is private_core', () => {
    assert.strictEqual(SUBSTRATE_TYPE.PRIVATE_CORE, 'private_core');
  });
});

// ─── Surface Router Surfaces ────────────────────────────────────────────────

describe('SURFACE', () => {
  test('contains all 4 surfaces', () => {
    assert.strictEqual(Object.keys(SURFACE).length, 4);
  });

  test('SOURCE surface exists', () => {
    assert.strictEqual(SURFACE.SOURCE, 'SOURCE_SURFACE');
  });

  test('FORGE surface exists', () => {
    assert.strictEqual(SURFACE.FORGE, 'FORGE_SURFACE');
  });

  test('DEPLOY surface exists', () => {
    assert.strictEqual(SURFACE.DEPLOY, 'DEPLOY_SURFACE');
  });

  test('NEXUS surface exists', () => {
    assert.strictEqual(SURFACE.NEXUS, 'NEXUS_REGISTRY');
  });
});

// ─── Cohort Roles ───────────────────────────────────────────────────────────

describe('COHORT_ROLE', () => {
  test('contains all 9 cohort roles', () => {
    assert.strictEqual(Object.keys(COHORT_ROLE).length, 9);
  });

  const expectedRoles = ['QUAESTOR', 'IUDEX', 'FABER', 'STRUCTOR', 'NOTARIUS', 'CUSTOS', 'ARCHIVISTA', 'PROBATOR', 'REDACTOR'];
  
  for (const role of expectedRoles) {
    test(`includes ${role} role`, () => {
      assert.ok(role in COHORT_ROLE, `missing role: ${role}`);
      // Value should be the capitalized Latin name
      assert.strictEqual(COHORT_ROLE[role].charAt(0), role.charAt(0));
    });
  }
});

// ─── Runtime Layers ─────────────────────────────────────────────────────────

describe('RUNTIME_LAYER', () => {
  test('contains all 7 runtime layers', () => {
    assert.strictEqual(Object.keys(RUNTIME_LAYER).length, 7);
  });

  test('NOVA_ROOT layer exists', () => {
    assert.strictEqual(RUNTIME_LAYER.NOVA_ROOT, 'NOVA_ROOT');
  });

  test('MEMORY_RUNTIME layer exists', () => {
    assert.strictEqual(RUNTIME_LAYER.MEMORY_RUNTIME, 'MEMORY_RUNTIME');
  });

  test('FOUNDATION_FLOOR layer exists', () => {
    assert.strictEqual(RUNTIME_LAYER.FOUNDATION_FLOOR, 'FOUNDATION_FLOOR');
  });

  test('BOT_FLEET layer exists', () => {
    assert.strictEqual(RUNTIME_LAYER.BOT_FLEET, 'BOT_FLEET');
  });
});
