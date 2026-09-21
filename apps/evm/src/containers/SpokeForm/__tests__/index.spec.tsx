import { screen } from '@testing-library/react';

import { spokePools } from '__mocks__/models/spokePools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokeForm } from '..';

const spokePool = spokePools[0];
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;
const pausedLoanAsset = spokePools[1].assets.find(({ disabledTokenActions }) =>
  disabledTokenActions.includes('borrow'),
)!;

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
    renderComponent(<SpokeForm spokePool={spokePools[1]} asset={pausedLoanAsset} />);

    expect(screen.getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument();
    expect(screen.queryByText(en.spokeForm.safeMaxButtonLabel)).not.toBeInTheDocument();
  });

  it('keeps repay reachable on a paused market, since exiting is never gated', () => {
    renderComponent(
      <SpokeForm spokePool={spokePools[1]} asset={pausedLoanAsset} initialLoanTabId="repay" />,
    );

    expect(screen.getByText(en.spokeForm.repay.submitButtonLabel)).toBeInTheDocument();
  });
});
