import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokeForm } from '..';
import { getMinAmountTokens } from '../getMinAmountTokens';

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

  it('replaces the loan forms with a notice when the loan asset is restricted in the country', () => {
    renderComponent(
      <SpokeForm
        spokePool={spokePool}
        asset={{ ...activeLoanAsset, isRestricted: true }}
        initialLoanTabId="repay"
      />,
    );

    expect(screen.getByText(en.assetAccessor.assetNotAvailable)).toBeInTheDocument();
    expect(document.querySelector('input[name="amountTokens"]')).toBeNull();
  });

  it('replaces the collateral forms with a notice when every collateral is restricted', () => {
    const poolWithRestrictedCollaterals = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.isBorrowable ? asset : { ...asset, isRestricted: true },
      ),
    };

    renderComponent(
      <SpokeForm
        spokePool={poolWithRestrictedCollaterals}
        asset={activeLoanAsset}
        collateralOnly
      />,
    );

    expect(screen.getByText(en.assetAccessor.assetNotAvailable)).toBeInTheDocument();
    expect(document.querySelector('input[name="amountTokens"]')).toBeNull();
  });

  it('disables the form and hides the zero-collateral notice when user data is unavailable', () => {
    renderComponent(
      <SpokeForm
        spokePool={{ ...poolWithoutCollateral, isUserDataUnavailable: true }}
        asset={activeLoanAsset}
      />,
      { accountAddress: fakeAccountAddress },
    );

    expect(document.querySelector('input[name="amountTokens"]')).toBeDisabled();
    expect(screen.queryByText(/before you can borrow/)).not.toBeInTheDocument();
  });

  it('replaces the repay form with a notice when repaying is paused', () => {
    renderComponent(
      <SpokeForm
        spokePool={spokePool}
        asset={{ ...activeLoanAsset, disabledTokenActions: ['repay'] }}
        initialLoanTabId="repay"
      />,
      { accountAddress: fakeAccountAddress },
    );

    expect(screen.getByText(en.assetAccessor.disabledActionNotice.repay)).toBeInTheDocument();
    expect(document.querySelector('input[name="amountTokens"]')).toBeNull();
  });

  it('blocks withdrawing a collateral whose redeem is paused', async () => {
    const collateral = spokePool.assets.find(
      asset => !asset.isBorrowable && asset.userSupplyBalanceTokens.isGreaterThan(0),
    )!;
    const poolWithPausedRedeem = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address
          ? { ...asset, disabledTokenActions: ['withdraw' as const] }
          : asset,
      ),
    };

    renderComponent(
      <SpokeForm
        spokePool={poolWithPausedRedeem}
        asset={activeLoanAsset}
        collateralOnly
        initialCollateralTabId="withdraw"
        preselectedCollateral={poolWithPausedRedeem.assets.find(
          asset => asset.vToken.address === collateral.vToken.address,
        )}
      />,
      { accountAddress: fakeAccountAddress },
    );

    expect(
      await screen.findByText(en.assetAccessor.disabledActionNotice.withdraw),
    ).toBeInTheDocument();
    expect(document.querySelector('button[type="submit"]')).toBeDisabled();
  });

  it('shows the borrow notice to a first-time borrower when entering the market is paused', () => {
    renderComponent(
      <SpokeForm
        spokePool={spokePool}
        asset={{
          ...activeLoanAsset,
          disabledTokenActions: ['enterMarket'],
          isCollateralOfUser: false,
        }}
      />,
      { accountAddress: fakeAccountAddress },
    );

    expect(screen.getByText(en.assetAccessor.disabledActionNotice.borrow)).toBeInTheDocument();
  });

  it('lets an existing borrower borrow when entering the market is paused', () => {
    renderComponent(
      <SpokeForm
        spokePool={spokePool}
        asset={{
          ...activeLoanAsset,
          disabledTokenActions: ['enterMarket'],
          isCollateralOfUser: true,
        }}
      />,
      { accountAddress: fakeAccountAddress },
    );

    expect(
      screen.queryByText(en.assetAccessor.disabledActionNotice.borrow),
    ).not.toBeInTheDocument();
    expect(document.querySelector('input[name="amountTokens"]')).not.toBeNull();
  });

  it('shows the zero-collateral notice when the deposit is not entered as collateral', () => {
    const poolWithDepositOutsideMarket = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.isBorrowable ? asset : { ...asset, isCollateralOfUser: false },
      ),
    };

    renderComponent(
      <SpokeForm spokePool={poolWithDepositOutsideMarket} asset={activeLoanAsset} />,
      { accountAddress: fakeAccountAddress },
    );

    expect(screen.getByText(/before you can borrow/)).toBeInTheDocument();
  });

  it('refuses a supply amount below one vToken unit', async () => {
    const collateral = spokePool.assets.find(asset => !asset.isBorrowable)!;
    const poolWithWalletBalance = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address
          ? {
              ...asset,
              disabledTokenActions: [],
              isInactive: false,
              userWalletBalanceTokens: new BigNumber(10),
              supplyCapTokens: asset.supplyBalanceTokens.plus(1000),
              exchangeRateVTokens: new BigNumber(0.001),
            }
          : asset,
      ),
    };

    renderComponent(
      <SpokeForm spokePool={poolWithWalletBalance} asset={activeLoanAsset} collateralOnly />,
      { accountAddress: fakeAccountAddress },
    );

    const input = await waitFor(() => {
      const element = document.querySelector('input[name="amountTokens"]');
      expect(element).not.toBeNull();
      return element!;
    });
    const selectedCollateral = poolWithWalletBalance.assets.find(
      asset => asset.vToken.address === collateral.vToken.address,
    )!;
    const smallestUnitTokens = new BigNumber(1).shiftedBy(
      -selectedCollateral.vToken.underlyingToken.decimals,
    );
    expect(smallestUnitTokens.isLessThan(getMinAmountTokens({ asset: selectedCollateral }))).toBe(
      true,
    );

    fireEvent.change(input, { target: { value: smallestUnitTokens.toFixed() } });

    expect(await screen.findByText(/Amount is below the minimum/)).toBeInTheDocument();
    expect(document.querySelector('button[type="submit"]')).toBeDisabled();
  });

  it('labels the selected collateral as protected while price protection is on', () => {
    const protectedPool = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.isBorrowable ? asset : { ...asset, isProtectionModeEnabled: true },
      ),
    };

    renderComponent(
      <SpokeForm spokePool={protectedPool} asset={loanAsset} initialActiveTabId="collateral" />,
    );

    expect(screen.getByText(en.protectionModeIndicator.label)).toBeInTheDocument();
  });

  it('does not label an asset that is not protected', () => {
    renderComponent(
      <SpokeForm spokePool={spokePool} asset={loanAsset} initialActiveTabId="collateral" />,
    );

    expect(screen.queryByText(en.protectionModeIndicator.label)).not.toBeInTheDocument();
  });

  it('shows the borrow Available amount as plain text, like Core', () => {
    renderComponent(<SpokeForm spokePool={spokePool} asset={activeLoanAsset} />, {
      accountAddress: fakeAccountAddress,
    });

    const availableButton = screen
      .getByText(en.availableBalance.label)
      .closest('.justify-between')
      ?.querySelector('button');

    expect(availableButton).toBeDisabled();
  });
});
