import type { Mock } from 'vitest';

import spokeMarketHistoryResponse from '__mocks__/api/spokeMarketHistory.json';
import { ChainId } from 'types';
import { restService } from 'utilities';

import { getSpokeMarketHistory } from '..';

vi.mock('utilities/restService');

const fakeVTokenAddress = '0xC88bAF0bA49a98F15A00182752f6d10bd3932F6a';

describe('getSpokeMarketHistory', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({ data: spokeMarketHistoryResponse }));
  });

  it('converts seconds, decimals and cent strings into chart points', async () => {
    const { marketSnapshots } = await getSpokeMarketHistory({
      chainId: ChainId.BSC_TESTNET,
      vTokenAddress: fakeVTokenAddress,
      period: '1w',
    });

    expect(marketSnapshots[1]).toEqual({
      blockTimestamp: 1790154764000,
      borrowApyPercentage: 4.55,
      totalBorrowCents: 200000,
    });
    expect(restService).toHaveBeenCalledWith({
      endpoint: `/spoke/markets/${fakeVTokenAddress}/history`,
      method: 'GET',
      params: { chainId: ChainId.BSC_TESTNET, range: '1w' },
    });
  });

  it('throws when the API returns an error', async () => {
    (restService as Mock).mockImplementation(async () => ({ data: { error: 'boom' } }));

    await expect(
      getSpokeMarketHistory({
        chainId: ChainId.BSC_TESTNET,
        vTokenAddress: fakeVTokenAddress,
        period: '1w',
      }),
    ).rejects.toThrow();
  });
});
