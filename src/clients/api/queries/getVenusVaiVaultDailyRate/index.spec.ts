import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { MainPoolComptroller } from 'packages/contracts';
import { ChainId } from 'types';

import { CHAIN_METADATA } from 'constants/chainMetadata';

import getVenusVaiVaultDailyRate from '.';

describe('api/queries/getVenusVaiVaultDailyRate', () => {
  test('returns the vault rate state on success', async () => {
    const fakeOutput = BN.from('1000');

    const venusVaiVaultRateMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      venusVAIVaultRate: venusVaiVaultRateMock,
    } as unknown as MainPoolComptroller;

    const response = await getVenusVaiVaultDailyRate({
      mainPoolComptrollerContract: fakeContract,
      blocksPerDay: 28800,
    });

    expect(venusVaiVaultRateMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      dailyRateWei: new BigNumber(fakeOutput.toString()).times(
        CHAIN_METADATA[ChainId.BSC_TESTNET].blocksPerDay,
      ),
    });
  });
});
