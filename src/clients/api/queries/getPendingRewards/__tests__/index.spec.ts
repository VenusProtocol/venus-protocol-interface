import { Multicall } from 'ethereum-multicall';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getPendingRewardGroups from '..';

const fakeMainPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D';

describe('api/queries/getPendingRewardGroups', () => {
  test('returns pool rewards of the user in the correct format on success', async () => {
    const multicall = {
      // TODO: update fake Multicall response to include isolated pools once
      // some have been released on testnet (see VEN-859)
      call: jest.fn(async () => fakeMulticallResponses.lenses.getPendingRewardGroups),
    } as unknown as Multicall;

    const res = await getPendingRewardGroups({
      mainPoolComptrollerAddress: fakeMainPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [],
      xvsVestingVaultPoolCount: 2,
      multicall,
      accountAddress: fakeAddress,
    });

    expect(multicall.call).toHaveBeenCalledTimes(1);
    expect((multicall.call as jest.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });
});
