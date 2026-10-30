import { subtractSlippageTolerance } from '..';

describe('subtractSlippageTolerance', () => {
  it('subtracts the slippage tolerance and rounds down', () => {
    expect(
      subtractSlippageTolerance({ valueMantissa: 1_000_001n, slippageTolerancePercentage: 0.5 }),
    ).toBe(995_000n);
  });

  it('keeps the whole value without a slippage tolerance', () => {
    expect(
      subtractSlippageTolerance({ valueMantissa: 1234n, slippageTolerancePercentage: 0 }),
    ).toBe(1234n);
  });

  it('supports fractional slippage tolerances', () => {
    expect(
      subtractSlippageTolerance({ valueMantissa: 10n ** 18n, slippageTolerancePercentage: 0.01 }),
    ).toBe(999_900_000_000_000_000n);
  });
});
