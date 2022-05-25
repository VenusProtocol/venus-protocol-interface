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
      isXvsEnabled: true,
    });
    expect(earnings?.toString()).toBe('19.50170411097753949326114');
  });

  test('calculates yearly Earnings for array of assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets: assets as Asset[],
      isXvsEnabled: true,
    });
    expect(earnings?.toString()).toBe('205.4729737036564957645186396');
  });
});
