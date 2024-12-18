import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';

import type { XvsVault } from 'libs/contracts';

import requestWithdrawalFromXvsVault from '.';

const fakeAmountMantissa = new BigNumber('1000000000000');
const fakeRewardTokenAddress = '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47';
const fakePoolIndex = 4;

describe('requestWithdrawalFromXvsVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const requestWithdrawalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        requestWithdrawal: requestWithdrawalMock,
      },
      signer: fakeSigner,
    } as unknown as XvsVault;

    const response = requestWithdrawalFromXvsVault({
      xvsVaultContract: fakeContract,
      rewardTokenAddress: fakeRewardTokenAddress,
      amountMantissa: fakeAmountMantissa,
      poolIndex: fakePoolIndex,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeRewardTokenAddress, fakePoolIndex, fakeAmountMantissa.toFixed()],
      methodName: 'requestWithdrawal',
    });
  });
});
