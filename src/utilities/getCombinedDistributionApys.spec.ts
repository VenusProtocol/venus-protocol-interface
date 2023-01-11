import { assetData as assets } from '__mocks__/models/asset';

import getCombinedDistributionApys from './getCombinedDistributionApys';

describe('utilities/getCombinedDistributionApys', () => {
  test('calculates combined distribution APYS correctly', () => {
    const distributionApys = getCombinedDistributionApys({
      asset: assets[0],
    });

    expect(distributionApys.borrowApyPercentage.toFixed()).toMatchInlineSnapshot(
      '"4.17469243006608279"',
    );
    expect(distributionApys.supplyApyPercentage.toFixed()).toMatchInlineSnapshot(
      '"0.11720675342484096"',
    );
  });
});
