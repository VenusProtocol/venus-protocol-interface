import { calculateHealthFactor } from '..';

describe('calculateHealthFactor', () => {
  it('returns the right value', async () => {
    expect(
      calculateHealthFactor({
        borrowBalanceCents: 100,
        liquidationThresholdCents: 1000,
      }),
    ).toBe(10);
  });

  it('returns Infinity when borrowBalanceCents is 0', () => {
    expect(
      calculateHealthFactor({
        borrowBalanceCents: 0,
        liquidationThresholdCents: 1000,
      }),
    ).toBe(Number.POSITIVE_INFINITY);
  });
});
