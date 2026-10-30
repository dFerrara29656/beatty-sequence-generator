/**
 * Public entry point for the beatty-sequence-generator package.
 *
 * Re-exports the core Beatty sequence utilities so consumers import from a
 * single module path.
 */
export { generateBeatty, generateComplementaryBeatty, beattyAt, complementaryBeattyAt } from './core.js';
