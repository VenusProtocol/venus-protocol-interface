import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { busd, xvs } from '__mocks__/models/tokens';
import type { GetPendleSwapQuoteOutput } from 'clients/api';
import { useGetBalanceOf } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useForm as useVaultForm } from 'containers/VaultCard/useForm';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { formatTokensToReadableValue } from 'utilities/formatTokensToReadableValue';

import { TransactionForm, type TransactionFormProps } from '..';

const makeUseTokenApprovalOutput = (overrides: Partial<ReturnType<typeof useTokenApproval>> = {}) =>
  ({
    isTokenApproved: true,
    isWalletSpendingLimitLoading: false,
    isApproveTokenLoading: false,
    isRevokeWalletSpendingLimitLoading: false,
    walletSpendingLimitTokens: new BigNumber(40),
    approveToken: vi.fn(),
    revokeWalletSpendingLimit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as ReturnType<typeof useTokenApproval>;

const baseProps: Omit<TransactionFormProps, 'form'> = {
  fromToken: xvs,
  limitFromTokens: new BigNumber(100),
  fromTokenFieldLabel: 'Deposit',
  submitButtonLabel: 'Deposit',
  onSubmit: vi.fn().mockResolvedValue(undefined),
  fromTokenPriceCents: 123,
  spenderAddress: '0xfakeSpenderAddress' as Address,
};

const fakeSwapQuote: GetPendleSwapQuoteOutput = {
  estimatedReceivedTokensMantissa: new BigNumber('12000000000000000000'),
  feeCents: new BigNumber(25),
  priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  pendleMarketAddress: '0xfakePendleMarketAddress' as Address,
  contractCallParamsName: [],
  contractCallParams: [] as unknown as GetPendleSwapQuoteOutput['contractCallParams'],
  requiredApprovals: [],
};

const renderTransactionForm = ({
  props = {},
  walletSpendingLimitTokens = new BigNumber(40),
  ...options
}: {
  props?: Partial<Omit<TransactionFormProps, 'form'>>;
  accountAddress?: string;
  walletSpendingLimitTokens?: BigNumber;
} = {}) => {
  const accountAddress = Object.prototype.hasOwnProperty.call(options, 'accountAddress')
    ? options.accountAddress
    : fakeAccountAddress;
  const mergedProps = {
    ...baseProps,
    ...props,
  };

  const TestComponent = () => {
    const form = useVaultForm({
      limitFromTokens: mergedProps.limitFromTokens,
      walletSpendingLimitTokens,
    });

    return <TransactionForm {...mergedProps} form={form} />;
  };

  return {
    ...renderComponent(<TestComponent />, { accountAddress }),
    props: mergedProps,
  };
};

describe('TransactionForm', () => {
  beforeEach(() => {
    (useGetBalanceOf as Mock).mockReturnValue({
      data: {
        balanceMantissa: new BigNumber('80000000000000000000'),
      },
      isLoading: false,
    });

    (useTokenApproval as Mock).mockReturnValue(makeUseTokenApprovalOutput());
  });

  it('renders the disconnected state and skips the transaction fields', () => {
    renderTransactionForm({
      accountAddress: undefined,
      props: {
        spenderAddress: undefined,
      },
    });

    expect(screen.getByText(en.vault.modals.connectWalletMessage)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('0.00')).not.toBeInTheDocument();

    expect(useGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
        token: xvs,
      },
      {
        enabled: false,
      },
    );
    expect(
      screen.getByRole('button', {
        name: en.connectWallet.connectButton,
      }),
    ).toBeInTheDocument();
  });

  it('renders the connected state with the spending limit and footer', async () => {
    const revokeWalletSpendingLimit = vi.fn().mockResolvedValue(undefined);
    const readableSpendingLimit = formatTokensToReadableValue({
      value: new BigNumber(25),
      token: xvs,
    });

    (useTokenApproval as Mock).mockReturnValue(
      makeUseTokenApprovalOutput({
        walletSpendingLimitTokens: new BigNumber(25),
        revokeWalletSpendingLimit,
      }),
    );

    renderTransactionForm({
      props: {
        footer: <div>Footer content</div>,
      },
    });

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: formatTokensToReadableValue({
          value: baseProps.limitFromTokens,
          token: xvs,
        }),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();

    expect(useGetBalanceOf).toHaveBeenCalledWith(
      {
        accountAddress: fakeAccountAddress,
        token: xvs,
      },
      {
        enabled: true,
      },
    );

    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(screen.getByText(readableSpendingLimit)).toBeInTheDocument();

    const spendingLimitRow = screen.getByText(en.spendingLimit.label).parentElement?.parentElement;

    expect(spendingLimitRow).toBeInTheDocument();

    fireEvent.click(within(spendingLimitRow as HTMLElement).getByRole('button'));

    await waitFor(() => expect(revokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('sets the amount from the available balance button and enables submit', async () => {
    const walletSpendingLimitTokens = new BigNumber(120);

    (useTokenApproval as Mock).mockReturnValue(
      makeUseTokenApprovalOutput({
        walletSpendingLimitTokens,
      }),
    );

    const { props } = renderTransactionForm({
      walletSpendingLimitTokens,
    });
    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
    const readableLimit = formatTokensToReadableValue({
      value: props.limitFromTokens,
      token: xvs,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: readableLimit,
      }),
    );

    await waitFor(() => expect(input.value).toBe('100'));
    expect(screen.getByText(en.operationForm.riskSlider['0'])).toBeInTheDocument();
    expect(screen.getByText(en.operationForm.riskSlider['100'])).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: baseProps.submitButtonLabel,
        }),
      ).toBeEnabled(),
    );
  });

  it('shows approval steps when the token is not approved', async () => {
    const limitFromTokens = new BigNumber(12);

    (useTokenApproval as Mock).mockReturnValue(
      makeUseTokenApprovalOutput({
        isTokenApproved: false,
        walletSpendingLimitTokens: limitFromTokens,
      }),
    );

    renderTransactionForm({
      props: {
        limitFromTokens,
      },
      walletSpendingLimitTokens: limitFromTokens,
    });

    fireEvent.click(screen.getByRole('button', { name: '12 XVS' }));

    await waitFor(() => expect(screen.getByText(en.approveTokenSteps.step1)).toBeInTheDocument());
    expect(
      screen.getByRole('button', {
        name: en.approveTokenSteps.approveTokenButton.text.replace('{{tokenSymbol}}', xvs.symbol),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(en.approveTokenSteps.step2)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: baseProps.submitButtonLabel,
      }),
    ).toBeDisabled();
  });

  it('gates submission behind the optional acknowledgement', async () => {
    const limitFromTokens = new BigNumber(12);

    renderTransactionForm({
      props: {
        limitFromTokens,
        acknowledgement: 'I agree',
      },
      walletSpendingLimitTokens: limitFromTokens,
    });

    fireEvent.click(screen.getByRole('button', { name: '12 XVS' }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: baseProps.submitButtonLabel,
        }),
      ).toBeDisabled(),
    );

    expect(screen.getByText('I agree')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() =>
      expect(
        screen.getByRole('button', {
          name: baseProps.submitButtonLabel,
        }),
      ).toBeEnabled(),
    );
  });

  it('submits the form and resets the amount field on success', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const limitFromTokens = new BigNumber(12);

    renderTransactionForm({
      props: {
        onSubmit,
        limitFromTokens,
      },
      walletSpendingLimitTokens: limitFromTokens,
    });

    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;

    fireEvent.click(screen.getByRole('button', { name: '12 XVS' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole('button', { name: baseProps.submitButtonLabel }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(input.value).toBe(''));
  });

  it('renders swap details and requires high price impact acknowledgement before submit', async () => {
    renderTransactionForm({
      props: {
        spenderAddress: undefined,
        swapFromToken: xvs,
        swapToToken: busd,
        swapQuote: fakeSwapQuote,
      },
      walletSpendingLimitTokens: new BigNumber(120),
    });

    fireEvent.click(screen.getByRole('button', { name: '100 XVS' }));

    expect(screen.getByText(en.swapDetails.slippageTolerance.label)).toBeInTheDocument();
    expect(screen.getByText(en.swapDetails.priceImpact.label)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeDisabled(),
    );

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeEnabled(),
    );
  });

  it('shows the pendle quote validation message when the quote request fails', async () => {
    renderTransactionForm({
      props: {
        spenderAddress: undefined,
        swapFromToken: xvs,
        swapToToken: busd,
        swapQuoteError: {
          type: 'pendleSwapQuote',
          code: 'PENDLE_NO_ROUTE_FOUND',
        } as TransactionFormProps['swapQuoteError'],
      },
      walletSpendingLimitTokens: new BigNumber(120),
    });

    fireEvent.click(screen.getByRole('button', { name: '100 XVS' }));

    await waitFor(() =>
      expect(screen.getByText(en.vault.modals.error.noSwapQuoteFound)).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: baseProps.submitButtonLabel })).toBeDisabled();
  });

  it('blocks swaps when the price impact reaches the maximum threshold', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderTransactionForm({
      props: {
        onSubmit,
        spenderAddress: undefined,
        swapFromToken: xvs,
        swapToToken: busd,
        swapQuote: {
          ...fakeSwapQuote,
          priceImpactPercentage: MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
        },
      },
      walletSpendingLimitTokens: new BigNumber(120),
    });

    fireEvent.click(screen.getByRole('button', { name: '100 XVS' }));

    await waitFor(() =>
      expect(screen.getByText(en.operationForm.error.priceImpactTooHigh)).toBeInTheDocument(),
    );
    expect(
      screen.queryByText(en.operationForm.acknowledgements.highPriceImpact.label),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: baseProps.submitButtonLabel }));

    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
  });
});
