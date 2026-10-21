import type { Mock } from 'vitest';

import { VError } from 'libs/errors';
import { IP_LOCATION_PROVIDERS, PROVIDER_TIMEOUT_MS, getIpLocation } from '..';

const mockFetch = global.fetch as Mock;

const okResponse = (payload: unknown) =>
  ({ ok: true, json: async () => payload }) satisfies Partial<Response>;

describe('getIpLocation', () => {
  it('returns the country code of the first provider', async () => {
    mockFetch.mockResolvedValue(okResponse({ success: true, country_code: 'FR' }));

    await expect(getIpLocation()).resolves.toEqual({ countryCode: 'FR' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(IP_LOCATION_PROVIDERS[0].url, {
      signal: expect.any(AbortSignal),
    });
  });

  it('queries the next provider when one throws', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(okResponse({ country: 'DE' }));

    await expect(getIpLocation()).resolves.toEqual({ countryCode: 'DE' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(2, IP_LOCATION_PROVIDERS[1].url, {
      signal: expect.any(AbortSignal),
    });
  });

  it('queries the next provider when one responds with an error status', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) } satisfies Partial<Response>)
      .mockResolvedValueOnce(okResponse({ country: 'DE' }));

    await expect(getIpLocation()).resolves.toEqual({ countryCode: 'DE' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('queries the next provider when one reports a failure with a 200', async () => {
    // Only the success flag can reject this payload
    mockFetch
      .mockResolvedValueOnce(okResponse({ success: false, country_code: 'FR' }))
      .mockResolvedValueOnce(okResponse({ country: 'DE' }));

    await expect(getIpLocation()).resolves.toEqual({ countryCode: 'DE' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('queries the next provider when one omits the country code', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(okResponse({ country: 'DE' }));

    await expect(getIpLocation()).resolves.toEqual({ countryCode: 'DE' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('falls through to the last provider when the others come up empty', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(okResponse({}))
      .mockResolvedValueOnce(okResponse({ country: 'ES' }));

    await expect(getIpLocation()).resolves.toEqual({ countryCode: 'ES' });

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenNthCalledWith(3, IP_LOCATION_PROVIDERS[2].url, {
      signal: expect.any(AbortSignal),
    });
  });

  it('does not query the next provider once one has answered', async () => {
    mockFetch.mockResolvedValue(okResponse({ success: true, country_code: 'FR' }));

    await getIpLocation();

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('gives up on a provider that hangs and queries the next one', async () => {
    vi.useFakeTimers();

    // Only the abort can end this
    mockFetch.mockImplementationOnce(
      (_url: string, { signal }: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) =>
          signal.addEventListener('abort', () => reject(new Error('Aborted'))),
        ),
    );
    mockFetch.mockResolvedValueOnce(okResponse({ country: 'DE' }));

    const promise = getIpLocation();
    await vi.advanceTimersByTimeAsync(PROVIDER_TIMEOUT_MS);

    await expect(promise).resolves.toEqual({ countryCode: 'DE' });
    expect(mockFetch).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('throws a VError when every provider comes up empty', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(getIpLocation()).rejects.toEqual(
      new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
        data: { exception: 'No IP location provider returned a country code' },
      }),
    );

    expect(mockFetch).toHaveBeenCalledTimes(IP_LOCATION_PROVIDERS.length);
  });
});
