import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import {
  useBorrowFromSpoke,
  useGetVTokenBalance,
  useRepayToSpoke,
  useSupplyToSpoke,
  useWithdrawFromSpoke,
} from 'clients/api';
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
});
