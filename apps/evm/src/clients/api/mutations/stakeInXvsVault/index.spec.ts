import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { busd } from '__mocks__/models/tokens';

import type { XvsVault } from 'libs/contracts';

import stakeInXvsVault from '.';

const fakeAmountMantissa = new BigNumber('1000000000000');
const fakePoolIndex = 4;

describe('stakeInXvsVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const depositMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      functions: {
        deposit: depositMock,
      },
      signer: fakeSigner,
    } as unknown as XvsVault;

    const response = await stakeInXvsVault({
      xvsVaultContract: fakeContract,
      rewardToken: busd,
      amountMantissa: fakeAmountMantissa,
      poolIndex: fakePoolIndex,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(depositMock).toHaveBeenCalledTimes(1);
    expect(depositMock).toHaveBeenCalledWith(
      busd.address,
      fakePoolIndex,
      fakeAmountMantissa.toFixed(),
      {},
    );
  });
});
