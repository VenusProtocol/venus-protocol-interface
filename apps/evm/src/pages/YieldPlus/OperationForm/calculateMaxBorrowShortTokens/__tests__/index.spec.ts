import BigNumber from 'bignumber.js';

import { calculateMaxBorrowShortTokens } from '..';

describe('calculateMaxBorrowShortTokens', () => {
  it('returns expected capacity for a new position with no existing exposure', () => {
    const result = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber(10),
      dsaTokenPriceCents: 100,
      dsaTokenCollateralFactor: 0.8,
      longAmountTokens: new BigNumber(0),
      longTokenPriceCents: 100,
      longTokenCollateralFactor: 0.8,
      shortAmountTokens: new BigNumber(0),
      shortTokenPriceCents: 100,
      leverageFactor: 2,
      shortTokenDecimals: 18,
    });

    expect(result.toFixed()).toBe('20');
  });

  it('returns lower capacity when position already has long and short exposure', () => {
    const result = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber(10),
      dsaTokenPriceCents: 100,
      dsaTokenCollateralFactor: 0.8,
      longAmountTokens: new BigNumber(4),
      longTokenPriceCents: 100,
      longTokenCollateralFactor: 0.8,
      shortAmountTokens: new BigNumber(8),
      shortTokenPriceCents: 100,
      leverageFactor: 2,
      shortTokenDecimals: 18,
    });

    expect(result.toFixed()).toBe('8');
  });

  it('keeps stable output for a representative existing position input set', () => {
    const result = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber('12.345'),
      dsaTokenPriceCents: 102.34,
      dsaTokenCollateralFactor: 0.79,
      longAmountTokens: new BigNumber('4.2'),
      longTokenPriceCents: 217.3,
      longTokenCollateralFactor: 0.66,
      shortAmountTokens: new BigNumber('3.3'),
      shortTokenPriceCents: 95.12,
      leverageFactor: 2.47,
      shortTokenDecimals: 6,
    });

    expect(result.toFixed()).toBe('29.478553');
  });

  it('reduces clamped leverage and borrow capacity when collateral factors are reduced', () => {
    const beforeCfDrop = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber(10),
      dsaTokenPriceCents: 100,
      dsaTokenCollateralFactor: 0.8,
      longAmountTokens: new BigNumber(4),
      longTokenPriceCents: 100,
      longTokenCollateralFactor: 0.8,
      shortAmountTokens: new BigNumber(8),
      shortTokenPriceCents: 100,
      leverageFactor: 2,
      shortTokenDecimals: 18,
    });

    const afterCfDrop = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber(10),
      dsaTokenPriceCents: 100,
      dsaTokenCollateralFactor: 0.8,
      longAmountTokens: new BigNumber(4),
      longTokenPriceCents: 100,
      longTokenCollateralFactor: 0.2,
      shortAmountTokens: new BigNumber(8),
      shortTokenPriceCents: 100,
      leverageFactor: 2,
      shortTokenDecimals: 18,
    });

    expect(afterCfDrop.toFixed()).toBe('2');
    expect(afterCfDrop.isLessThan(beforeCfDrop)).toBe(true);
  });

  it('floors token capacity using short token decimals', () => {
    const result = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber(10),
      dsaTokenPriceCents: 100,
      dsaTokenCollateralFactor: 0.8,
      longAmountTokens: new BigNumber(0),
      longTokenPriceCents: 100,
      longTokenCollateralFactor: 0.8,
      shortAmountTokens: new BigNumber(0),
      shortTokenPriceCents: 90,
      leverageFactor: 2,
      shortTokenDecimals: 2,
    });

    expect(result.toFixed()).toBe('22.22');
  });

  it('uses full principal as actual utilized when dsa collateral factor is zero and excess borrow exists', () => {
    const result = calculateMaxBorrowShortTokens({
      dsaAmountTokens: new BigNumber(10),
      dsaTokenPriceCents: 100,
      dsaTokenCollateralFactor: 0,
      longAmountTokens: new BigNumber(2),
      longTokenPriceCents: 100,
      longTokenCollateralFactor: 0.8,
      shortAmountTokens: new BigNumber(8),
      shortTokenPriceCents: 100,
      leverageFactor: 2,
      shortTokenDecimals: 18,
    });

    expect(result.toFixed()).toBe('0');
  });
});
