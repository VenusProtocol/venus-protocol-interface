import { waitFor } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useGetProfitableImports } from '..';

describe('useGetProfitableImports', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'importPositions',
    );
  });

  it('returns profitable importable positions', async () => {
    const { result } = renderHook(() => useGetProfitableImports(), {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(result.current).toBeDefined());
    expect(result.current).toMatchSnapshot();
  });
});
