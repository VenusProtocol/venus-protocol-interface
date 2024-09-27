import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import { ChainId } from '@venusprotocol/chains';
import { chainMetadata } from '@venusprotocol/chains';
import type { LegacyPoolComptroller } from 'libs/contracts';

import getVenusVaiVaultDailyRate from '.';

describe('api/queries/getVenusVaiVaultDailyRate', () => {
  test('returns the vault rate state on success', async () => {
    const fakeOutput = BN.from('1000');

    const venusVaiVaultRateMock = vi.fn(async () => fakeOutput);

    const fakeContract = {
      venusVAIVaultRate: venusVaiVaultRateMock,
    } as unknown as LegacyPoolComptroller;

    const response = await getVenusVaiVaultDailyRate({
      legacyPoolComptrollerContract: fakeContract,
      blocksPerDay: 28800,
    });

    expect(venusVaiVaultRateMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      dailyRateMantissa: new BigNumber(fakeOutput.toString()).times(
        chainMetadata[ChainId.BSC_TESTNET].blocksPerDay!,
      ),
    });
  });
});
