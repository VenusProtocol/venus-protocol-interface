import BigNumber from 'bignumber.js';
import { VaiVault } from 'packages/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import withdrawFromVaiVault from '.';

const fakeAmountWei = new BigNumber('1000000000000');

describe('withdrawFromVaiVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const withdrawMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      withdraw: withdrawMock,
    } as unknown as VaiVault;

    const response = await withdrawFromVaiVault({
      vaiVaultContract: fakeContract,
      amountWei: fakeAmountWei,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(withdrawMock).toHaveBeenCalledTimes(1);
    expect(withdrawMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
  });
});
