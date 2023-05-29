import { restService } from 'utilities';

import fakeAddress from '__mocks__/models/address';

import getIsAddressAuthorized from '.';

jest.mock('utilities/restService');

describe('api/queries/getAuthentication', () => {
  it('returns the user is authenticated if using a valid address', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
    }));

    const { authorized } = await getIsAddressAuthorized({
      accountAddress: fakeAddress,
    });

    expect(authorized).toBe(true);
  });

  it('returns not authenticated if using an invalid address', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 403,
    }));

    const { authorized } = await getIsAddressAuthorized({
      accountAddress: fakeAddress,
    });

    expect(authorized).toBe(false);
  });
});
