import { restService } from 'utilities';

import voterDetailsResponse from '__mocks__/api/voterDetails.json';
import fakeAddress from '__mocks__/models/address';

import getVoterDetail from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoterDetail', () => {
  test('returns  formatted voter details', async () => {
    (restService as vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterDetailsResponse,
    }));

    const response = await getVoterDetail({ address: fakeAddress });

    expect(restService).toBeCalledWith({
      endpoint: `/voters/accounts/${fakeAddress}`,
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
