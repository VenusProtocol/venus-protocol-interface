import BigNumber from 'bignumber.js';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VrtVault } from 'types/contracts';

import stakeInVrtVault from '.';

const fakeAmountWei = new BigNumber('1000000000000');

describe('api/mutation/stakeInVrtVault', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const depositMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      deposit: depositMock,
    } as unknown as VrtVault;

    const response = await stakeInVrtVault({
      vrtVaultContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
