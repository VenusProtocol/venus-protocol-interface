import { BigNumber as BN } from 'ethers';

import { assetData } from '__mocks__/models/asset';

import type { JumpRateModel, JumpRateModelV2 } from 'libs/contracts';

import getVTokenApySimulations from '..';

const fakeInterestRateModelContract = {
  getBorrowRate: async () => BN.from(1),
  getSupplyRate: async () => BN.from(2),
  utilizationRate: async () => BN.from('100000000000000000'),
} as unknown as JumpRateModel;

const fakeInterestRateModelV2Contract = fakeInterestRateModelContract as unknown as JumpRateModelV2;

describe('api/queries/getVTokenApySimulations', () => {
  it('returns the APY simulations in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      interestRateModelContract: fakeInterestRateModelContract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
      blocksPerDay: 28800,
    });

    expect(response).toMatchSnapshot();
  });

  it('returns the APY simulations of an isolated asset on a chain with block based rates in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      interestRateModelContract: fakeInterestRateModelV2Contract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
      blocksPerDay: 28800,
    });

    expect(response).toMatchSnapshot();
  });

  it('returns the APY simulations of an isolated asset on a chain with time based rates in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      interestRateModelContract: fakeInterestRateModelV2Contract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
    });

    expect(response).toMatchSnapshot();
  });
});
