import { waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetAsset, useGetPool } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import Market from '..';

vi.mock('react-router', async importOriginal => {
  const actual: Record<string, unknown> = await importOriginal();

  return {
    ...actual,
    useParams: () => ({
      vTokenAddress: '0xfakeVTokenAddress',
      poolComptrollerAddress: '0xfakePoolComptrollerAddress',
    }),
  };
});

describe('Market', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: poolData[0],
      },
    }));

    (useGetAsset as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: poolData[0].assets[0],
      },
    }));
  });

  it('displays content correctly', async () => {
    const { container } = renderComponent(<Market />);

    await waitFor(() => expect(container.textContent).not.toEqual(''));

    expect(container.textContent).toMatchSnapshot();
  });
});
