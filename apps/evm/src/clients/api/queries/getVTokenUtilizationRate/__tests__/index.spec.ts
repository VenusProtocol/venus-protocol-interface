import { BigNumber as BN } from 'ethers';

import { assetData } from '__mocks__/models/asset';

import type { JumpRateModel, JumpRateModelV2 } from 'libs/contracts';

import { getVTokenUtilizationRate } from '..';

const fakeInterestRateModelContract = {
  getBorrowRate: async () => BN.from(1),
  getSupplyRate: async () => BN.from(2),
  utilizationRate: async () => BN.from('100000000000000000'),
} as unknown as JumpRateModel;

const fakeInterestRateModelV2Contract = fakeInterestRateModelContract as unknown as JumpRateModelV2;

describe('getVTokenUtilizationRate', () => {
  test('returns the utilization rate in the correct format on success', async () => {
    const response = await getVTokenUtilizationRate({
      interestRateModelContract: fakeInterestRateModelContract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
    });

    expect(response).toMatchSnapshot();
  });

  test('returns the utilization rate of an isolated asset in the correct format on success', async () => {
    const response = await getVTokenUtilizationRate({
      interestRateModelContract: fakeInterestRateModelV2Contract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
    });

    expect(response).toMatchSnapshot();
  });
});
