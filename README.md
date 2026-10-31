# beatty-sequence-generator

A small, dependency-free TypeScript/JavaScript library that produces complementary Beatty sequences — pairs of sequences that partition the positive integers given an irrational index `r > 1`.

```js
import { generateBeatty, generateComplementaryBeatty, beattyAt } from 'beatty-sequence-generator';

const r = Math.SQRT2;

// First 8 terms: floor(r), floor(2r), ..., floor(8r)
const seq = generateBeatty(r, 8);     // [1, 2, 4, 5, 7, 8, 9, 11]

// Complementary sequence B(s) where s = r/(r-1)
const comp = generateComplementaryBeatty(r, 5); // [3, 6, 10, 13, 17]

// Single term lookup (1-indexed)
const seventh = beattyAt(r, 7);       // 9
```

## Why

Rayleigh's theorem states that for any irrational `r > 1`, the sequences `floor(n·r)` and `floor(n·r/(r−1))` partition the natural numbers — every positive integer appears in exactly one sequence, with no overlaps or gaps. This is useful for scheduling, fair interleaving, and combinatorial generation where you need two streams that together cover everything without collision.

The trade-off: floating-point cannot represent irrationals exactly. Rather than pretend otherwise, this library bounds generation by an explicit `count` and validates the partition structurally (strictly increasing, no duplicates in the requested range) rather than by exact equality on floats. For the classic choices — √2, the golden ratio — the results are exact for any practical count.

## Edge cases

- `r` must be strictly greater than 1 and non-integer. Integer values of `r` make the complementary index `r/(r−1)` rational and the partition degenerate; the library rejects them rather than silently producing a wrong sequence.
- `count = 0` returns an empty array. `n` in `beattyAt` is 1-indexed and must be ≥ 1.
- The golden ratio φ ≈ 1.618 is a valid index and yields the lower and upper Wythoff sequences.

## Exports

- `generateBeatty(r, count)` — first `count` terms of `floor(n·r)`
- `generateComplementaryBeatty(r, count)` — first `count` terms of `floor(n·r/(r−1))`
- `beattyAt(r, n)` — the n-th term (1-indexed) of the primary sequence
- `complementaryBeattyAt(r, n)` — the n-th term (1-indexed) of the complementary sequence
