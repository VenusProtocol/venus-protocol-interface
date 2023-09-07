import { MarketSnapshot } from 'types';
import { restService } from 'utilities';
import Vi from 'vitest';

import { vBusd } from '__mocks__/models/vTokens';

import getMarketHistory from '.';

vi.mock('utilities/restService');

const marketSnapshot: MarketSnapshot = {
  blockNumber: 1,
  blockTimestamp: 1652593258,
  borrowApy: '2.0144969858718893',
  supplyApy: '0.000001537885451792',
  totalBorrowCents: '1000000000',
  totalSupplyCents: '1234567890',
};

describe('api/queries/getMarketHistory', () => {
  test('returns market history on success', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { data: [marketSnapshot] } },
    }));

    const response = await getMarketHistory({
      vToken: vBusd,
    });

    expect(response).toEqual({
      marketSnapshots: [marketSnapshot],
    });
  });

  test('calls correct endpoint when passing type params', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { data: [marketSnapshot] } },
    }));

    await getMarketHistory({
      vToken: vBusd,
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: `/markets/history?asset=${vBusd.address}&version=v2`,
      method: 'GET',
    });
  });
});
