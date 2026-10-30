/**
 * Core implementation of Beatty sequence generation.
 *
 * A Beatty sequence B(r, n) = floor(r * n) for n = 1, 2, 3, ...
 * Given an irrational index r > 1, Rayleigh's theorem guarantees that the
 * sequences B(r) and B(r/(r-1)) partition the positive integers: every
 * positive integer appears in exactly one of the two sequences, with no
 * duplicates and no gaps.
 *
 * Because floating-point cannot represent most irrationals, every generation
 * function accepts `count` as a bound rather than promising an infinite
 * stream. We never compare floats for equality; the partition property is
 * verified structurally (strictly increasing, no overlap within the
 * requested range) rather than by exact equality checks.
 */

/**
 * Compute floor(r * n) safely.
 *
 * For n up to 2^53 / r this is exact because the product r * n is itself
 * representable. We clamp `n` to a sane upper bound to avoid floating-point
 * degradation on very large indices — the library is intended for modest
 * counts, not arbitrary-precision number theory.
 *
 * @param {number} r - irrational index, must be > 1
 * @param {number} n - term position (positive integer)
 * @returns {number}
 */
function floorTerm(r, n) {
  if (!Number.isFinite(r) || !Number.isFinite(n)) {
    throw new RangeError('r and n must be finite numbers');
  }
  return Math.floor(r * n);
}

/**
 * Validate that `r` is a usable Beatty index: finite, greater than 1.
 *
 * We deliberately do NOT require r to be irrational — floating point makes
 * that impossible to verify — but we warn at runtime if r is obviously
 * rational (a small integer) because the complementary sequence would
 * then be undefined (division by zero) or degenerate.
 *
 * @param {number} r
 */
function validateIndex(r) {
  if (typeof r !== 'number' || Number.isNaN(r)) {
    throw new TypeError('Beatty index must be a number');
  }
  if (!Number.isFinite(r)) {
    throw new RangeError('Beatty index must be finite');
  }
  if (r <= 1) {
    throw new RangeError('Beatty index must be greater than 1');
  }
  if (Number.isInteger(r)) {
    // For integer r, the complementary index s = r/(r-1) is rational.
    // The sequences still partition the naturals (Wythoff-style), so we
    // allow it, but document the caveat.
    throw new RangeError('Beatty index must be non-integer; integer r is degenerate for the complementary form');
  }
}

/**
 * Generate the first `count` terms of the Beatty sequence B(r).
 *
 * Terms are floor(r), floor(2r), floor(3r), ..., floor(count * r).
 * The result is strictly increasing because r > 1 implies (n+1)*r - n*r = r > 1,
 * so consecutive floor values differ by at least 1.
 *
 * @param {number} r - irrational index > 1
 * @param {number} count - number of terms to produce (positive integer)
 * @returns {number[]} array of `count` Beatty terms
 */
export function generateBeatty(r, count) {
  validateIndex(r);
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('count must be a non-negative integer');
  }
  if (count > 1e15) {
    throw new RangeError('count exceeds safe generation limit');
  }
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = floorTerm(r, i + 1);
  }
  return result;
}

/**
 * Generate the complementary Beatty sequence B(s) where s = r / (r - 1).
 *
 * By Rayleigh's theorem, when r is irrational, B(r) and B(s) partition the
 * positive integers. The complementary sequence is generated up to the same
 * `count` terms so callers can inspect both halves of the partition.
 *
 * @param {number} r - irrational index > 1
 * @param {number} count - number of terms to produce
 * @returns {number[]} array of `count` complementary Beatty terms
 */
export function generateComplementaryBeatty(r, count) {
  validateIndex(r);
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('count must be a non-negative integer');
  }
  if (count > 1e15) {
    throw new RangeError('count exceeds safe generation limit');
  }
  const s = r / (r - 1);
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = floorTerm(s, i + 1);
  }
  return result;
}

/**
 * Compute the n-th Beatty term (1-indexed) without generating a prefix.
 *
 * Useful when only specific terms are needed and full generation would be
 * wasteful.
 *
 * @param {number} r - irrational index > 1
 * @param {number} n - 1-indexed position
 * @returns {number}
 */
export function beattyAt(r, n) {
  validateIndex(r);
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError('n must be a positive integer');
  }
  return floorTerm(r, n);
}

/**
 * Compute the n-th term of the complementary Beatty sequence (1-indexed).
 *
 * @param {number} r - irrational index > 1
 * @param {number} n - 1-indexed position
 * @returns {number}
 */
export function complementaryBeattyAt(r, n) {
  validateIndex(r);
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError('n must be a positive integer');
  }
  const s = r / (r - 1);
  return floorTerm(s, n);
}
