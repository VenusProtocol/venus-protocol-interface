import { Multicall } from 'ethereum-multicall';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getPendingRewardGroups from '..';

const fakeMainPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D';
const fakeIsolatedPoolComptrollerAddress = '0x1291820b2D1c7c7452A163983Dc888CEC546b78k';

describe('api/queries/getPendingRewardGroups', () => {
  test('returns pool rewards of the user in the correct format on success', async () => {
    const multicall = {
      call: vi.fn(async () => fakeMulticallResponses.lenses.getPendingRewardGroups),
    } as unknown as Multicall;

    const res = await getPendingRewardGroups({
      mainPoolComptrollerAddress: fakeMainPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      xvsVestingVaultPoolCount: 2,
      multicall,
      accountAddress: fakeAddress,
    });

    expect(multicall.call).toHaveBeenCalledTimes(1);
    expect((multicall.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });
});
