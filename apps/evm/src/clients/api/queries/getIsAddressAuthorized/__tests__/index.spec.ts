import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';

import { restService } from 'utilities';

import getIsAddressAuthorized from '..';

vi.mock('utilities/restService');

describe('getAuthentication', () => {
  it('returns the user is authenticated if using a valid address', async () => {
    (restService as Mock).mockImplementationOnce(async () => ({
      status: 200,
    }));

    const { authorized } = await getIsAddressAuthorized({
      accountAddress: fakeAddress,
    });

    expect(authorized).toBe(true);
  });

  it('returns not authenticated if using an invalid address', async () => {
    (restService as Mock).mockImplementationOnce(async () => ({
      status: 403,
    }));

    const { authorized } = await getIsAddressAuthorized({
      accountAddress: fakeAddress,
    });

    expect(authorized).toBe(false);
  });
});
