import { assetData as assets } from '__mocks__/models/asset';

import getCombinedDistributionApys from '..';

describe('utilities/getCombinedDistributionApys', () => {
  it('calculates combined distribution APYS correctly', () => {
    assets.forEach(asset => {
      const result = getCombinedDistributionApys({
        asset,
      });

      expect(result).toMatchSnapshot();
    });
  });
});
