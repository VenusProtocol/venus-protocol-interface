import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { useGetLiquidityHubOperatorAddress } from 'clients/api';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { ChainId } from 'types';
import { generateExplorerUrl, truncateAddress } from 'utilities';
import { LiquidityHubInfo } from '..';

const liquidityHub = liquidityHubs[0];

const renderLiquidityHubInfo = () =>
  renderComponent(<LiquidityHubInfo liquidityHub={liquidityHub} />, {
    chainId: ChainId.BSC_TESTNET,
  });

describe('LiquidityHubInfo', () => {
  const mockUseGetLiquidityHubOperatorAddress = useGetLiquidityHubOperatorAddress as Mock;

  it('renders the operator address, linking to the chain explorer', () => {
    renderLiquidityHubInfo();

    expect(mockUseGetLiquidityHubOperatorAddress).toHaveBeenCalledWith({
      vhTokenAddress: liquidityHub.vhToken.address,
    });
    expect(screen.getByText(en.liquidityHub.info.stats.operatorAddress)).toBeInTheDocument();
    expect(screen.getByText(truncateAddress(fakeAddress))).toBeInTheDocument();

    const operatorAddressLink = screen
      .getByText(truncateAddress(fakeAddress))
      .closest('a') as HTMLAnchorElement;

    expect(operatorAddressLink).toHaveAttribute(
      'href',
      generateExplorerUrl({ hash: fakeAddress, chainId: ChainId.BSC_TESTNET }),
    );
  });

  it('does not render the hub contract row anymore', () => {
    renderLiquidityHubInfo();

    // The hub contract address is identical to the vhToken contract address, so the only remaining
    // row displaying it is the vhToken one
    expect(screen.getAllByText(truncateAddress(liquidityHub.vhToken.address)).length).toBe(1);
    expect(
      screen.getByText(
        en.liquidityHub.info.stats.vhTokenContract.replace(
          '{{ vhTokenSymbol }}',
          liquidityHub.vhToken.symbol,
        ),
      ),
    ).toBeInTheDocument();
  });

  it('renders a placeholder while the operator address has not been fetched', () => {
    mockUseGetLiquidityHubOperatorAddress.mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    renderLiquidityHubInfo();

    expect(screen.getByText(en.liquidityHub.info.stats.operatorAddress)).toBeInTheDocument();
    expect(screen.getByText(PLACEHOLDER_KEY)).toBeInTheDocument();
    expect(screen.queryByText(truncateAddress(fakeAddress))).toBeNull();
  });
});
