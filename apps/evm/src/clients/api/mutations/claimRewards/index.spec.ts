import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { xvs } from '__mocks__/models/tokens';

import type { Multicall3 } from 'libs/contracts';

import claimRewards from '.';
import type { Claim } from './types';

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
  it('calls multicall correctly', async () => {
    const fakeMulticallContract = {
      functions: {
        tryBlockAndAggregate: vi.fn(async () => fakeContractTransaction),
      },
      signer: fakeSigner,
    } as unknown as Multicall3;

    const res = claimRewards({
      multicallContract: fakeMulticallContract,
      legacyPoolComptrollerContractAddress: 'fake-main-pool-comptroller-address',
      vaiVaultContractAddress: 'fake-vai-vault-address',
      xvsVaultContractAddress: 'fake-xvs-vault-address',
      primeContractAddress: 'fake-prime-contract-address',
      accountAddress: fakeAddress,
      claims: fakeClaims,
    });

    expect(res).toStrictEqual({
      contract: fakeMulticallContract,
      args: [
        true,
        [
          {
            callData: '0x1e83409a0000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed848',
            target: 'fake-vai-vault-address',
          },
          {
            callData:
              '0x996cba680000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed848000000000000000000000000b9e0e753630434d7863528cc73cb7ac638a7c8ff0000000000000000000000000000000000000000000000000000000000000000',
            target: 'fake-xvs-vault-address',
          },
          {
            callData:
              '0x86df31ee0000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed8480000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000300000000000000000000000008e0a5575de71037ae36abfafb516595fe68e5e4000000000000000000000000d5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a700000000000000000000000074469281310195a04840daf6edf576f559a3de80',
            target: 'fake-main-pool-comptroller-address',
          },
          {
            callData:
              '0x04caeb100000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed8480000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000037a0ac901578a7f05379fc43330b3d1e39d0c40c00000000000000000000000075a10f0c415dccca275e8cdd8447d291a6b86f06',
            target: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
          },
          {
            callData:
              '0xba437c6800000000000000000000000037a0ac901578a7f05379fc43330b3d1e39d0c40c0000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed848',
            target: 'fake-prime-contract-address',
          },
          {
            callData:
              '0xba437c6800000000000000000000000075a10f0c415dccca275e8cdd8447d291a6b86f060000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed848',
            target: 'fake-prime-contract-address',
          },
        ],
      ],
      methodName: 'tryBlockAndAggregate',
    });
  });

  it('skips claims for which a contract address was not passed', async () => {
    const fakeMulticallContract = {
      functions: {
        tryBlockAndAggregate: vi.fn(async () => fakeContractTransaction),
      },
      signer: fakeSigner,
    } as unknown as Multicall3;

    const res = claimRewards({
      multicallContract: fakeMulticallContract,
      xvsVaultContractAddress: 'fake-xvs-vault-address',
      accountAddress: fakeAddress,
      claims: fakeClaims,
    });

    expect(res).toStrictEqual({
      contract: fakeMulticallContract,
      args: [
        true,
        [
          {
            callData:
              '0x996cba680000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed848000000000000000000000000b9e0e753630434d7863528cc73cb7ac638a7c8ff0000000000000000000000000000000000000000000000000000000000000000',
            target: 'fake-xvs-vault-address',
          },
          {
            callData:
              '0x04caeb100000000000000000000000003d759121234cd36f8124c21afe1c6852d2bed8480000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000037a0ac901578a7f05379fc43330b3d1e39d0c40c00000000000000000000000075a10f0c415dccca275e8cdd8447d291a6b86f06',
            target: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
          },
        ],
      ],
      methodName: 'tryBlockAndAggregate',
    });
  });
});
