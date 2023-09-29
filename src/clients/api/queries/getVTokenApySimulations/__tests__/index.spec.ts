import { BigNumber as BN } from 'ethers';
import { JumpRateModel, JumpRateModelV2 } from 'packages/contractsNew';

import { assetData } from '__mocks__/models/asset';

import getVTokenApySimulations from '..';

const fakeInterestRateModelContract = {
  getBorrowRate: async () => BN.from(1),
  getSupplyRate: async () => BN.from(2),
  utilizationRate: async () => BN.from('100000000000000000'),
} as unknown as JumpRateModel;

const fakeInterestRateModelV2Contract = fakeInterestRateModelContract as unknown as JumpRateModelV2;

describe('api/queries/getVTokenApySimulations', () => {
  test('returns the APY simulations in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      interestRateModelContract: fakeInterestRateModelContract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
    });

    expect(response).toMatchSnapshot();
  });

  test('returns the APY simulations of an isolated asset in the correct format on success', async () => {
    const response = await getVTokenApySimulations({
      interestRateModelContract: fakeInterestRateModelV2Contract,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
    });

    expect(response).toMatchSnapshot();
  });
});
