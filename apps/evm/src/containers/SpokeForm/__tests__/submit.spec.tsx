import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { xvs } from '__mocks__/models/tokens';
import {
  useBorrowFromSpoke,
  useGetVTokenBalance,
  useRepayToSpoke,
  useSupplyToSpoke,
  useWithdrawFromSpoke,
} from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokeForm } from '..';

const spokePool = spokePools[0];
const fixtureLoanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;
const collateral = spokePool.assets.find(({ isBorrowable }) => !isBorrowable)!;

const loanAsset = {
  ...fixtureLoanAsset,
  disabledTokenActions: [],
  userWalletBalanceTokens: new BigNumber(1000),
};

const pool = {
  ...spokePool,
  assets: spokePool.assets.map(asset =>
    asset.vToken.address === loanAsset.vToken.address ? loanAsset : asset,
  ),
};

const enterAmount = async (amountTokens: string) => {
  const input = await waitFor(() => {
    const element = document.querySelector('input[name="amountTokens"]');
    expect(element).not.toBeNull();
    return element!;
  });

  fireEvent.change(input, { target: { value: amountTokens } });
};

const submit = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() => expect(submitButton).toBeEnabled());
  fireEvent.click(submitButton);
};

describe('SpokeForm submission', () => {
  it('borrows the entered amount from the loan market', async () => {
    const mockBorrow = vi.fn();
    (useBorrowFromSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockBorrow,
      isPending: false,
    }));

    renderComponent(<SpokeForm spokePool={pool} asset={loanAsset} />, {
      accountAddress: fakeAccountAddress,
    });

    await enterAmount('10');
    await submit();

    await waitFor(() => expect(mockBorrow).toHaveBeenCalledTimes(1));
    expect(mockBorrow).toHaveBeenCalledWith({
      vToken: loanAsset.vToken,
      poolName: pool.name,
      amountMantissa: new BigNumber(10).shiftedBy(loanAsset.vToken.underlyingToken.decimals),
    });
  });

  it('repays the entered amount without flagging a full repayment', async () => {
    const mockRepay = vi.fn();
    (useRepayToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockRepay,
      isPending: false,
    }));

    renderComponent(<SpokeForm spokePool={pool} asset={loanAsset} initialLoanTabId="repay" />, {
      accountAddress: fakeAccountAddress,
    });

    await enterAmount('10');
    await submit();

    await waitFor(() => expect(mockRepay).toHaveBeenCalledTimes(1));
    expect(mockRepay).toHaveBeenCalledWith({
      vToken: loanAsset.vToken,
      poolName: pool.name,
      amountMantissa: new BigNumber(10).shiftedBy(loanAsset.vToken.underlyingToken.decimals),
      repayFullLoan: false,
    });
  });

  it('flags a full repayment when the whole debt is entered', async () => {
    const mockRepay = vi.fn();
    (useRepayToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockRepay,
      isPending: false,
    }));

    renderComponent(<SpokeForm spokePool={pool} asset={loanAsset} initialLoanTabId="repay" />, {
      accountAddress: fakeAccountAddress,
    });

    await enterAmount(loanAsset.userBorrowBalanceTokens.toFixed());
    await submit();

    await waitFor(() => expect(mockRepay).toHaveBeenCalledTimes(1));
    expect(mockRepay).toHaveBeenCalledWith(expect.objectContaining({ repayFullLoan: true }));
  });

  it('withdraws the entered amount from the collateral market', async () => {
    const mockWithdraw = vi.fn();
    (useWithdrawFromSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
      isPending: false,
    }));

    renderComponent(
      <SpokeForm
        spokePool={pool}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="withdraw"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount('10');
    await submit();

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw).toHaveBeenCalledWith(
      expect.objectContaining({
        vToken: collateral.vToken,
        poolName: pool.name,
        amountMantissa: new BigNumber(10).shiftedBy(collateral.vToken.underlyingToken.decimals),
        withdrawFullSupply: false,
      }),
    );
  });

  it('waits for the vToken balance before withdrawing the full supply', async () => {
    const mockWithdraw = vi.fn();
    (useWithdrawFromSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
      isPending: false,
    }));

    const vTokenBalanceMantissa = new BigNumber('100000000000');
    (useGetVTokenBalance as Mock).mockImplementation(() => ({
      data: undefined,
      refetch: async () => ({ data: { balanceMantissa: vTokenBalanceMantissa } }),
    }));

    const poolWithoutDebt = {
      ...pool,
      userBorrowBalanceCents: new BigNumber(0),
      assets: pool.assets.map(asset => ({
        ...asset,
        userBorrowBalanceTokens: new BigNumber(0),
        userBorrowBalanceCents: new BigNumber(0),
      })),
    };

    renderComponent(
      <SpokeForm
        spokePool={poolWithoutDebt}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="withdraw"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount(collateral.userSupplyBalanceTokens.toFixed());
    await submit();

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw).toHaveBeenCalledWith(
      expect.objectContaining({
        withdrawFullSupply: true,
        vTokenBalanceMantissa,
      }),
    );
  });

  it('supplies the entered amount of the selected collateral', async () => {
    const mockSupply = vi.fn();
    (useSupplyToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockSupply,
      isPending: false,
    }));

    const poolWithWalletBalance = {
      ...pool,
      assets: pool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address
          ? { ...asset, userWalletBalanceTokens: new BigNumber(1000) }
          : asset,
      ),
    };

    renderComponent(
      <SpokeForm
        spokePool={poolWithWalletBalance}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount('10');
    await submit();

    await waitFor(() => expect(mockSupply).toHaveBeenCalledTimes(1));
    expect(mockSupply).toHaveBeenCalledWith({
      vToken: collateral.vToken,
      poolName: pool.name,
      amountMantissa: new BigNumber(10).shiftedBy(collateral.vToken.underlyingToken.decimals),
    });
  });

  it('blocks supplying an inactive collateral', async () => {
    const mockSupply = vi.fn();
    (useSupplyToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockSupply,
      isPending: false,
    }));

    const inactiveCollateral = {
      ...collateral,
      isInactive: true,
      disabledTokenActions: [],
      userWalletBalanceTokens: new BigNumber(1000),
    };

    const poolWithInactiveCollateral = {
      ...pool,
      assets: pool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address ? inactiveCollateral : asset,
      ),
    };

    const { getByText } = renderComponent(
      <SpokeForm
        spokePool={poolWithInactiveCollateral}
        asset={loanAsset}
        preselectedCollateral={inactiveCollateral}
        initialActiveTabId="collateral"
        initialCollateralTabId="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount('10');

    await waitFor(() => expect(getByText(en.spokeForm.error.supplyDisabled)).toBeInTheDocument());
    expect(document.querySelector('button[type="submit"]')).toBeDisabled();
    expect(mockSupply).not.toHaveBeenCalled();
  });

  it('uses a freshly fetched vToken balance for a full withdrawal even when one is cached', async () => {
    const mockWithdraw = vi.fn();
    (useWithdrawFromSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
      isPending: false,
    }));

    const freshVTokenBalanceMantissa = new BigNumber('200000000000');
    (useGetVTokenBalance as Mock).mockImplementation(() => ({
      data: { balanceMantissa: new BigNumber('100000000000') },
      refetch: async () => ({ data: { balanceMantissa: freshVTokenBalanceMantissa } }),
    }));

    const poolWithoutDebt = {
      ...pool,
      userBorrowBalanceCents: new BigNumber(0),
      assets: pool.assets.map(asset => ({
        ...asset,
        userBorrowBalanceTokens: new BigNumber(0),
        userBorrowBalanceCents: new BigNumber(0),
      })),
    };

    renderComponent(
      <SpokeForm
        spokePool={poolWithoutDebt}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="withdraw"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount(collateral.userSupplyBalanceTokens.toFixed());
    await submit();

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw).toHaveBeenCalledWith(
      expect.objectContaining({
        withdrawFullSupply: true,
        vTokenBalanceMantissa: freshVTokenBalanceMantissa,
      }),
    );
  });

  it('moves on to the loan side after supplying collateral', async () => {
    (useSupplyToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: vi.fn(),
      isPending: false,
    }));
    const onSubmitSuccess = vi.fn();

    const poolWithWalletBalance = {
      ...pool,
      assets: pool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address
          ? { ...asset, userWalletBalanceTokens: new BigNumber(1000) }
          : asset,
      ),
    };

    const { queryByText } = renderComponent(
      <SpokeForm
        spokePool={poolWithWalletBalance}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="supply"
        onSubmitSuccess={onSubmitSuccess}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByText(en.spokeForm.repay.tabTitle)).not.toBeInTheDocument();

    await enterAmount('10');
    await submit();

    await waitFor(() => expect(queryByText(en.spokeForm.repay.tabTitle)).toBeInTheDocument());
    expect(onSubmitSuccess).not.toHaveBeenCalled();
  });

  it('closes a collateral-only form after supplying', async () => {
    (useSupplyToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: vi.fn(),
      isPending: false,
    }));
    const onSubmitSuccess = vi.fn();

    const poolWithWalletBalance = {
      ...pool,
      assets: pool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address
          ? { ...asset, userWalletBalanceTokens: new BigNumber(1000) }
          : asset,
      ),
    };

    renderComponent(
      <SpokeForm
        spokePool={poolWithWalletBalance}
        asset={loanAsset}
        collateralOnly
        onSubmitSuccess={onSubmitSuccess}
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount('10');
    await submit();

    await waitFor(() => expect(onSubmitSuccess).toHaveBeenCalledTimes(1));
  });

  it('follows refreshed pool data for the selected collateral', async () => {
    const withWalletBalance = (walletBalanceTokens: number) => ({
      ...pool,
      assets: pool.assets.map(asset =>
        asset.vToken.address === collateral.vToken.address
          ? { ...asset, userWalletBalanceTokens: new BigNumber(walletBalanceTokens) }
          : asset,
      ),
    });

    const { rerender, getByText } = renderComponent(
      <SpokeForm
        spokePool={withWalletBalance(1000)}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    rerender(
      <SpokeForm
        spokePool={withWalletBalance(5)}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="supply"
      />,
    );

    fireEvent.click(getByText(en.spokeForm.rightMaxButtonLabel));

    await waitFor(() =>
      expect(document.querySelector<HTMLInputElement>('input[name="amountTokens"]')!.value).toBe(
        '5',
      ),
    );
  });

  it('preselects the first collateral that can be supplied', async () => {
    const mockSupply = vi.fn();
    (useSupplyToSpoke as Mock).mockImplementation(() => ({
      mutateAsync: mockSupply,
      isPending: false,
    }));

    const pausedCollateral = {
      ...collateral,
      disabledTokenActions: ['supply' as const],
      userWalletBalanceTokens: new BigNumber(1000),
    };
    const suppliableCollateral = {
      ...collateral,
      disabledTokenActions: [],
      userWalletBalanceTokens: new BigNumber(1000),
      vToken: {
        ...collateral.vToken,
        address: '0x0000000000000000000000000000000000000002' as const,
        underlyingToken: xvs,
      },
    };

    const poolWithPausedFirstCollateral = {
      ...pool,
      assets: [
        ...pool.assets.map(asset =>
          asset.vToken.address === collateral.vToken.address ? pausedCollateral : asset,
        ),
        suppliableCollateral,
      ],
    };

    const { queryByText } = renderComponent(
      <SpokeForm
        spokePool={poolWithPausedFirstCollateral}
        asset={loanAsset}
        initialActiveTabId="collateral"
        initialCollateralTabId="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await enterAmount('10');

    expect(queryByText(en.spokeForm.error.supplyDisabled)).not.toBeInTheDocument();

    await submit();

    await waitFor(() => expect(mockSupply).toHaveBeenCalledTimes(1));
    expect(mockSupply).toHaveBeenCalledWith(
      expect.objectContaining({ vToken: suppliableCollateral.vToken }),
    );
  });
});
