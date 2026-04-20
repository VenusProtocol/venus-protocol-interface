import BigNumber from 'bignumber.js';

import { yieldPlusPositions } from '__mocks__/models/yieldPlus';

import type { CalculateMaxBorrowShortTokensInput } from '..';
import { calculateMaxBorrowShortTokens } from '..';

const basePosition = yieldPlusPositions[0];

const baseInput: CalculateMaxBorrowShortTokensInput = {
  dsaAmountTokens: new BigNumber(10),
  dsaTokenPriceCents: 100,
  dsaTokenCollateralFactor: 0.5,
  longAmountTokens: new BigNumber(0),
  longTokenPriceCents: 100,
  longTokenCollateralFactor: 0.8,
  shortAmountTokens: new BigNumber(0),
  shortTokenPriceCents: 200,
  leverageFactor: 2,
  shortTokenDecimals: 6,
  proportionalCloseTolerancePercentage: 2,
};

describe('calculateMaxBorrowShortTokens', () => {
  it('returns the expected max borrow amount for an existing position', () => {
    const input: CalculateMaxBorrowShortTokensInput = {
      ...baseInput,
      dsaAmountTokens: basePosition.dsaBalanceTokens,
      dsaTokenPriceCents: basePosition.dsaAsset.tokenPriceCents,
      dsaTokenCollateralFactor: basePosition.dsaAsset.userCollateralFactor,
      longAmountTokens: basePosition.longBalanceTokens,
      longTokenPriceCents: basePosition.longAsset.tokenPriceCents,
      longTokenCollateralFactor: basePosition.longAsset.userCollateralFactor,
      shortAmountTokens: basePosition.shortBalanceTokens,
      shortTokenPriceCents: basePosition.shortAsset.tokenPriceCents,
      leverageFactor: basePosition.leverageFactor,
      shortTokenDecimals: basePosition.shortAsset.vToken.underlyingToken.decimals,
    };

    const result = calculateMaxBorrowShortTokens(input);

    expect(result.toFixed()).toMatchInlineSnapshot(`"180.138339124513271987"`);
  });

  it('floors the borrow capacity in cents before converting to short tokens', () => {
    const result = calculateMaxBorrowShortTokens({
      ...baseInput,
      dsaAmountTokens: new BigNumber(1.01),
      leverageFactor: 1.5,
      shortTokenPriceCents: 37,
      shortTokenDecimals: 2,
    });

    expect(result.toFixed()).toMatchInlineSnapshot('"4.08"');
  });

  it('returns zero when there is no unused collateral', () => {
    const result = calculateMaxBorrowShortTokens({
      ...baseInput,
      leverageFactor: 1,
      shortAmountTokens: new BigNumber(10),
      shortTokenPriceCents: 100,
    });

    expect(result.toFixed()).toMatchInlineSnapshot('"0"');
  });
});
