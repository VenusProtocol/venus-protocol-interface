import { VError } from 'errors';
import { restService } from 'utilities';

import proposalResponse from '__mocks__/api/proposals.json';

import getProposals from '.';

jest.mock('utilities/restService');

describe('api/queries/getProposals', () => {
  test('returns formatted proposals', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: proposalResponse, limit: 20, offset: 20 },
    }));

    const response = await getProposals({
      limit: 10,
      page: 2,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/proposals',
      method: 'GET',
      params: {
        limit: 10,
        offset: 20,
        version: 'v2',
      },
    });

    expect(response).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: proposalResponse },
    }));

    const response = await getProposals({});

    expect(restService).toBeCalledWith({
      endpoint: '/proposals',
      method: 'GET',
      params: {
        limit: 5,
        offset: 0,
        version: 'v2',
      },
    });

    expect(response).toMatchSnapshot();
  });
});
