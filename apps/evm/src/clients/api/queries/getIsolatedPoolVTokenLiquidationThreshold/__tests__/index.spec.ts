import fakeComptrollerContractAddress from '__mocks__/models/address';
import type { PublicClient } from 'viem';

import { vXvs } from '__mocks__/models/vTokens';
import { getIsolatedPoolVTokenLiquidationThreshold } from '..';

describe('getIsolatedPoolVTokenLiquidationThreshold', () => {
  test('returns liquidation threshold on success', async () => {
    const fakeLiquidationThresholdMantissa = 900000000000000000n; // 90% with 18 decimals

    const readContractMock = vi.fn(async () => [0n, 0n, fakeLiquidationThresholdMantissa]);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getIsolatedPoolVTokenLiquidationThreshold({
      publicClient: fakePublicClient,
      poolComptrollerContractAddress: fakeComptrollerContractAddress,
      vTokenAddress: vXvs.address,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: fakeComptrollerContractAddress,
      functionName: 'markets',
      args: [vXvs.address],
    });

    expect(response).toMatchInlineSnapshot(`
      {
        "liquidationThresholdPercentage": 90,
      }
    `);
  });
});
