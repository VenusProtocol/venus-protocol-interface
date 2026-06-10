import type { Mock } from 'vitest';

import { VError } from 'libs/errors';
import { IP_API_URL, getIpLocation } from '..';

const mockFetch = global.fetch as Mock;

describe('getIpLocation', () => {
  it('returns the user country code when the request succeeds', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        countryCode: 'FR',
      }),
    } satisfies Partial<Response>);

    await expect(getIpLocation()).resolves.toEqual({
      countryCode: 'FR',
    });

    expect(mockFetch).toHaveBeenCalledWith(IP_API_URL);
  });

  it('throws a VError when the request fails', async () => {
    const error = new Error('Network error');
    mockFetch.mockRejectedValue(error);

    await expect(getIpLocation()).rejects.toEqual(
      new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: { exception: error },
      }),
    );
  });

  it('throws a VError when the response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } satisfies Partial<Response>);

    await expect(getIpLocation()).rejects.toEqual(
      new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: {
          exception: {
            ok: false,
            json: expect.any(Function),
          },
        },
      }),
    );
  });

  it('throws a VError when the response payload is invalid', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } satisfies Partial<Response>);

    await expect(getIpLocation()).rejects.toEqual(
      new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: { exception: {} },
      }),
    );
  });
});
