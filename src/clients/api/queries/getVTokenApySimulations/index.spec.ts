import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getVTokenApySimulations from '.';

const fakeReserveFactorMantissa = new BigNumber(18);

describe('api/queries/getVTokenApySimulations', () => {
  test('returns the APY simulations in the correct format on success', async () => {
    const multicall = {
      call: vi.fn(async () => fakeMulticallResponses.interestRateModel.getVTokenBalances),
    } as unknown as Multicall;

    const response = await getVTokenApySimulations({
      multicall,
      reserveFactorMantissa: fakeReserveFactorMantissa,
      interestRateModelContractAddress: fakeAddress,
      isIsolatedPoolMarket: false,
    });

    expect(response).toMatchSnapshot();
  });
});
