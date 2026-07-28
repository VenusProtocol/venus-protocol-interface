import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetBalanceOf } from 'clients/api';
import useTokenApproval from 'hooks/useTokenApproval';
import { en, t } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { renderComponent } from 'testUtils/render';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { WalletBalance } from '..';

const baseToken = poolData[0].assets[0].vToken.underlyingToken;
const baseWalletBalanceTokens = new BigNumber(100);
const baseWalletBalanceMantissa = convertTokensToMantissa({
  value: baseWalletBalanceTokens,
  token: baseToken,
});
const baseWalletSpendingLimitTokens = new BigNumber(10);

const mockUseGetBalanceOf = useGetBalanceOf as Mock;
const mockUseTokenApproval = useTokenApproval as Mock;
const mockUseAccountAddress = useAccountAddress as Mock;

const setComponentState = ({
  walletSpendingLimitTokens = baseWalletSpendingLimitTokens,
  revokeWalletSpendingLimit = vi.fn(async () => undefined),
  isRevokeWalletSpendingLimitLoading = false,
  ...options
}: {
  balanceMantissa?: BigNumber;
  walletSpendingLimitTokens?: BigNumber;
  revokeWalletSpendingLimit?: () => Promise<unknown>;
  isRevokeWalletSpendingLimitLoading?: boolean;
} = {}) => {
  const balanceMantissa =
    'balanceMantissa' in options ? options.balanceMantissa : baseWalletBalanceMantissa;

  mockUseGetBalanceOf.mockImplementation(() => ({
    data: balanceMantissa ? { balanceMantissa } : undefined,
    isLoading: false,
  }));

  mockUseTokenApproval.mockImplementation(({ spenderAddress }: { spenderAddress?: Address }) => ({
    walletSpendingLimitTokens: spenderAddress ? walletSpendingLimitTokens : undefined,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
  }));

  return {
    revokeWalletSpendingLimit,
  };
};

const renderWalletBalance = ({
  token = baseToken,
  accountAddress = fakeAddress,
  onBalanceClick = vi.fn(),
  spenderAddress,
}: {
  token?: typeof baseToken;
  accountAddress?: Address;
  onBalanceClick?: (walletBalanceTokens: BigNumber) => unknown;
  spenderAddress?: Address;
} = {}) => {
  mockUseAccountAddress.mockImplementation(() => ({
    accountAddress,
  }));

  return {
    onBalanceClick,
    ...renderComponent(
      <WalletBalance
        token={token}
        onBalanceClick={onBalanceClick}
        spenderAddress={spenderAddress}
      />,
      {
        accountAddress,
      },
    ),
  };
};

describe('WalletBalance', () => {
  beforeEach(() => {
    setComponentState();
  });

  it('renders the wallet balance from queried balance data and spending limit', () => {
    const readableBalance = formatTokensToReadableValue({
      value: baseWalletBalanceTokens,
      token: baseToken,
    });
    const readableSpendingLimit = formatTokensToReadableValue({
      value: baseWalletSpendingLimitTokens,
      token: baseToken,
    });

    renderWalletBalance({
      spenderAddress: fakeAddress,
    });

    expect(screen.getByText(t('trade.operationForm.walletBalance'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: readableBalance })).toBeInTheDocument();
    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(screen.getByText(readableSpendingLimit)).toBeInTheDocument();
  });

  it('calls onBalanceClick with the full wallet balance when clicking on available balance', async () => {
    const readableBalance = formatTokensToReadableValue({
      value: baseWalletBalanceTokens,
      token: baseToken,
    });
    const { onBalanceClick } = renderWalletBalance({
      spenderAddress: fakeAddress,
    });

    fireEvent.click(screen.getByRole('button', { name: readableBalance }));

    await waitFor(() => expect(onBalanceClick).toHaveBeenCalledWith(baseWalletBalanceTokens));
  });

  it('passes spender address through to useTokenApproval', () => {
    renderWalletBalance({
      spenderAddress: fakeAddress,
    });

    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: baseToken,
      spenderAddress: fakeAddress,
      accountAddress: fakeAddress,
    });
  });

  it('does not show spending limit when spender address is omitted', () => {
    renderWalletBalance();

    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: baseToken,
      spenderAddress: undefined,
      accountAddress: fakeAddress,
    });
    expect(screen.queryByText(en.spendingLimit.label)).not.toBeInTheDocument();
  });

  it('lets user revoke their wallet spending limit', async () => {
    const { revokeWalletSpendingLimit } = setComponentState();
    const readableSpendingLimit = formatTokensToReadableValue({
      value: baseWalletSpendingLimitTokens,
      token: baseToken,
    });

    renderWalletBalance({
      spenderAddress: fakeAddress,
    });

    const spendingLimitContainer =
      screen.getByText(readableSpendingLimit).parentElement?.parentElement;

    if (!spendingLimitContainer) {
      throw new Error('Expected spending limit container to be rendered');
    }

    fireEvent.click(within(spendingLimitContainer).getByRole('button'));

    await waitFor(() => expect(revokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('disables balance click and hides spending limit when no queried balance is found', () => {
    setComponentState({
      balanceMantissa: undefined,
    });

    const onBalanceClick = vi.fn();

    renderWalletBalance({
      onBalanceClick,
      spenderAddress: fakeAddress,
    });

    const balanceButton = screen.getByRole('button');

    expect(balanceButton).toBeDisabled();
    expect(screen.queryByText(en.spendingLimit.label)).not.toBeInTheDocument();

    fireEvent.click(balanceButton);

    expect(onBalanceClick).not.toHaveBeenCalled();
  });
});
