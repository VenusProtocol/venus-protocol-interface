import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { XvsVault } from 'libs/contracts';

import executeWithdrawalFromXvsVault from '.';

const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('executeWithdrawalFromXvsVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const executeWithdrawalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        executeWithdrawal: executeWithdrawalMock,
      },
      signer: fakeSigner,
    } as unknown as XvsVault;

    const response = executeWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeRewardTokenAddress,
      poolIndex: fakePoolIndex,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeRewardTokenAddress, fakePoolIndex],
      methodName: 'executeWithdrawal',
    });
  });
});
