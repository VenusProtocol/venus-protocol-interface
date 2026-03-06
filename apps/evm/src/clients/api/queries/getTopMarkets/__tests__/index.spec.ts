import type { Mock } from 'vitest';

import { ChainId } from 'types';
import { restService } from 'utilities';

import { type GetTopMarketsResponse, getTopMarkets } from '..';

vi.mock('utilities/restService');

const fakeInput = { chainId: ChainId.BSC_MAINNET };

const fakeApiResponse: GetTopMarketsResponse = {
  limit: 10,
  page: 1,
  total: 2,
  result: [
    { marketAddress: '0x1234567890abcdef1234567890abcdef12345678', chainId: '56' },
    { marketAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', chainId: '56' },
  ],
};

describe('getTopMarkets', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: fakeApiResponse,
    }));
  });

  it('returns top markets on success', async () => {
    const response = await getTopMarkets(fakeInput);

    expect(response).toEqual(fakeApiResponse);
  });

  it('calls the correct endpoint with chainId param', async () => {
    await getTopMarkets(fakeInput);

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: '/top-markets',
      method: 'GET',
      params: { chainId: ChainId.BSC_MAINNET },
    });
  });

  it('throws when the API returns an error payload', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: { error: 'test error' },
    }));

    await expect(async () => getTopMarkets(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when the API returns no payload', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: undefined,
    }));

    await expect(async () => getTopMarkets(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
