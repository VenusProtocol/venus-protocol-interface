import BigNumber from 'bignumber.js';
import { XvsVault } from 'libs/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { busd } from '__mocks__/models/tokens';

import stakeInXvsVault from '.';

const fakeAmountMantissa = new BigNumber('1000000000000');
const fakePoolIndex = 4;

describe('stakeInXvsVault', () => {
  test('returns contract transaction when request succeeds', async () => {
    const depositMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      deposit: depositMock,
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
    );
  });
});
