import type Vi from 'vitest';

import { PUBLIC_VERSION_FILE_URL, getLatestAppVersion } from '..';

describe('getLatestAppVersion', () => {
  test('returns the latest app version on success', async () => {
    const fakeVersion = '9.9.9';

    (fetch as Vi.Mock).mockImplementationOnce(() => ({
      json: () => ({
        version: fakeVersion,
      }),
    }));

    const response = await getLatestAppVersion();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(PUBLIC_VERSION_FILE_URL);
    expect(response).toEqual({
      version: fakeVersion,
    });
  });
});
