import type Vi from 'vitest';

import { vBusd } from '__mocks__/models/vTokens';

import type { MarketSnapshot } from 'types';
import { restService } from 'utilities';

import getMarketHistory from '..';

vi.mock('utilities/restService');

const marketSnapshot: MarketSnapshot = {
  blockNumber: 1,
  blockTimestamp: 1652593258,
  borrowApy: '2.0144969858718893',
  supplyApy: '0.000001537885451792',
  totalBorrowCents: '1000000000',
  totalSupplyCents: '1234567890',
};

describe('getMarketHistory', () => {
  beforeEach(() => {
    (restService as Vi.Mock).mockImplementation(async () => ({
      data: { result: { data: [marketSnapshot] } },
    }));
  });

  it('returns market history on success', async () => {
    const response = await getMarketHistory({
      vToken: vBusd,
    });

    expect(response).toEqual({
      marketSnapshots: [marketSnapshot],
    });
  });

  it('calls correct endpoint', async () => {
    await getMarketHistory({
      vToken: vBusd,
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: `/markets/history?asset=${vBusd.address}`,
      method: 'GET',
    });
  });
});
