import Vi from 'vitest';

import voterHistoryResponse from '__mocks__/api/voterHistory.json';
import fakeAddress from '__mocks__/models/address';

import { restService } from 'utilities';

import getVoterHistory from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoterHistory', () => {
  test('returns formatted voter history', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterHistoryResponse,
    }));

    const payload = await getVoterHistory({
      page: 2,
      address: fakeAddress,
    });

    expect(restService).toBeCalledWith({
      endpoint: `/governance/voters/${fakeAddress}/history`,
      method: 'GET',
      next: true,
      params: {
        limit: 6,
        page: 2,
      },
    });

    expect(payload).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterHistoryResponse,
    }));

    const payload = await getVoterHistory({ address: fakeAddress });

    expect(payload.voterHistory).toHaveLength(6);

    expect(restService).toBeCalledWith({
      endpoint: `/governance/voters/${fakeAddress}/history`,
      method: 'GET',
      next: true,
      params: {
        limit: 6,
        page: 0,
      },
    });

    expect(payload).toMatchSnapshot();
  });
});
