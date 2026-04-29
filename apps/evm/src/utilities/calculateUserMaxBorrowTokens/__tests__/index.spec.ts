import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { calculateUserMaxBorrowTokens } from '..';

describe('calculateUserMaxBorrowTokens', () => {
  it('returns user max borrow amount from borrowing power and collateral factor', () => {
    const result = calculateUserMaxBorrowTokens({
      borrowedAsset: {
        ...assetData[1],
        tokenPriceCents: new BigNumber(100),
        tokenBorrowPriceCents: new BigNumber(100),
        borrowCapTokens: new BigNumber(1000),
        borrowBalanceTokens: new BigNumber(100),
        cashTokens: new BigNumber(1000),
      },
      suppliedAsset: {
        ...assetData[0],
        userCollateralFactor: 0.5,
      },
      userBorrowingPowerCents: new BigNumber(100),
    });

    expect(result.toString()).toBe('2');
  });

  it('limits max borrow amount by borrow cap margin', () => {
    const result = calculateUserMaxBorrowTokens({
      borrowedAsset: {
        ...assetData[1],
        tokenPriceCents: new BigNumber(100),
        borrowCapTokens: new BigNumber(101),
        borrowBalanceTokens: new BigNumber(100),
        cashTokens: new BigNumber(1000),
      },
      suppliedAsset: {
        ...assetData[0],
        userCollateralFactor: 0.5,
      },
      userBorrowingPowerCents: new BigNumber(100),
    });

    expect(result.toString()).toBe('1');
  });

  it('limits max borrow amount by available cash', () => {
    const result = calculateUserMaxBorrowTokens({
      borrowedAsset: {
        ...assetData[1],
        tokenPriceCents: new BigNumber(100),
        borrowCapTokens: new BigNumber(1000),
        borrowBalanceTokens: new BigNumber(100),
        cashTokens: new BigNumber('0.75'),
      },
      suppliedAsset: {
        ...assetData[0],
        userCollateralFactor: 0.5,
      },
      userBorrowingPowerCents: new BigNumber(100),
    });

    expect(result.toString()).toBe('0.75');
  });

  it('truncates token amount to borrowed token decimals', () => {
    const result = calculateUserMaxBorrowTokens({
      borrowedAsset: {
        ...assetData[1],
        tokenPriceCents: new BigNumber('101.250031'),
        tokenBorrowPriceCents: new BigNumber('101.250031'),
        borrowCapTokens: new BigNumber(1000),
        borrowBalanceTokens: new BigNumber(100),
        cashTokens: new BigNumber(1000),
      },
      suppliedAsset: {
        ...assetData[0],
        userCollateralFactor: 0.2,
      },
      userBorrowingPowerCents: new BigNumber(100),
    });

    expect(result.toFixed()).toBe('1.234567');
  });

  it('clamps negative values to zero', () => {
    const result = calculateUserMaxBorrowTokens({
      borrowedAsset: {
        ...assetData[1],
        tokenPriceCents: new BigNumber(100),
        borrowCapTokens: new BigNumber(99),
        borrowBalanceTokens: new BigNumber(100),
        cashTokens: new BigNumber(1000),
      },
      suppliedAsset: {
        ...assetData[0],
        userCollateralFactor: 0.5,
      },
      userBorrowingPowerCents: new BigNumber(100),
    });

    expect(result.toString()).toBe('0');
  });
});
