import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { spokePools } from '__mocks__/models/spokePools';
import { useGetSpokePools } from 'clients/api';
import { routes } from 'constants/routing';
import { renderComponent } from 'testUtils/render';

import { SpokeMarketLoader } from '..';

vi.mock('containers/Redirect', () => ({
  Redirect: ({ to }: { to: string }) => <div data-testid="redirect">{to}</div>,
}));

const spokePool = spokePools[0];
const [loanAsset] = spokePool.assets.filter(({ isBorrowable }) => isBorrowable);

const renderLoader = () =>
  renderComponent(
    <SpokeMarketLoader
      spokePoolComptrollerAddress={spokePool.comptrollerAddress}
      spokeVTokenAddress={loanAsset.vToken.address}
    >
      {({ asset }) => <div>{asset.vToken.symbol}</div>}
    </SpokeMarketLoader>,
  );

describe('SpokeMarketLoader', () => {
  it('renders the market once it is loaded', () => {
    (useGetSpokePools as Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { spokePools },
    });

    renderLoader();

    expect(screen.getByText(loanAsset.vToken.symbol)).toBeInTheDocument();
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
  });

  it('keeps the page instead of redirecting when the pools could not be fetched', () => {
    (useGetSpokePools as Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    renderLoader();

    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
    expect(screen.queryByText(loanAsset.vToken.symbol)).not.toBeInTheDocument();
  });

  it('keeps the market when a refetch fails after it was loaded', () => {
    (useGetSpokePools as Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: { spokePools },
    });

    renderLoader();

    expect(screen.getByText(loanAsset.vToken.symbol)).toBeInTheDocument();
  });

  it('redirects to the pool list when the market does not exist', () => {
    (useGetSpokePools as Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { spokePools: [] },
    });

    renderLoader();

    expect(screen.getByTestId('redirect').textContent).toBe(routes.spokePools.path);
  });
});
