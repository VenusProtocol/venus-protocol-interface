import { waitFor } from '@testing-library/dom';
import type { Mock } from 'vitest';

import { renderHook } from 'testUtils/render';
import { useGetIpLocation } from '..';

const mockFetch = global.fetch as Mock;

describe('useGetIpLocation', () => {
  it('fetches the user country code', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        countryCode: 'FR',
      }),
    } satisfies Partial<Response>);

    const { result } = renderHook(() => useGetIpLocation());

    await waitFor(() =>
      expect(result.current.data).toEqual({
        countryCode: 'FR',
      }),
    );
  });
});
