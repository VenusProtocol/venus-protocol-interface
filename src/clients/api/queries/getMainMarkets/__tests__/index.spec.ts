import { restService } from 'utilities';
import Vi from 'vitest';

import { markets as fakeMarkets } from '__mocks__/models/markets';

import getMainMarkets from '..';

vi.mock('utilities/restService');

describe('api/queries/getMainMarkets', () => {
  test('returns formatted markets on success', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { markets: [fakeMarkets] } },
    }));

    const { markets } = await getMainMarkets();

    expect(markets).toMatchSnapshot();
  });
});
