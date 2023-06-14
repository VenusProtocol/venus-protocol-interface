import { restService } from 'utilities';

import voterHistoryResponse from '__mocks__/api/voterHistory.json';
import fakeAddress from '__mocks__/models/address';

import getVoterHistory from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoterHistory', () => {
  test('returns formatted voter history', async () => {
    (restService as vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterHistoryResponse,
    }));

    const payload = await getVoterHistory({
      page: 2,
      address: fakeAddress,
    });

    expect(restService).toBeCalledWith({
      endpoint: `/voters/history/${fakeAddress}`,
      method: 'GET',
      params: {
        limit: 6,
        offset: 12,
        version: 'v2',
      },
    });

    expect(payload).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterHistoryResponse,
    }));

    const payload = await getVoterHistory({ address: fakeAddress });

    expect(payload.voterHistory).toHaveLength(5);

    expect(restService).toBeCalledWith({
      endpoint: `/voters/history/${fakeAddress}`,
      method: 'GET',
      params: {
        limit: 6,
        offset: 0,
        version: 'v2',
      },
    });

    expect(payload).toMatchSnapshot();
  });
});
