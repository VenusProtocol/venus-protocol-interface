import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { importablePositions } from '__mocks__/models/importablePositions';

import { renderHook } from 'testUtils/render';
import { getImportableAaveSupplyPositions } from '../getImportableAaveSupplyPositions';
import { useGetImportablePositions } from '../useGetImportablePositions';

vi.mock('../getImportableAaveSupplyPositions');

describe('useGetImportablePositions', () => {
  it('returns the importable positions from other networks on success', async () => {
    (getImportableAaveSupplyPositions as Mock).mockImplementation(() => ({
      importableSupplyPositions: [importablePositions.aave],
    }));

    const { result } = renderHook(() =>
      useGetImportablePositions({
        accountAddress: fakeAccountAddress,
      }),
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toMatchSnapshot();
  });
});
