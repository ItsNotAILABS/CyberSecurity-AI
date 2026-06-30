///
/// tests/setup.mjs — Test environment bootstrap
///
/// Registers a custom ESM module resolver that maps @medina/* package imports
/// to their local shim equivalents inside tests/shims/.
///
/// Usage (automatically applied via --import flag in package.json test script):
///   node --import ./tests/setup.mjs --test tests/*.test.js
///

import { register } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dir      = dirname(__filename);

// Register the hooks file that lives next to this setup file
register(pathToFileURL(join(__dir, 'hooks.mjs')).href, pathToFileURL('./'));
