import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import { BLOCKS_PER_DAY } from 'constants/bsc';

import getVenusVaiVaultDailyRate from '.';

describe('api/queries/getVenusVaiVaultDailyRate', () => {
  test('returns the vault rate state on success', async () => {
    const fakeOutput = BN.from('1000');

    const venusVaiVaultRateMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      venusVAIVaultRate: venusVaiVaultRateMock,
    } as unknown as ContractTypeByName<'mainPoolComptroller'>;

    const response = await getVenusVaiVaultDailyRate({
      mainPoolComptrollerContract: fakeContract,
    });

    expect(venusVaiVaultRateMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      dailyRateWei: new BigNumber(fakeOutput.toString()).times(BLOCKS_PER_DAY),
    });
  });
});
