import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { ChainId, type LiquidityHub } from 'types';
import { generateExplorerUrl, truncateAddress } from 'utilities';
import { LiquidityHubInfo } from '..';

const operatorAddress = '0x4000000000000000000000000000000000000001';
const liquidityHub: LiquidityHub = { ...liquidityHubs[0], operatorAddress };

const renderLiquidityHubInfo = (input = liquidityHub) =>
  renderComponent(<LiquidityHubInfo liquidityHub={input} />, {
    chainId: ChainId.BSC_TESTNET,
  });

describe('LiquidityHubInfo', () => {
  it('renders the operator address returned by the API, linking to the chain explorer', () => {
    renderLiquidityHubInfo();

    expect(screen.getByText(en.liquidityHub.info.stats.operatorAddress)).toBeInTheDocument();

    const operatorAddressLink = screen
      .getByText(truncateAddress(operatorAddress))
      .closest('a') as HTMLAnchorElement;

    expect(operatorAddressLink).toHaveAttribute(
      'href',
      generateExplorerUrl({ hash: operatorAddress, chainId: ChainId.BSC_TESTNET }),
    );
  });

  it('does not render the hub contract row anymore', () => {
    renderLiquidityHubInfo();

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

  it('discloses that each supply puts the vhTokens in Venus Core as collateral', () => {
    renderLiquidityHubInfo();

    expect(
      screen.getByText(
        `automatically supplies your ${liquidityHub.vhToken.symbol} to Venus Core as collateral`,
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('does not grant borrowing power', { exact: false })).toBeNull();
  });

  it('renders a placeholder when the API returns no operator address', () => {
    renderLiquidityHubInfo({ ...liquidityHub, operatorAddress: undefined });

    expect(screen.getByText(en.liquidityHub.info.stats.operatorAddress)).toBeInTheDocument();
    expect(screen.getByText(PLACEHOLDER_KEY)).toBeInTheDocument();
  });

  it('leaves the connected user Prime APY out of the Hub daily supplying interests', () => {
    renderLiquidityHubInfo({
      ...liquidityHub,
      supplyBalanceCents: new BigNumber(36_500_000),
      supplyApyPercentage: new BigNumber(10),
      supplyTokenDistributions: [
        {
          type: 'prime',
          token: liquidityHub.vhToken.underlyingToken,
          apyPercentage: new BigNumber(1000),
          isActive: true,
        },
      ],
    });

    // $365,000 x 10% / 365 days
    expect(screen.getByText('$100')).toBeInTheDocument();
  });
});
