import { screen } from '@testing-library/react';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokeForm } from '..';

const spokePool = spokePools[0];
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;
const pausedLoanAsset = spokePool.assets.find(({ disabledTokenActions }) =>
  disabledTokenActions.includes('borrow'),
)!;

const activeLoanAsset = { ...loanAsset, disabledTokenActions: [] };

const poolWithoutCollateral = {
  ...spokePool,
  assets: spokePool.assets.map(asset => ({
    ...asset,
    userSupplyBalanceTokens: asset.userSupplyBalanceTokens.multipliedBy(0),
  })),
};

describe('SpokeForm', () => {
  it('renders both sides by default', () => {
    renderComponent(<SpokeForm spokePool={spokePool} asset={loanAsset} />);

    expect(screen.getByText(en.spokeForm.collateralTabTitle)).toBeInTheDocument();
    expect(screen.getByText(en.spokeForm.loanTabTitle)).toBeInTheDocument();
  });

  it('drops the top tabs when only the collateral side is asked for', () => {
    renderComponent(<SpokeForm spokePool={spokePool} asset={loanAsset} collateralOnly />);

    expect(screen.queryByText(en.spokeForm.loanTabTitle)).not.toBeInTheDocument();
    expect(screen.getByText(en.spokeForm.supply.tabTitle)).toBeInTheDocument();
    expect(screen.getByText(en.spokeForm.withdraw.tabTitle)).toBeInTheDocument();
  });

  it('replaces the borrow form with a notice when borrowing is paused', () => {
    renderComponent(<SpokeForm spokePool={spokePool} asset={pausedLoanAsset} />);

    expect(screen.getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument();
    expect(screen.queryByText(en.spokeForm.safeMaxButtonLabel)).not.toBeInTheDocument();
  });

  it('keeps repay reachable on a paused market, since exiting is never gated', () => {
    renderComponent(
      <SpokeForm spokePool={spokePool} asset={pausedLoanAsset} initialLoanTabId="repay" />,
    );

    expect(screen.getByText(en.spokeForm.repay.submitButtonLabel)).toBeInTheDocument();
  });

  it('hides the zero-collateral notice until a wallet is connected', () => {
    renderComponent(<SpokeForm spokePool={poolWithoutCollateral} asset={activeLoanAsset} />);

    expect(screen.queryByText(/before you can borrow/)).not.toBeInTheDocument();
  });

  it('shows the zero-collateral notice to a connected user without collateral', () => {
    renderComponent(<SpokeForm spokePool={poolWithoutCollateral} asset={activeLoanAsset} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByText(/before you can borrow/)).toBeInTheDocument();
  });
});
