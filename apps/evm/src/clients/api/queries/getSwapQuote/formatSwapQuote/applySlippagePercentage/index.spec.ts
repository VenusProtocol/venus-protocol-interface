import { applySlippagePercentage } from '.';

describe('applySlippagePercentage', () => {
  it('preserves precision for large mantissas', () => {
    const result = applySlippagePercentage({
      amount: 123456789012345678901234567890n,
      slippagePercentage: 0.005,
    });

    expect(result).toBe(123462961851796296185179629618n);
  });

  it('applies negative slippage precisely', () => {
    const result = applySlippagePercentage({
      amount: 123456789012345678901234567890n,
      slippagePercentage: -0.005,
    });

    expect(result).toBe(123450616172895061617289506161n);
  });
});
