import { assetData as assets } from '__mocks__/models/asset';

import {
  calculateYearlyEarningsForAsset,
  calculateYearlyEarningsForAssets,
} from './calculateYearlyEarnings';

describe('utilities/calculateYearlyEarnings', () => {
  test('calculates yearly Earnings for single asset', () => {
    const earnings = calculateYearlyEarningsForAsset({
      asset: assets[0],
    });

    expect(earnings.toFixed()).toMatchInlineSnapshot('"20"');
  });

  test('calculates yearly Earnings for array of assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets,
    });

    expect(earnings?.toFixed()).toMatchInlineSnapshot('"206"');
  });
});
