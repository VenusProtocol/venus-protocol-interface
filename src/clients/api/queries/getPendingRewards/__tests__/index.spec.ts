import { ContractCallContext, Multicall } from 'ethereum-multicall';
import Vi from 'vitest';

import fakeMulticallResponses from '__mocks__/contracts/multicall';
import fakeAddress from '__mocks__/models/address';

import getPendingRewardGroups from '..';

const fakeMainPoolComptrollerAddress = '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D';
const fakeIsolatedPoolComptrollerAddress = '0x1291820b2D1c7c7452A163983Dc888CEC546b78k';
const fakeVenusLensContractAddress = '0x14d1820b2D1c7c7452A163983Dc888CEC546b7897';
const fakePoolLensContractAddress = '0x24d1820b2D1c7c7452A163983Dc888CEC546b7897';
const fakeVaiVaultContractAddress = '0x34d1820b2D1c7c7452A163983Dc888CEC546b7897';
const fakeXvsVaultContractAddress = '0x44d1820b2D1c7c7452A163983Dc888CEC546b7897';
const fakeResilientOracleContractAddress = '0x23d1820b2D1c7c7452A163983Dc888CEC546b7897';

describe('api/queries/getPendingRewardGroups', () => {
  test('returns pool rewards of the user in the correct format on success', async () => {
    const multicall = {
      call: vi.fn(async (context: ContractCallContext) =>
        context?.reference === 'resilientOracle'
          ? fakeMulticallResponses.resilientOracle
          : fakeMulticallResponses.lenses.getPendingRewardGroups,
      ),
    } as unknown as Multicall;

    const res = await getPendingRewardGroups({
      mainPoolComptrollerContractAddress: fakeMainPoolComptrollerAddress,
      isolatedPoolComptrollerAddresses: [fakeIsolatedPoolComptrollerAddress],
      xvsVestingVaultPoolCount: 2,
      multicall,
      accountAddress: fakeAddress,
      venusLensContractAddress: fakeVenusLensContractAddress,
      resilientOracleContractAddress: fakeResilientOracleContractAddress,
      poolLensContractAddress: fakePoolLensContractAddress,
      vaiVaultContractAddress: fakeVaiVaultContractAddress,
      xvsVaultContractAddress: fakeXvsVaultContractAddress,
    });

    expect(multicall.call).toHaveBeenCalledTimes(2);
    expect((multicall.call as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();

    expect(res).toMatchSnapshot();
  });
});
