import BigNumber from 'bignumber.js';
import { HypotheticalPrimeDistribution } from 'types';

import { assetData as assets } from '__mocks__/models/asset';
import { xvs } from '__mocks__/models/tokens';

import { getCombinedDistributionApys } from '..';

describe('getCombinedDistributionApys', () => {
  it('calculates combined distribution APYS correctly', () => {
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

  it('filters out distributions of the type "hypotheticalPrime"', () => {
    const fakeHypotheticalPrimeDistribution: HypotheticalPrimeDistribution = {
      type: 'hypotheticalPrime',
      token: xvs,
      apyPercentage: new BigNumber('5.13'),
    };

    const distributionApys = getCombinedDistributionApys({
      asset: {
        ...assets[0],
        borrowDistributions: [...assets[0].borrowDistributions, fakeHypotheticalPrimeDistribution],
        supplyDistributions: [...assets[0].supplyDistributions, fakeHypotheticalPrimeDistribution],
      },
    });

    expect(distributionApys.borrowApyPercentage.toFixed()).toMatchInlineSnapshot(
      '"4.17469243006608279"',
    );
    expect(distributionApys.supplyApyPercentage.toFixed()).toMatchInlineSnapshot(
      '"0.11720675342484096"',
    );
  });
});
