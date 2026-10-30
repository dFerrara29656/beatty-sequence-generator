import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBeatty,
  generateComplementaryBeatty,
  beattyAt,
  complementaryBeattyAt,
} from '../src/index.js';

describe('generateBeatty', () => {
  it('produces the classic Beatty sequence for r = sqrt(2)', () => {
    const r = Math.SQRT2;
    const got = generateBeatty(r, 8);
    // floor(1.414.. * n) for n=1..8
    assert.deepEqual(got, [1, 2, 4, 5, 7, 8, 9, 11]);
  });

  it('produces the complementary sequence for r = sqrt(2)', () => {
    const r = Math.SQRT2;
    // s = r/(r-1) = 2 + sqrt(2) ≈ 3.414...
    const got = generateComplementaryBeatty(r, 5);
    assert.deepEqual(got, [3, 6, 10, 13, 17]);
  });

  it('returns an empty array for count = 0', () => {
    assert.deepEqual(generateBeatty(Math.SQRT2, 0), []);
  });

  it('returns a single-element array for count = 1', () => {
    assert.deepEqual(generateBeatty(Math.SQRT2, 1), [1]);
  });

  it('produces strictly increasing terms', () => {
    const got = generateBeatty(Math.SQRT2, 20);
    for (let i = 1; i < got.length; i++) {
      assert.ok(got[i] > got[i - 1], `term ${i} should exceed term ${i - 1}`);
    }
  });
});

describe('generateComplementaryBeatty', () => {
  it('produces strictly increasing terms', () => {
    const got = generateComplementaryBeatty(Math.SQRT2, 20);
    for (let i = 1; i < got.length; i++) {
      assert.ok(got[i] > got[i - 1], `term ${i} should exceed term ${i - 1}`);
    }
  });

  it('returns an empty array for count = 0', () => {
    assert.deepEqual(generateComplementaryBeatty(Math.SQRT2, 0), []);
  });
});

describe('partition property', () => {
  it('B(r) and B(s) partition the naturals over their combined range', () => {
    const r = Math.SQRT2;
    // The two sequences partition the naturals only over the range they jointly
    // cover: [1, min(lastTerm(A), lastTerm(B))]. Beyond that, one sequence has
    // stopped contributing terms and gaps appear. The number of terms requested
    // for each sequence must be proportional so that neither sequence ends far
    // before the other.
    const countA = 30;
    const countB = 21;
    const a = generateBeatty(r, countA);
    const b = generateComplementaryBeatty(r, countB);
    const seen = new Set();
    for (const v of a) {
      assert.ok(!seen.has(v), `duplicate ${v} across sequences`);
      seen.add(v);
    }
    for (const v of b) {
      assert.ok(!seen.has(v), `duplicate ${v} across sequences`);
      seen.add(v);
    }
    // Partition is guaranteed up to the smaller of the two last terms.
    const coverMax = Math.min(a[a.length - 1], b[b.length - 1]);
    for (let k = 1; k <= coverMax; k++) {
      assert.ok(seen.has(k), `integer ${k} missing from partition`);
    }
  });

  it('partition holds for a different irrational (golden ratio)', () => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const countA = 25;
    const countB = 16;
    const a = generateBeatty(phi, countA);
    const b = generateComplementaryBeatty(phi, countB);
    const seen = new Set();
    for (const v of a) seen.add(v);
    for (const v of b) {
      assert.ok(!seen.has(v), `duplicate ${v}`);
      seen.add(v);
    }
    const coverMax = Math.min(a[a.length - 1], b[b.length - 1]);
    for (let k = 1; k <= coverMax; k++) {
      assert.ok(seen.has(k), `integer ${k} missing`);
    }
  });
});

describe('beattyAt', () => {
  it('matches the array index for sqrt(2)', () => {
    const r = Math.SQRT2;
    const arr = generateBeatty(r, 10);
    for (let i = 0; i < arr.length; i++) {
      assert.equal(beattyAt(r, i + 1), arr[i]);
    }
  });

  it('throws for n = 0', () => {
    assert.throws(() => beattyAt(Math.SQRT2, 0), RangeError);
  });

  it('throws for negative n', () => {
    assert.throws(() => beattyAt(Math.SQRT2, -3), RangeError);
  });
});

describe('complementaryBeattyAt', () => {
  it('matches the array index for sqrt(2)', () => {
    const r = Math.SQRT2;
    const arr = generateComplementaryBeatty(r, 10);
    for (let i = 0; i < arr.length; i++) {
      assert.equal(complementaryBeattyAt(r, i + 1), arr[i]);
    }
  });
});

describe('validation', () => {
  it('rejects r <= 1', () => {
    assert.throws(() => generateBeatty(0.5, 5), RangeError);
    assert.throws(() => generateBeatty(1, 5), RangeError);
  });

  it('rejects NaN', () => {
    assert.throws(() => generateBeatty(NaN, 5), TypeError);
  });

  it('rejects non-finite r', () => {
    assert.throws(() => generateBeatty(Infinity, 5), RangeError);
  });

  it('rejects integer r (degenerate complementary)', () => {
    assert.throws(() => generateBeatty(2, 5), RangeError);
  });

  it('rejects negative count', () => {
    assert.throws(() => generateBeatty(Math.SQRT2, -1), RangeError);
  });

  it('rejects non-integer count', () => {
    assert.throws(() => generateBeatty(Math.SQRT2, 2.5), RangeError);
  });
});
