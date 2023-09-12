import { restService } from 'utilities';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';

import getMainMarkets, { ApiMarket } from '..';

const apiMarkets: ApiMarket[] = [
  {
    address: fakeAddress,
    underlyingDecimal: 18,
    totalDistributedMantissa: '959736453684596858981282',
    borrowerCount: 1,
    supplierCount: 2,
  },
];

vi.mock('utilities/restService');

describe('api/queries/getMainMarkets', () => {
  test('returns formatted markets on success', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { result: apiMarkets },
    }));

    const { markets } = await getMainMarkets();

    expect(markets).toMatchSnapshot();
  });
});
