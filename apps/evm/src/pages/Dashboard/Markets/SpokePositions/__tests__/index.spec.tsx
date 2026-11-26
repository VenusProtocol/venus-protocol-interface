import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { fakeMerklCampaigns } from 'clients/api/queries/getPendingRewards/__testUtils__/fakeData';
import { HIDDEN_BALANCE_KEY } from 'constants/placeholders';
import { useIsSmDown } from 'hooks/responsive';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';

import { SpokePositions } from '..';

vi.mock('components/ProtectionModeIndicator', () => ({
  ProtectionModeIndicator: ({
    tokenName,
    tooltipType,
  }: {
    tokenName: string;
    tooltipType: string;
  }) => <span>{`protected-${tokenName}-${tooltipType}`}</span>,
}));

vi.mock('hooks/responsive', async () => {
  const actual = await vi.importActual<typeof import('hooks/responsive')>('hooks/responsive');

  return {
    ...actual,
    useIsSmDown: vi.fn(() => false),
  };
});

const spokePool = spokePools[0];

describe('SpokePositions', () => {
  it('opens the collateral modal without the top tabs from a supplied row', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(screen.getAllByText('USDC')[0]);

    expect(
      screen.getByText(en.spokeForm.collateralModalTitle.replace('{{poolName}}', spokePool.name)),
    ).toBeInTheDocument();
    expect(screen.queryByText(en.spokeForm.loanTabTitle)).not.toBeInTheDocument();
    expect(screen.getAllByText(en.spokeForm.supply.tabTitle).length).toBeGreaterThan(0);
    expect(screen.getByText(en.spokeForm.withdraw.tabTitle)).toBeInTheDocument();
  });

  it('opens the borrow modal with both sides from a borrowed row', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    fireEvent.click(screen.getAllByText('USDT')[0]);

    expect(screen.getByText(en.spokeForm.loanTabTitle)).toBeInTheDocument();
    expect(screen.getByText(en.spokeForm.collateralTabTitle)).toBeInTheDocument();
  });

  it('still lists a debt on a market that is not on the loan side', () => {
    const misclassifiedPool = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.vToken.underlyingToken.symbol === 'USDT' ? { ...asset, isBorrowable: false } : asset,
      ),
    };

    renderComponent(<SpokePositions spokePool={misclassifiedPool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getAllByText('USDT').length).toBeGreaterThan(0);
  });

  it('shows the health factor and account health with a borrow', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getAllByText(en.account.spoke.summary.healthFactor).length).toBeGreaterThan(0);
    expect(screen.getAllByText(en.accountHealth.liquidationThreshold).length).toBeGreaterThan(0);
  });

  it('hides the health factor and account health without a borrow', () => {
    const supplyOnlyPool = {
      ...spokePool,
      userBorrowBalanceCents: new BigNumber(0),
      assets: spokePool.assets.map(asset => ({
        ...asset,
        userBorrowBalanceCents: new BigNumber(0),
        userBorrowBalanceTokens: new BigNumber(0),
      })),
    };

    renderComponent(<SpokePositions spokePool={supplyOnlyPool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.queryByText(en.account.spoke.summary.healthFactor)).not.toBeInTheDocument();
    expect(screen.queryByText(en.accountHealth.liquidationThreshold)).not.toBeInTheDocument();
    expect(screen.queryByText(en.accountHealth.liquidationThresholdShort)).not.toBeInTheDocument();
  });

  it('marks protected supplied and borrowed assets', () => {
    const protectedPool = {
      ...spokePool,
      assets: spokePool.assets.map(asset => ({ ...asset, isProtectionModeEnabled: true })),
    };

    renderComponent(<SpokePositions spokePool={protectedPool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getAllByText('protected-USDC-supply').length).toBeGreaterThan(0);
    expect(screen.getAllByText('protected-USDT-borrow').length).toBeGreaterThan(0);
  });

  it('lays the summary out in a grid below xl, like Core', () => {
    const { container } = renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.querySelector('.sm\\:grid-cols-3, .sm\\:grid-cols-2')).toHaveClass(
      'bg-transparent',
    );
  });

  it('switches between supplied and borrowed assets below the sm breakpoint', () => {
    (useIsSmDown as Mock).mockReturnValue(true);

    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByText(en.account.marketBreakdown.tables.tabletTitle)).toBeInTheDocument();
    expect(screen.getAllByText('USDC').length).toBeGreaterThan(0);
    expect(screen.queryByText('USDT')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: en.account.marketBreakdown.tables.tabletBorrowTabTitle }),
    );

    expect(screen.getAllByText('USDT').length).toBeGreaterThan(0);
    expect(screen.queryByText('USDC')).not.toBeInTheDocument();
  });

  it('colours the borrow APY like the Core net APY', () => {
    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    const borrowApyCell = screen
      .getAllByText(en.account.spoke.summary.borrowApy)[0]
      .closest('.text-success, .text-danger');

    expect(borrowApyCell).toHaveClass('text-success');
  });

  it('nets active Merkl borrow rewards out of the summary borrow APY', () => {
    const [merklCampaign] = Object.values(fakeMerklCampaigns)[0];
    const rewardedPool = {
      ...spokePool,
      assets: spokePool.assets.map(asset => ({
        ...asset,
        borrowTokenDistributions: [
          {
            ...merklCampaign,
            isActive: true,
            apyPercentage: asset.borrowApyPercentage.plus(2),
          },
        ],
      })),
    };

    renderComponent(<SpokePositions spokePool={rewardedPool} />, {
      accountAddress: fakeAccountAddress,
    });

    const borrowApyCell = screen
      .getAllByText(en.account.spoke.summary.borrowApy)[0]
      .closest('.text-success, .text-danger');

    expect(borrowApyCell).toHaveTextContent(formatPercentageToReadableValue(new BigNumber(-2)));
  });

  it('hides the supplied and borrowed balances in hide mode', () => {
    (useUserChainSettings as Mock).mockReturnValue([
      { ...defaultUserChainSettings, doNotShowUserBalances: true },
      vi.fn(),
    ]);

    const [suppliedAsset] = spokePool.assets.filter(asset =>
      asset.userSupplyBalanceTokens.isGreaterThan(0),
    );
    const [borrowedAsset] = spokePool.assets.filter(asset =>
      asset.userBorrowBalanceTokens.isGreaterThan(0),
    );

    renderComponent(<SpokePositions spokePool={spokePool} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(
      screen.queryByText(
        formatTokensToReadableValue({
          value: suppliedAsset.userSupplyBalanceTokens,
          token: suppliedAsset.vToken.underlyingToken,
          addSymbol: false,
        }),
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        formatTokensToReadableValue({
          value: borrowedAsset.userBorrowBalanceTokens,
          token: borrowedAsset.vToken.underlyingToken,
          addSymbol: false,
        }),
      ),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText(HIDDEN_BALANCE_KEY).length).toBeGreaterThanOrEqual(3);
  });
});
