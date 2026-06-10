import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetAsset, useGetPool } from 'clients/api';
import { routes } from 'constants/routing';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import Market from '..';

const mockNavigate = vi.fn();

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

vi.mock('hooks/useNavigate', () => ({
  useNavigate: () => ({
    navigate: mockNavigate,
  }),
}));

describe('Market', () => {
  beforeEach(() => {
    (useUserChainSettings as Mock).mockReturnValue([defaultUserChainSettings, vi.fn()]);

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

  it('does not display the acknowledgement modal for non-gated assets', async () => {
    renderComponent(<Market />);

    await waitFor(() =>
      expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).toBeNull(),
    );
  });

  it('displays the acknowledgement modal for gated assets and navigates away on reject', async () => {
    (useGetAsset as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        asset: {
          ...poolData[0].assets[0],
          isGated: true,
        },
      },
    }));

    renderComponent(<Market />);

    fireEvent.click(
      await screen.findByRole('button', {
        name: en.gatedAssetAcknowledgementModal.rejectButtonLabel,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(routes.landing.path);
  });
});
