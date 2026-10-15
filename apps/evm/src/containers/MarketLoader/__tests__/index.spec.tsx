import { screen, waitFor } from '@testing-library/react';

import { useGetAsset, useGetPool } from 'clients/api';
import { poolData } from '__mocks__/models/pools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { MarketLoader } from '..';

vi.mock('containers/Redirect', () => ({
  Redirect: () => <div>REDIRECTED</div>,
}));

const pool = poolData[0];
const asset = pool.assets[0];

const renderMarketLoader = () =>
  renderComponent(
    <MarketLoader poolComptrollerAddress={pool.comptrollerAddress} vTokenAddress={asset.vToken.address}>
      {() => <div>MARKET CONTENT</div>}
    </MarketLoader>,
  );

describe('MarketLoader', () => {
  it('renders the market when the pools load', async () => {
    renderMarketLoader();

    await waitFor(() => expect(screen.getByText('MARKET CONTENT')).toBeInTheDocument());
  });

  it('offers a retry instead of redirecting when the pools request fails', async () => {
    const refetchMock = vi.fn();

    (useGetAsset as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      isError: true,
      refetch: refetchMock,
      data: undefined,
    }));

    renderMarketLoader();

    await waitFor(() =>
      expect(screen.getByText(en.market.errorState.failedToFetchMessage)).toBeInTheDocument(),
    );
    expect(screen.queryByText('REDIRECTED')).not.toBeInTheDocument();

    screen.getByText(en.market.errorState.refetchButtonLabel).click();
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('redirects when the pools load but the market is unknown', async () => {
    (useGetAsset as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      data: { asset: undefined },
    }));

    renderMarketLoader();

    await waitFor(() => expect(screen.getByText('REDIRECTED')).toBeInTheDocument());
  });
});
