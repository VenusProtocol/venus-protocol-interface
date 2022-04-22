import BigNumber from 'bignumber.js';
import { Asset } from 'types';
import { assetData as assets } from '__mocks__/models/asset';
import {
  calculateYearlyEarningsForAssets,
  calculateYearlyEarningsCents,
} from './calculateYearlyEarnings';

describe('utilities/calculateYearlyEarnings', () => {
  test('calculates yearly Earnings for single asset', () => {
    const earnings = calculateYearlyEarningsCents({
      asset: assets[0] as Asset,
      borrowBalanceCents: new BigNumber('90.0103018').multipliedBy(100),
      isXvsEnabled: true,
    });
    expect(earnings.yearlyEarningsCents?.toString()).toBe('187.68088062875352240709');
    expect(earnings.supplyBalanceCents?.toString()).toBe('11508.0606');
  });

  test('calculates yearly Earnings for array of assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets: assets as Asset[],
      borrowBalanceCents: new BigNumber('90.0103018').multipliedBy(100),
      isXvsEnabled: true,
    });
    expect(earnings.yearlyEarningsCents?.toString()).toBe('1924.21991227022443813375');
    expect(earnings.supplyBalanceCents?.toString()).toBe('21507.4246');
  });
});
