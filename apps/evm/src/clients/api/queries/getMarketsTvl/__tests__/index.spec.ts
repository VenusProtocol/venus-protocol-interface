import type { Mock } from 'vitest';

import { restService } from 'utilities';

import { type ApiMarketsTvl, getMarketsTvl } from '..';

vi.mock('utilities/restService');

const apiMarketsTvl: ApiMarketsTvl = {
  suppliedSumCents: '123456789',
  borrowedSumCents: '987654321',
  liquiditySumCents: '567890123',
  marketCount: 12,
  poolCount: 4,
  chainCount: 2,
};

describe('getMarketsTvl', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: apiMarketsTvl,
    }));
  });

  it('returns markets TVL on success', async () => {
    const response = await getMarketsTvl();

    expect(response).toEqual(apiMarketsTvl);
  });

  it('calls the correct endpoint', async () => {
    await getMarketsTvl();

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: '/markets/tvl',
      method: 'GET',
    });
  });

  it('throws when the API returns an error payload', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: { error: 'test error' },
    }));

    await expect(async () => getMarketsTvl()).rejects.toThrow('somethingWentWrong');
  });

  it('throws when the API returns no payload', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: undefined,
    }));

    await expect(async () => getMarketsTvl()).rejects.toThrow('somethingWentWrong');
  });
});
