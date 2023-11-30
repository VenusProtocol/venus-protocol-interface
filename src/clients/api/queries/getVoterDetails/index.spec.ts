import Vi from 'vitest';

import voterDetailsResponse from '__mocks__/api/voterDetails.json';
import fakeAddress from '__mocks__/models/address';

import { restService } from 'utilities';

import getVoterDetail from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoterDetail', () => {
  test('returns  formatted voter details', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterDetailsResponse,
    }));

    const response = await getVoterDetail({ address: fakeAddress });

    expect(restService).toBeCalledWith({
      endpoint: `/governance/voters/${fakeAddress}/summary`,
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
