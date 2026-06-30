///
/// ALPHA PROTOCOLS 241-275 — Modular NOVA Advanced Research Tracks
///

import type { AlphaProtocol } from './alpha-protocols-201-240.js';
import { createProtocol241to275Registry } from '../protocols/modular-nova/runtime-bridge.js';
import { CANONICAL_PROTOCOL_MAP_241_275 } from '../protocols/modular-nova/protocol-map-241-275.js';

export const PROTOCOL_MAP_241_275 = CANONICAL_PROTOCOL_MAP_241_275;

export const ALPHA_PROTOCOLS_241_275: AlphaProtocol[] =
  createProtocol241to275Registry() as AlphaProtocol[];

export function getProtocol241to275(id: string): AlphaProtocol | undefined {
  return ALPHA_PROTOCOLS_241_275.find((protocol) => protocol.id === id);
}
