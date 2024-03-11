import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { VaiVault } from 'libs/contracts';

import stakeInVaiVault from '.';

const fakeAmountMantissa = new BigNumber('1000000000000');

describe('stakeInVaiVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const depositMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      deposit: depositMock,
    } as unknown as VaiVault;

    const response = await stakeInVaiVault({
      vaiVaultContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
