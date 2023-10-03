import { Multicall3 } from 'packages/contracts';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { xvs } from '__mocks__/models/tokens';
import {
  checkForComptrollerTransactionError,
  checkForTokenTransactionError,
  checkForVaiControllerTransactionError,
  checkForVaiVaultTransactionError,
  checkForXvsVaultProxyTransactionError,
} from 'errors/transactionErrors';

import claimRewards from '.';
import { Claim } from './types';

vi.mock('errors/transactionErrors');

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
    contract: 'mainPoolComptroller',
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
];

describe('api/mutation/claimVaiVaultReward', () => {
  test('calls multicall correctly', async () => {
    const fakeMulticallContract = {
      tryBlockAndAggregate: vi.fn(async () => ({
        wait: vi.fn(async () => fakeContractReceipt),
      })),
    } as unknown as Multicall3;

    const res = await claimRewards({
      multicallContract: fakeMulticallContract,
      mainPoolComptrollerContractAddress: 'fake-main-pool-comptroller-address',
      vaiVaultContractAddress: 'fake-vai-vault-address',
      xvsVaultContractAddress: 'fake-xvs-vault-address',
      accountAddress: fakeAddress,
      claims: fakeClaims,
    });

    expect(fakeMulticallContract.tryBlockAndAggregate).toHaveBeenCalledTimes(1);
    expect((fakeMulticallContract.tryBlockAndAggregate as Vi.Mock).mock.calls[0][0]).toBe(true);
    expect(
      (fakeMulticallContract.tryBlockAndAggregate as Vi.Mock).mock.calls[0][1],
    ).toMatchSnapshot();

    // Check it looked for errors present in contract receipt
    expect(checkForComptrollerTransactionError).toHaveBeenCalledTimes(1);
    expect(checkForTokenTransactionError).toHaveBeenCalledWith(res);
    expect(checkForVaiControllerTransactionError).toHaveBeenCalledWith(res);
    expect(checkForVaiVaultTransactionError).toHaveBeenCalledWith(res);
    expect(checkForXvsVaultProxyTransactionError).toHaveBeenCalledWith(res);

    expect(res).toBe(fakeContractReceipt);
  });
});
