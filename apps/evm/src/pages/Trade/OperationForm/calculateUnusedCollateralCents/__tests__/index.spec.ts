import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import type { CalculateUnusedCollateralCentsInput } from '..';
import { calculateUnusedCollateralCents } from '..';
import { calculateMaxLeverageFactor } from '../../../calculateMaxLeverageFactor';

vi.mock('../../../calculateMaxLeverageFactor', () => ({
  calculateMaxLeverageFactor: vi.fn(),
}));

const baseInput: CalculateUnusedCollateralCentsInput = {
  dsaAmountTokens: new BigNumber(10),
  dsaTokenPriceCents: 100,
  dsaTokenCollateralFactor: 0.5,
  longAmountTokens: new BigNumber(3),
  longTokenPriceCents: 100,
  longTokenCollateralFactor: 0.8,
  shortAmountTokens: new BigNumber(4),
  shortTokenPriceCents: 100,
  leverageFactor: 2,
  proportionalCloseTolerancePercentage: 2,
};

describe('calculateUnusedCollateralCents', () => {
  beforeEach(() => {
    (calculateMaxLeverageFactor as Mock).mockReset();
  });

  it('passes the collateral factors and close tolerance to calculateMaxLeverageFactor', () => {
    (calculateMaxLeverageFactor as Mock).mockReturnValue(5);

    calculateUnusedCollateralCents(baseInput);

    expect(calculateMaxLeverageFactor).toHaveBeenCalledWith({
      dsaTokenCollateralFactor: baseInput.dsaTokenCollateralFactor,
      longTokenCollateralFactor: baseInput.longTokenCollateralFactor,
      proportionalCloseTolerancePercentage: baseInput.proportionalCloseTolerancePercentage,
    });
  });

  it('uses nominal utilization when the long collateral fully covers the short side', () => {
    (calculateMaxLeverageFactor as Mock).mockReturnValue(5);

    const result = calculateUnusedCollateralCents({
      ...baseInput,
      longAmountTokens: new BigNumber(10),
    });

    expect(result.toFixed()).toMatchInlineSnapshot('"800"');
  });

  it('uses actual utilized DSA collateral when excess borrow is higher than nominal utilization', () => {
    (calculateMaxLeverageFactor as Mock).mockReturnValue(5);

    const result = calculateUnusedCollateralCents(baseInput);

    expect(result.toFixed()).toMatchInlineSnapshot('"680"');
  });

  it('clamps leverage factor to the computed maximum', () => {
    (calculateMaxLeverageFactor as Mock).mockReturnValue(4);

    const result = calculateUnusedCollateralCents({
      ...baseInput,
      longAmountTokens: new BigNumber(10),
      leverageFactor: 10,
    });

    expect(result.toFixed()).toMatchInlineSnapshot('"900"');
  });

  it('uses the full DSA balance when collateral factor is zero and there is excess borrow', () => {
    (calculateMaxLeverageFactor as Mock).mockReturnValue(5);

    const result = calculateUnusedCollateralCents({
      ...baseInput,
      dsaTokenCollateralFactor: 0,
    });

    expect(result.toFixed()).toMatchInlineSnapshot('"0"');
  });
});
