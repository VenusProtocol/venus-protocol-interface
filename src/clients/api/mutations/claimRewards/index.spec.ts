import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { xvs } from '__mocks__/models/tokens';

import { Multicall3 } from 'packages/contracts';

import claimRewards from '.';
import { Claim } from './types';

const fakeClaims: Claim[] = [
  {
    contract: 'vaiVault',
  },
  {
    contract: 'xvsVestingVault',
    rewardToken: xvs,
    poolIndex: 0,
  },
  {
    contract: 'legacyPoolComptroller',
    vTokenAddressesWithPendingReward: [
      '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
      '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
      '0x74469281310195a04840daf6edf576f559a3de80',
    ],
  },
  {
    contract: 'rewardsDistributor',
    contractAddress: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
    comptrollerContractAddress: '0x19Hfee254729296a45a3885639AC7E10F9d54979',
    vTokenAddressesWithPendingReward: [
      '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
      '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
    ],
  },
  {
    contract: 'prime',
    vTokenAddressesWithPendingReward: [
      '0x37a0ac901578a7f05379fc43330b3d1e39d0c40c',
      '0x75a10f0c415dccca275e8cdd8447d291a6b86f06',
    ],
  },
];

describe('claimRewards', () => {
  test('calls multicall correctly', async () => {
    const fakeMulticallContract = {
      tryBlockAndAggregate: vi.fn(async () => fakeContractTransaction),
    } as unknown as Multicall3;

    const res = await claimRewards({
      multicallContract: fakeMulticallContract,
      legacyPoolComptrollerContractAddress: 'fake-main-pool-comptroller-address',
      vaiVaultContractAddress: 'fake-vai-vault-address',
      xvsVaultContractAddress: 'fake-xvs-vault-address',
      primeContractAddress: 'fake-prime-contract-address',
      accountAddress: fakeAddress,
      claims: fakeClaims,
    });

    expect(fakeMulticallContract.tryBlockAndAggregate).toHaveBeenCalledTimes(1);
    expect((fakeMulticallContract.tryBlockAndAggregate as Vi.Mock).mock.calls[0][0]).toBe(true);
    expect(
      (fakeMulticallContract.tryBlockAndAggregate as Vi.Mock).mock.calls[0][1],
    ).toMatchSnapshot();

    expect(res).toBe(fakeContractTransaction);
  });
});
