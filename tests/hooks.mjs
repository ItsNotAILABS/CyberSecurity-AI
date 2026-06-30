///
/// tests/hooks.mjs — ESM custom resolver hooks
///
/// Intercepts @medina/* bare specifiers and redirects them to the local
/// test shims, enabling tests to import SDKs that depend on each other
/// without a live npm registry or full workspace link setup.
///

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dir      = dirname(__filename);

const SHIM_MAP = {
  '@medina/medina-heart': join(__dir, 'shims/@medina/medina-heart.js'),
  '@medina/birth-ai': join(__dir, 'shims/@medina/birth-ai.js'),
  '@medina/alpha-sdk': join(__dir, 'shims/@medina/alpha-sdk.js'),
};

export function resolve(specifier, context, nextResolve) {
  const shimPath = SHIM_MAP[specifier];
  if (shimPath) {
    return nextResolve(`file://${shimPath}`, context);
  }
  return nextResolve(specifier, context);
}
