import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokeForm } from '..';

vi.mock('hooks/useTokenApproval');

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
  assets: spokePool.assets.map(asset => {
    if (asset.vToken.address === loanAsset.vToken.address) {
      return loanAsset;
    }

    if (asset.vToken.address === collateral.vToken.address) {
      return { ...asset, userWalletBalanceTokens: new BigNumber(1000) };
    }

    return asset;
  }),
};

const fakeWalletSpendingLimitTokens = new BigNumber(10);
const fakeRevokeWalletSpendingLimit = vi.fn();

const getAmountInput = () =>
  waitFor(() => {
    const element = document.querySelector<HTMLInputElement>('input[name="amountTokens"]');
    expect(element).not.toBeNull();
    return element!;
  });

const getSubmitButton = () => document.querySelector('button[type="submit"]') as HTMLButtonElement;

describe.each([
  {
    label: 'repay',
    token: loanAsset.vToken.underlyingToken,
    props: { initialActiveTabId: 'loan', initialLoanTabId: 'repay' },
  },
  {
    label: 'supply',
    token: collateral.vToken.underlyingToken,
    props: { initialActiveTabId: 'collateral', initialCollateralTabId: 'supply' },
  },
] as const)('SpokeForm $label spending limit', ({ token, props }) => {
  beforeEach(() => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: loanAsset.vToken.underlyingToken,
      spenderAddress: loanAsset.vToken.address,
      accountAddress: fakeAccountAddress,
    });

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
    }));
  });

  it('blocks an amount above the spending limit', async () => {
    const { getByText } = renderComponent(
      <SpokeForm spokePool={pool} asset={loanAsset} {...props} />,
      { accountAddress: fakeAccountAddress },
    );

    fireEvent.change(await getAmountInput(), {
      target: { value: fakeWalletSpendingLimitTokens.plus(1).toFixed() },
    });

    await waitFor(() =>
      expect(getByText(en.marketForm.error.higherThanWalletSpendingLimit)).toBeInTheDocument(),
    );
    expect(getSubmitButton()).toBeDisabled();
  });

  it('caps MAX at the spending limit', async () => {
    const { getByText } = renderComponent(
      <SpokeForm spokePool={pool} asset={loanAsset} {...props} />,
      { accountAddress: fakeAccountAddress },
    );

    const input = await getAmountInput();
    fireEvent.click(getByText(en.spokeForm.rightMaxButtonLabel));

    await waitFor(() => expect(input.value).toBe(fakeWalletSpendingLimitTokens.toFixed()));
  });

  it('lets the user revoke the spending limit', async () => {
    const { getByText } = renderComponent(
      <SpokeForm spokePool={pool} asset={loanAsset} {...props} />,
      { accountAddress: fakeAccountAddress },
    );

    const readableSpendingLimit = await waitFor(() =>
      getByText(`${fakeWalletSpendingLimitTokens.toFixed()} ${token.symbol}`),
    );
    fireEvent.click(within(readableSpendingLimit.parentElement!).getByRole('button'));

    await waitFor(() => expect(fakeRevokeWalletSpendingLimit).toHaveBeenCalled());
  });
});
