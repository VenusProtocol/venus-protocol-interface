import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { tradePositions } from '__mocks__/models/trade';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { en, t } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetTradeAssets } from 'pages/Trade/useGetTradeAssets';
import { renderComponent } from 'testUtils/render';
import { formatTokensToReadableValue } from 'utilities';
import { WalletBalance } from '..';

vi.mock('pages/Trade/useGetTradeAssets', () => ({
  useGetTradeAssets: vi.fn(),
}));

const basePosition = tradePositions[0];
const baseAsset = poolData[0].assets[0];
const alternativeAsset = poolData[0].assets[2];
const baseToken = basePosition.dsaAsset.vToken.underlyingToken;
const baseWalletSpendingLimitTokens = new BigNumber(10);

const mockUseGetTradeAssets = useGetTradeAssets as Mock;
const mockUseGetContractAddress = useGetContractAddress as Mock;
const mockUseTokenApproval = useTokenApproval as Mock;
const mockUseAccountAddress = useAccountAddress as Mock;

const setComponentState = ({
  dsaAssets = [baseAsset, alternativeAsset],
  contractAddress = fakeAddress,
  walletSpendingLimitTokens = baseWalletSpendingLimitTokens,
  revokeWalletSpendingLimit = vi.fn(async () => undefined),
  isRevokeWalletSpendingLimitLoading = false,
}: {
  dsaAssets?: (typeof poolData)[0]['assets'];
  contractAddress?: string;
  walletSpendingLimitTokens?: BigNumber;
  revokeWalletSpendingLimit?: () => Promise<unknown>;
  isRevokeWalletSpendingLimitLoading?: boolean;
} = {}) => {
  mockUseGetTradeAssets.mockImplementation(() => ({
    data: {
      dsaAssets,
      supplyAssets: [],
      borrowAssets: [],
    },
    isLoading: false,
  }));

  mockUseGetContractAddress.mockImplementation(() => ({
    address: contractAddress,
  }));

  mockUseTokenApproval.mockImplementation(() => ({
    walletSpendingLimitTokens,
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
}: {
  token?: typeof baseToken;
  accountAddress?: string;
  onBalanceClick?: (walletBalanceTokens: BigNumber) => unknown;
} = {}) => {
  if (!accountAddress) {
    mockUseAccountAddress.mockImplementation(() => ({
      accountAddress: undefined,
    }));
  }

  return {
    onBalanceClick,
    ...renderComponent(<WalletBalance token={token} onBalanceClick={onBalanceClick} />, {
      accountAddress,
    }),
  };
};

describe('WalletBalance', () => {
  beforeEach(() => {
    setComponentState();
  });

  it('renders the wallet balance and spending limit for the matching token', () => {
    const readableBalance = formatTokensToReadableValue({
      value: baseAsset.userWalletBalanceTokens,
      token: baseToken,
    });
    const readableSpendingLimit = formatTokensToReadableValue({
      value: baseWalletSpendingLimitTokens,
      token: baseToken,
    });

    renderWalletBalance();

    expect(screen.getByText(t('trade.operationForm.walletBalance'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: readableBalance })).toBeInTheDocument();
    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(screen.getByText(readableSpendingLimit)).toBeInTheDocument();
  });

  it('looks up the wallet balance using the matching DSA asset token', () => {
    const readableBalance = formatTokensToReadableValue({
      value: alternativeAsset.userWalletBalanceTokens,
      token: alternativeAsset.vToken.underlyingToken,
    });

    renderWalletBalance({
      token: alternativeAsset.vToken.underlyingToken,
    });

    expect(screen.getByRole('button', { name: readableBalance })).toBeInTheDocument();
  });

  it('calls onBalanceClick with the full wallet balance when clicking on available balance', async () => {
    const readableBalance = formatTokensToReadableValue({
      value: baseAsset.userWalletBalanceTokens,
      token: baseToken,
    });
    const { onBalanceClick } = renderWalletBalance();

    fireEvent.click(screen.getByRole('button', { name: readableBalance }));

    await waitFor(() =>
      expect(onBalanceClick).toHaveBeenCalledWith(baseAsset.userWalletBalanceTokens),
    );
  });

  it('passes the token approval inputs using the connected account and relative position manager address', () => {
    renderWalletBalance();

    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: baseToken,
      spenderAddress: fakeAddress,
      accountAddress: fakeAddress,
    });
  });

  it('lets user revoke their wallet spending limit', async () => {
    const { revokeWalletSpendingLimit } = setComponentState();
    const readableSpendingLimit = formatTokensToReadableValue({
      value: baseWalletSpendingLimitTokens,
      token: baseToken,
    });

    renderWalletBalance();

    const spendingLimitContainer =
      screen.getByText(readableSpendingLimit).parentElement?.parentElement;

    if (!spendingLimitContainer) {
      throw new Error('Expected spending limit container to be rendered');
    }

    fireEvent.click(within(spendingLimitContainer).getByRole('button'));

    await waitFor(() => expect(revokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('disables balance click and hides spending limit when no matching asset is found', () => {
    setComponentState({
      dsaAssets: [alternativeAsset],
    });

    const onBalanceClick = vi.fn();

    renderWalletBalance({
      onBalanceClick,
      token: baseToken,
    });

    const balanceButton = screen.getByRole('button');

    expect(balanceButton).toBeDisabled();
    expect(screen.queryByText(en.spendingLimit.label)).not.toBeInTheDocument();

    fireEvent.click(balanceButton);

    expect(onBalanceClick).not.toHaveBeenCalled();
  });
});
