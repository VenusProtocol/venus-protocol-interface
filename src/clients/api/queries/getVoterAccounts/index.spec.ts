import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import voterAccountsResponse from '__mocks__/api/voterAccounts.json';

import { restService } from 'utilities';

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
      totalStakedXvs: voterAccountsResponse.result.reduce(
        (acc, v) => acc.plus(new BigNumber(v.votesMantissa)),
        new BigNumber(0),
      ),
    });

    expect(voterAccounts).toHaveLength(7);

    expect(restService).toBeCalledWith({
      endpoint: '/governance/voters',
      method: 'GET',
      params: {
        limit: 16,
        page: 2,
      },
    });

    expect(voterAccounts).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterAccountsResponse,
    }));

    const { voterAccounts } = await getVoterAccounts({
      totalStakedXvs: voterAccountsResponse.result.reduce(
        (acc, v) => acc.plus(new BigNumber(v.votesMantissa)),
        new BigNumber(0),
      ),
    });

    expect(voterAccounts).toHaveLength(7);

    expect(restService).toBeCalledWith({
      endpoint: '/governance/voters',
      method: 'GET',
      params: {
        limit: 16,
        page: 0,
      },
    });

    expect(voterAccounts).toMatchSnapshot();
  });
});
