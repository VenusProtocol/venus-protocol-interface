import { assetData as assets } from '__mocks__/models/asset';

import {
  calculateYearlyEarningsForAsset,
  calculateYearlyEarningsForAssets,
} from './calculateYearlyEarnings';

describe('calculateYearlyEarnings', () => {
  test('calculates yearly Earnings for single asset', () => {
    const earnings = calculateYearlyEarningsForAsset({
      asset: assets[0],
    });

    expect(earnings.toFixed()).toMatchInlineSnapshot('"19"');
  });

  test('calculates yearly Earnings for array assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets,
    });

    expect(earnings?.toFixed()).toMatchInlineSnapshot('"1006"');
  });
});
