import type { Mock } from 'vitest';

import voterDetailsResponse from '__mocks__/api/voterDetails.json';
import fakeAddress from '__mocks__/models/address';

import { restService } from 'utilities';

import { getVoterDetails } from '.';

vi.mock('utilities/restService');

describe('getVoterDetail', () => {
  test('returns  formatted voter details', async () => {
    (restService as Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterDetailsResponse,
    }));

    const response = await getVoterDetails({ address: fakeAddress });

    expect(restService).toBeCalledWith({
      endpoint: `/governance/voters/${fakeAddress}/summary`,
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
