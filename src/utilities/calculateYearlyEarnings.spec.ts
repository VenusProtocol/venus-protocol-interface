import { assetData as assets } from '__mocks__/models/asset';

import {
  calculateYearlyEarningsForAsset,
  calculateYearlyEarningsForAssets,
} from './calculateYearlyEarnings';

describe('utilities/calculateYearlyEarnings', () => {
  test('calculates yearly Earnings for single core pool asset', () => {
    const earnings = calculateYearlyEarningsForAsset({
      asset: assets[0],
      isAssetIsolated: false,
    });

    expect(earnings.toFixed()).toMatchInlineSnapshot('"19"');
  });

  test('calculates yearly Earnings for single isolated asset', () => {
    const earnings = calculateYearlyEarningsForAsset({
      asset: assets[0],
      isAssetIsolated: true,
    });

    expect(earnings.toFixed()).toMatchInlineSnapshot('"6"');
  });

  test('calculates yearly Earnings for array of core pool assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets,
      areAssetsIsolated: false,
    });

    expect(earnings?.toFixed()).toMatchInlineSnapshot('"1006"');
  });

  test('calculates yearly Earnings for array of isolated assets', () => {
    const earnings = calculateYearlyEarningsForAssets({
      assets,
      areAssetsIsolated: true,
    });

    expect(earnings?.toFixed()).toMatchInlineSnapshot('"794"');
  });
});
