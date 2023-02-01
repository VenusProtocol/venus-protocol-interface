import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import { BLOCKS_PER_DAY } from 'constants/bsc';
import { Comptroller } from 'types/contracts';

import getVenusVaiVaultDailyRate from '.';

describe('api/queries/getVenusVaiVaultDailyRate', () => {
  test('returns the vault rate state on success', async () => {
    const fakeOutput = BN.from('1000');

    const venusVaiVaultRateMock = jest.fn(async () => fakeOutput);

    const fakeContract = {
      venusVAIVaultRate: venusVaiVaultRateMock,
    } as unknown as Comptroller;

    const response = await getVenusVaiVaultDailyRate({
      comptrollerContract: fakeContract,
    });

    expect(venusVaiVaultRateMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      dailyRateWei: new BigNumber(fakeOutput.toString()).times(BLOCKS_PER_DAY),
    });
  });
});
