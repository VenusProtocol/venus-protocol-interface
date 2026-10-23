import { getMarketRole } from '..';

describe('getMarketRole', () => {
  it('keeps the side returned by the API for a liquidity market', () => {
    expect(
      getMarketRole({ side: 'liquidity', liquidationThresholdMantissa: '880000000000000000' }),
    ).toEqual({ isLiquiditySide: true, isInactive: false });
  });

  it('keeps the side returned by the API for a collateral market', () => {
    expect(
      getMarketRole({ side: 'collateral', liquidationThresholdMantissa: '880000000000000000' }),
    ).toEqual({ isLiquiditySide: false, isInactive: false });
  });

  it('puts an inactive market with a liquidation threshold on the collateral side', () => {
    expect(
      getMarketRole({ side: 'inactive', liquidationThresholdMantissa: '800000000000000000' }),
    ).toEqual({ isLiquiditySide: false, isInactive: true });
  });

  it('puts an inactive market without a liquidation threshold on the liquidity side', () => {
    expect(getMarketRole({ side: 'inactive', liquidationThresholdMantissa: '0' })).toEqual({
      isLiquiditySide: true,
      isInactive: true,
    });
  });
});
