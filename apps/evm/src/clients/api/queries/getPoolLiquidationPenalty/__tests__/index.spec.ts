import type { PublicClient } from 'viem';

import fakeAccountAddress from '__mocks__/models/address';

import { getPoolLiquidationPenalty } from '..';

describe('getPoolLiquidationPenalty', () => {
  test('returns the liquidation incentive percentage on success', async () => {
    const fakeLiquidationIncentiveMantissa = BigInt('2000000000000000000');

    const readContractMock = vi.fn(async () => fakeLiquidationIncentiveMantissa);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getPoolLiquidationPenalty({
      publicClient: fakePublicClient,
      poolComptrollerContractAddress: fakeAccountAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAccountAddress,
      abi: expect.any(Object),
      functionName: 'liquidationIncentiveMantissa',
    });
    expect(response).toMatchInlineSnapshot(`
      {
        "liquidationPenaltyPercentage": 100,
      }
    `);
  });
});
