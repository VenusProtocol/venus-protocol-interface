import { screen } from '@testing-library/react';

import { institutionalVault } from '__mocks__/models/vaults';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { ChainId, VaultVenue } from 'types';
import { generateExplorerUrl, truncateAddress } from 'utilities';
import { VaultOverviewMarketInfo } from '..';

describe('containers/VaultCard/VaultOverviewMarketInfo', () => {
  it('renders market info rows, explorer links, and institutional risk disclosure', () => {
    renderComponent(
      <VaultOverviewMarketInfo
        vaultDeploymentDate={institutionalVault.vaultDeploymentDate}
        contractAddress={institutionalVault.vaultAddress}
        venue={institutionalVault.venue}
        venueName={institutionalVault.venueName}
        venueIconSrc={institutionalVault.venueIconSrc}
        venueUrl={institutionalVault.venueUrl}
        copyAddress={institutionalVault.venueAddress}
        collateralToken={institutionalVault.collateralToken}
      />,
      { chainId: ChainId.BSC_TESTNET },
    );

    const contractUrl = generateExplorerUrl({
      hash: institutionalVault.vaultAddress,
      chainId: ChainId.BSC_TESTNET,
    });
    const collateralUrl = generateExplorerUrl({
      hash: institutionalVault.collateralToken?.address,
      chainId: ChainId.BSC_TESTNET,
    });

    expect(screen.getByText(en.vault.modals.overview.marketInfo)).toBeInTheDocument();
    expect(screen.getByText(en.vault.modals.overview.vaultDeploymentDate)).toBeInTheDocument();
    expect(
      screen.getByText(
        t('vault.modals.textualDate', { date: institutionalVault.vaultDeploymentDate }),
      ),
    ).toBeInTheDocument();
    const unnamedLinks = screen.getAllByRole('link', { name: '' });

    expect(screen.getByText(truncateAddress(institutionalVault.vaultAddress))).toBeInTheDocument();
    expect(unnamedLinks[0]).toHaveAttribute('href', contractUrl);
    expect(screen.getByText(institutionalVault.venueName)).toBeInTheDocument();
    expect(screen.getByText(institutionalVault.collateralToken?.symbol || '')).toBeInTheDocument();
    expect(unnamedLinks[2]).toHaveAttribute('href', collateralUrl);
    expect(screen.getByText('Capital at risk')).toBeInTheDocument();
  });

  it('renders Pendle risk disclosure', () => {
    renderComponent(
      <VaultOverviewMarketInfo
        venue={VaultVenue.Pendle}
        venueName="Pendle"
        venueIconSrc="pendle.svg"
      />,
    );

    expect(
      screen.getByText(/Pendle is a decentralised yield-trading protocol/),
    ).toBeInTheDocument();
  });
});
