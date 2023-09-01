import BigNumber from 'bignumber.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getVTokenApySimulations from '.';

const fakeReserveFactorMantissa = new BigNumber(18);

describe('api/queries/getVTokenApySimulations', () => {
  test('returns the APY simulations in the correct format on success', async () => {
    const multicall3 = {
      call: vi.fn(async () => fakeMulticallResponses.interestRateModel.getVTokenBalances),
    } as unknown as Multicall3;

    const response = await getVTokenApySimulations({
      multicall3,
      reserveFactorMantissa: fakeReserveFactorMantissa,
      interestRateModelContractAddress: fakeAddress,
      isIsolatedPoolMarket: false,
      asset: undefined,
    });

    expect(response).toMatchSnapshot();
  });
});
