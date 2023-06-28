import { restService } from 'utilities';
import Vi from 'vitest';

import voterAccountsResponse from '__mocks__/api/voterAccounts.json';

import getVoterAccounts from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoterAccounts', () => {
  test('returns formatted Voter Accounts', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterAccountsResponse,
    }));

    const { voterAccounts } = await getVoterAccounts({
      page: 2,
    });

    expect(voterAccounts).toHaveLength(7);

    expect(restService).toBeCalledWith({
      endpoint: '/voters/accounts',
      method: 'GET',
      params: {
        limit: 16,
        offset: 32,
      },
    });

    expect(voterAccounts).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterAccountsResponse,
    }));

    const { voterAccounts } = await getVoterAccounts({});

    expect(voterAccounts).toHaveLength(7);
    // Expected length: 20
    // Received length: 7
    expect(restService).toBeCalledWith({
      endpoint: '/voters/accounts',
      method: 'GET',
      params: {
        limit: 16,
        offset: 0,
      },
    });

    expect(voterAccounts).toMatchSnapshot();
  });
});
