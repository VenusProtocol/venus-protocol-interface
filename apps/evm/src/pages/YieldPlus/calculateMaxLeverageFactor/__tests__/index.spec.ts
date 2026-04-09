import { calculateMaxLeverageFactor } from '..';

describe('calculateMaxLeverageFactor', () => {
  it('returns the leverage factor derived from the collateral factors and close tolerance', () => {
    const result = calculateMaxLeverageFactor({
      dsaTokenCollateralFactor: 0.5,
      longTokenCollateralFactor: 0.8,
      proportionalCloseTolerancePercentage: 2,
    });

    expect(result).toMatchInlineSnapshot('2.31');
  });

  it('rounds down to two decimal places', () => {
    const result = calculateMaxLeverageFactor({
      dsaTokenCollateralFactor: 0.1,
      longTokenCollateralFactor: 0.7,
      proportionalCloseTolerancePercentage: 0,
    });

    expect(result).toMatchInlineSnapshot('0.33');
  });

  it('reduces the maximum leverage when proportional close tolerance increases', () => {
    const lowToleranceResult = calculateMaxLeverageFactor({
      dsaTokenCollateralFactor: 0.5,
      longTokenCollateralFactor: 0.8,
      proportionalCloseTolerancePercentage: 2,
    });
    const highToleranceResult = calculateMaxLeverageFactor({
      dsaTokenCollateralFactor: 0.5,
      longTokenCollateralFactor: 0.8,
      proportionalCloseTolerancePercentage: 10,
    });

    expect(lowToleranceResult).toMatchInlineSnapshot('2.31');
    expect(highToleranceResult).toMatchInlineSnapshot('1.78');
  });
});
