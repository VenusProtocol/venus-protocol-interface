import { Asset } from 'types';
import { assetData as assets } from '__mocks__/models/asset';
import BigNumber from 'bignumber.js';
import {
  calculateYearlyEarningsForAssets,
  calculateYearlyEarningsCents,
} from './calculateYearlyEarnings';

describe('utilities/calculateYearlyEarnings', () => {
  test('calculates yearly Earnings for single asset', () => {
    const earnings = calculateYearlyEarningsCents({
      asset: assets[0] as Asset,
      isXvsEnabled: true,
      dailyXvsDistributionInterestsCents: new BigNumber('1'),
    });
    expect(earnings?.toString()).toBe('371.01347989955426636283938');
  });

  test('calculates yearly Earnings for array of assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets: assets as Asset[],
      isXvsEnabled: true,
      dailyXvsDistributionInterestsCents: new BigNumber('1'),
    });
    expect(earnings?.toString()).toBe('1453.1539791909694477516141');
  });
});
