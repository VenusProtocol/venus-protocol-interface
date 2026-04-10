import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { renderComponent } from 'testUtils/render';
import { formatTokensToReadableValue } from 'utilities';
import type { DsaTokenTextFieldProps } from '..';
import { DsaTokenTextField } from '..';

vi.mock('pages/YieldPlus/useGetYieldPlusAssets', () => ({
  useGetYieldPlusAssets: vi.fn(),
}));

const basePosition = yieldPlusPositions[0];
const baseAsset = poolData[0].assets[0];
const alternativeAsset = poolData[0].assets[1];
const baseToken = basePosition.dsaAsset.vToken.underlyingToken;
const baseWalletSpendingLimitTokens = new BigNumber(10);
const dsaTokenTextFieldTestId = 'dsa-token-text-field';

const mockUseGetYieldPlusAssets = useGetYieldPlusAssets as Mock;
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
  dsaAssets?: (typeof poolData)[0]['assets'][number][];
  contractAddress?: string;
  walletSpendingLimitTokens?: BigNumber;
  revokeWalletSpendingLimit?: () => Promise<unknown>;
  isRevokeWalletSpendingLimitLoading?: boolean;
} = {}) => {
  mockUseGetYieldPlusAssets.mockImplementation(() => ({
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

interface RenderInput
  extends Partial<Omit<DsaTokenTextFieldProps, 'token' | 'value' | 'onChange'>> {
  accountAddress?: string;
  token?: DsaTokenTextFieldProps['token'];
  initialValue?: string;
  onChange?: DsaTokenTextFieldProps['onChange'];
  'data-testid'?: string;
}

const DsaTokenTextFieldHarness: React.FC<RenderInput> = ({
  token = baseToken,
  initialValue = '',
  onChange = vi.fn(),
  tokenPriceCents = basePosition.dsaAsset.tokenPriceCents.toNumber(),
  'data-testid': testId = dsaTokenTextFieldTestId,
  ...otherProps
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <DsaTokenTextField
      token={token}
      value={value}
      onChange={newValue => {
        onChange(newValue);
        setValue(newValue);
      }}
      tokenPriceCents={tokenPriceCents}
      data-testid={testId}
      {...otherProps}
    />
  );
};

const renderDsaTokenTextField = (input: RenderInput = {}) => {
  const hasExplicitAccountAddress = Object.prototype.hasOwnProperty.call(input, 'accountAddress');
  const accountAddress = hasExplicitAccountAddress ? input.accountAddress : fakeAddress;
  const onChange = input.onChange || vi.fn();
  const { accountAddress: _accountAddress, ...props } = input;

  if (!accountAddress) {
    mockUseAccountAddress.mockImplementation(() => ({
      accountAddress: undefined,
    }));
  }

  return {
    onChange,
    ...renderComponent(<DsaTokenTextFieldHarness onChange={onChange} {...props} />, {
      accountAddress,
    }),
  };
};

describe('DsaTokenTextField', () => {
  beforeEach(() => {
    setComponentState();
  });

  it('renders the token input with the available balance and spending limit when user is connected', () => {
    const readableBalance = formatTokensToReadableValue({
      value: baseAsset.userWalletBalanceTokens,
      token: baseToken,
    });
    const readableSpendingLimit = formatTokensToReadableValue({
      value: baseWalletSpendingLimitTokens,
      token: baseToken,
    });

    renderDsaTokenTextField({
      initialValue: '1',
    });

    expect(screen.getByTestId(dsaTokenTextFieldTestId)).toHaveValue(1);
    expect(screen.getByText(en.availableBalance.label)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: readableBalance })).toBeInTheDocument();
    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(screen.getByText(readableSpendingLimit)).toBeInTheDocument();
  });

  it('looks up the available balance using the matching DSA asset token', () => {
    const readableBalance = formatTokensToReadableValue({
      value: alternativeAsset.userWalletBalanceTokens,
      token: alternativeAsset.vToken.underlyingToken,
    });

    renderDsaTokenTextField({
      token: alternativeAsset.vToken.underlyingToken,
    });

    expect(screen.getByRole('button', { name: readableBalance })).toBeInTheDocument();
  });

  it('updates the input value to the full DSA wallet balance when clicking on available balance', async () => {
    const readableBalance = formatTokensToReadableValue({
      value: baseAsset.userWalletBalanceTokens,
      token: baseToken,
    });
    const { onChange } = renderDsaTokenTextField();

    fireEvent.click(screen.getByRole('button', { name: readableBalance }));

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(baseAsset.userWalletBalanceTokens.toFixed()),
    );
    expect(screen.getByTestId(dsaTokenTextFieldTestId)).toHaveValue(
      Number(baseAsset.userWalletBalanceTokens.toFixed()),
    );
  });

  it('hides the available balance and spending limit when user is disconnected', () => {
    renderDsaTokenTextField({
      accountAddress: undefined,
    });

    expect(screen.queryByText(en.availableBalance.label)).not.toBeInTheDocument();
    expect(screen.queryByText(en.spendingLimit.label)).not.toBeInTheDocument();
  });

  it('passes the token approval inputs using the connected account and relative position manager address', () => {
    renderDsaTokenTextField();

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

    renderDsaTokenTextField();

    const spendingLimitContainer =
      screen.getByText(readableSpendingLimit).parentElement?.parentElement;

    if (!spendingLimitContainer) {
      throw new Error('Expected spending limit container to be rendered');
    }

    fireEvent.click(within(spendingLimitContainer).getByRole('button'));

    await waitFor(() => expect(revokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });
});
