import { VError } from 'errors';
import { MarketSnapshot } from 'types';
import { restService } from 'utilities';

import getMarketHistory from '.';

jest.mock('utilities/restService');

const marketSnapshot: MarketSnapshot = {
  id: '18d50fb4-ebe8-4dd6-b0d6-0e052b968ec6',
  asset: '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
  blockNumber: 1,
  blockTimestamp: 1652593258,
  borrowApy: '2.0144969858718893',
  borrowVenusApy: '0.000002129447247135',
  exchangeRate: '212011549336411',
  supplyApy: '0.000001537885451792',
  supplyVenusApy: '0.000000000001825',
  totalBorrow: '71999131879185046048588013',
  totalSupply: '47171999131879185046048588013',
  createdAt: '2022-05-15T06:00:00.000Z',
  updatedAt: '2022-05-15T06:00:00.000Z',
  priceUSD: '1.00028324',
};

describe('api/queries/getMarketHistory', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getMarketHistory({
        vTokenId: 'aave',
      });

      throw new Error('getMarketHistory should have thrown an error but did not');
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.data.message).toBe('Fake error message');
      }
    }
  });

  test('returns market history on success', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { result: [marketSnapshot] } },
    }));

    const response = await getMarketHistory({
      vTokenId: 'aave',
    });

    expect(response).toEqual({
      marketSnapshots: [marketSnapshot],
    });
  });

  test('calls correct endpoint when passing limit and type params', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { result: [marketSnapshot] } },
    }));

    await getMarketHistory({
      vTokenId: 'aave',
      type: 'fake-type',
      limit: 6,
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint:
        '/market_history/graph?asset=0x714db6c38A17883964B68a07d56cE331501d9eb6&type=fake-type&limit=6',
      method: 'GET',
    });
  });
});
