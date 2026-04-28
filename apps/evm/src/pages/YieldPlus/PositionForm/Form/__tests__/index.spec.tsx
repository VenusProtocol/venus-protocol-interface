import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { exactInSwapQuote } from '__mocks__/models/swap';
import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import {
  useGetDsaVTokens,
  useGetPool,
  useGetProportionalCloseTolerancePercentage,
  useGetSimulatedPool,
} from 'clients/api';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError, handleError } from 'libs/errors';
import { en } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { calculateMaxLeverageFactor } from 'pages/YieldPlus/calculateMaxLeverageFactor';
import { renderComponent } from 'testUtils/render';
import type { BalanceMutation, ExactInSwapQuote, Pool } from 'types';
import { convertTokensToMantissa, formatTokensToReadableValue } from 'utilities';
import { Form, type FormProps, type FormValues } from '..';

vi.mock('@radix-ui/react-slider', () => ({
  Root: ({
    value = [0],
    min = 0,
    max = 100,
    step = 1,
    disabled,
    onValueChange,
  }: {
    value?: number[];
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (value: number[]) => void;
  }) => (
    <input
      data-testid="slider"
      type="range"
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      value={value[0]}
      onChange={event => onValueChange?.([Number(event.currentTarget.value)])}
    />
  ),
  Track: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Range: () => <div />,
  Thumb: () => <div />,
}));

vi.mock('libs/errors', async importOriginal => {
  const actual = await importOriginal<typeof import('libs/errors')>();

  return {
    ...actual,
    handleError: vi.fn(),
  };
});

const basePosition = yieldPlusPositions[0];
const alternativePosition = yieldPlusPositions[1];
const submitButtonLabel = 'Submit';

const borrowMutation: BalanceMutation = {
  type: 'asset',
  action: 'borrow',
  amountTokens: new BigNumber(1),
  vTokenAddress: basePosition.shortAsset.vToken.address,
};

const withdrawMutation: BalanceMutation = {
  type: 'asset',
  action: 'withdraw',
  amountTokens: new BigNumber(1),
  vTokenAddress: basePosition.dsaAsset.vToken.address,
};

const makeSwapQuote = ({
  fromToken = basePosition.shortAsset.vToken.underlyingToken,
  toToken = basePosition.longAsset.vToken.underlyingToken,
  priceImpactPercentage = 0.1,
}: {
  fromToken?: ExactInSwapQuote['fromToken'];
  toToken?: ExactInSwapQuote['toToken'];
  priceImpactPercentage?: number;
} = {}): ExactInSwapQuote => ({
  ...exactInSwapQuote,
  fromToken,
  toToken,
  priceImpactPercentage,
  fromTokenAmountSoldMantissa: BigInt(
    convertTokensToMantissa({
      value: new BigNumber(1),
      token: fromToken,
    }).toFixed(),
  ),
  expectedToTokenAmountReceivedMantissa: BigInt(
    convertTokensToMantissa({
      value: new BigNumber(1),
      token: toToken,
    }).toFixed(),
  ),
  minimumToTokenAmountReceivedMantissa: BigInt(
    convertTokensToMantissa({
      value: new BigNumber(0.9),
      token: toToken,
    }).toFixed(),
  ),
});

interface RenderFormInput
  extends Partial<Omit<FormProps, 'formValues' | 'setFormValues' | 'onSubmit' | 'position'>> {
  accountAddress?: string;
  formValues?: Partial<FormValues>;
  onSubmit?: FormProps['onSubmit'];
  position?: FormProps['position'];
}

const FormHarness: React.FC<RenderFormInput> = ({
  formValues,
  position = basePosition,
  onSubmit = vi.fn(async () => undefined),
  action = 'open',
  balanceMutations = [borrowMutation],
  submitButtonLabel: customSubmitButtonLabel = submitButtonLabel,
  isSubmitting = false,
  ...otherProps
}) => {
  const [currentFormValues, setCurrentFormValues] = useState<FormValues>({
    leverageFactor: basePosition.leverageFactor,
    dsaToken: basePosition.dsaAsset.vToken.underlyingToken,
    dsaAmountTokens: '',
    shortAmountTokens: '',
    longAmountTokens: '',
    acknowledgeRisk: false,
    acknowledgeHighPriceImpact: false,
    ...formValues,
  });

  return (
    <Form
      action={action}
      position={position}
      formValues={currentFormValues}
      setFormValues={setCurrentFormValues}
      balanceMutations={balanceMutations}
      submitButtonLabel={customSubmitButtonLabel}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      {...otherProps}
    />
  );
};

const renderForm = (input: RenderFormInput = {}) => {
  const hasExplicitAccountAddress = Object.prototype.hasOwnProperty.call(input, 'accountAddress');
  const accountAddress = hasExplicitAccountAddress
    ? input.accountAddress
    : basePosition.positionAccountAddress;
  const { accountAddress: _accountAddress, ...props } = input;

  if (!accountAddress) {
    (useAccountAddress as Mock).mockImplementation(() => ({
      accountAddress: undefined,
    }));
  }

  return renderComponent(<FormHarness {...props} />, {
    accountAddress,
  });
};

const getDsaAmountInput = (container: HTMLElement) => {
  const input = container.querySelector('input[name="dsaAmountTokens"]') as HTMLInputElement | null;

  if (!input) {
    throw new Error('Expected DSA amount input to be rendered');
  }

  return input;
};

const getShortAmountInput = (container: HTMLElement) => {
  const input = container.querySelector(
    'input[name="shortAmountTokens"]',
  ) as HTMLInputElement | null;

  if (!input) {
    throw new Error('Expected short amount input to be rendered');
  }

  return input;
};

const getSubmitButton = () => screen.getByRole('button', { name: submitButtonLabel });

describe('YieldPlus PositionForm Form', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseGetDsaVTokens = useGetDsaVTokens as Mock;
  const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
  const mockUseGetProportionalCloseTolerancePercentage =
    useGetProportionalCloseTolerancePercentage as Mock;
  const mockUseGetContractAddress = useGetContractAddress as Mock;
  const mockUseTokenApproval = useTokenApproval as Mock;

  const setReadyState = ({
    pool = basePosition.pool,
    simulatedPool = basePosition.pool,
    proportionalCloseTolerancePercentage = 2,
    contractAddress = fakeAddress,
    isTokenApproved = true,
    walletSpendingLimitTokens = new BigNumber('1000000'),
  }: {
    pool?: Pool;
    simulatedPool?: Pool;
    proportionalCloseTolerancePercentage?: number;
    contractAddress?: string;
    isTokenApproved?: boolean;
    walletSpendingLimitTokens?: BigNumber;
  } = {}) => {
    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool,
      },
      isLoading: false,
    }));

    mockUseGetDsaVTokens.mockImplementation(() => ({
      data: {
        dsaVTokenAddresses: [
          basePosition.dsaAsset.vToken.address,
          alternativePosition.dsaAsset.vToken.address,
        ],
      },
      isLoading: false,
    }));

    mockUseGetSimulatedPool.mockImplementation(({ pool: inputPool }: { pool: Pool }) => ({
      data: {
        pool: simulatedPool || inputPool,
      },
      isLoading: false,
    }));

    mockUseGetProportionalCloseTolerancePercentage.mockImplementation(() => ({
      data: {
        proportionalCloseTolerancePercentage,
      },
    }));

    mockUseGetContractAddress.mockImplementation(() => ({
      address: contractAddress,
    }));

    mockUseTokenApproval.mockImplementation(() => ({
      isTokenApproved,
      walletSpendingLimitTokens,
      approveToken: vi.fn(async () => undefined),
      revokeWalletSpendingLimit: vi.fn(async () => undefined),
      isApproveTokenLoading: false,
      isRevokeWalletSpendingLimitLoading: false,
      isWalletSpendingLimitLoading: false,
    }));
  };

  beforeEach(() => {
    setReadyState();
  });

  it('renders the open form with the real inputs and leverage control', async () => {
    const { container } = renderForm({
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    expect(screen.getByText(en.yieldPlus.operationForm.openForm.dsaFieldLabel)).toBeInTheDocument();
    expect(
      screen.getByText(en.yieldPlus.operationForm.openForm.longFieldLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByText(en.yieldPlus.operationForm.openForm.shortFieldLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `${basePosition.leverageFactor}x` }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('requires wallet connection to interact with the form', async () => {
    const { container } = renderForm({
      accountAddress: undefined,
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() =>
      expect(screen.getByText(en.connectWallet.connectButton)).toBeInTheDocument(),
    );

    expect(getDsaAmountInput(container)).toBeDisabled();
    expect(getShortAmountInput(container)).toBeDisabled();
    expect(screen.getByTestId('slider')).toBeDisabled();
  });

  it('fills the DSA amount with the wallet balance when clicking the wallet balance shortcut', async () => {
    const { container } = renderForm({
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    const readableWalletBalance = formatTokensToReadableValue({
      value: basePosition.dsaAsset.userWalletBalanceTokens,
      token: basePosition.dsaAsset.vToken.underlyingToken,
    });

    fireEvent.click(screen.getByText(readableWalletBalance));

    await waitFor(() =>
      expect(getDsaAmountInput(container).value).toBe(
        basePosition.dsaAsset.userWalletBalanceTokens.toFixed(),
      ),
    );
  });

  it('fills the short amount with the available limit when clicking the balance shortcut', async () => {
    const limitShortTokens = new BigNumber('1.5');
    const { container } = renderForm({
      action: 'increase',
      balanceMutations: [borrowMutation],
      limitShortTokens,
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() => expect(getShortAmountInput(container)).toBeInTheDocument());

    const readableLimit = formatTokensToReadableValue({
      value: limitShortTokens,
      token: basePosition.shortAsset.vToken.underlyingToken,
    });

    fireEvent.click(screen.getByText(readableLimit));

    await waitFor(() =>
      expect(getShortAmountInput(container).value).toBe(limitShortTokens.toFixed()),
    );
  });

  it('shows a no-swap error when quote lookup fails', async () => {
    const { container } = renderForm({
      repaySwapQuote: undefined,
      swapQuoteError: new VError({
        type: 'swapQuote',
        code: 'noSwapQuoteFound',
      }),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getDsaAmountInput(container), {
      target: { value: '1' },
    });
    fireEvent.change(getShortAmountInput(container), {
      target: { value: '0.1' },
    });

    await waitFor(() =>
      expect(screen.getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );
  });

  it('calls onSubmit with the current form values when submitting a valid form', async () => {
    const onSubmit = vi.fn(async () => undefined);
    const { container } = renderForm({
      action: 'withdrawDsa',
      onSubmit,
      balanceMutations: [withdrawMutation],
      limitDsaTokens: new BigNumber(5),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getDsaAmountInput(container), {
      target: { value: '1' },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        leverageFactor: basePosition.leverageFactor,
        dsaToken: basePosition.dsaAsset.vToken.underlyingToken,
        dsaAmountTokens: '1',
        shortAmountTokens: '',
        longAmountTokens: '',
        acknowledgeRisk: false,
        acknowledgeHighPriceImpact: false,
      }),
    );
  });

  it('requires high price impact acknowledgement before submit and resets the form after success', async () => {
    const onSubmit = vi.fn(async () => undefined);
    const { container } = renderForm({
      onSubmit,
      repaySwapQuote: makeSwapQuote({
        priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE + 1,
      }),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getDsaAmountInput(container), {
      target: { value: '1' },
    });
    fireEvent.change(getShortAmountInput(container), {
      target: { value: '0.1' },
    });

    await waitFor(() => expect(getSubmitButton()).toBeDisabled());
    expect(
      screen.getByText(
        en.operationForm.acknowledgements.highPriceImpact.tooltip.replace(
          '{{priceImpactPercentage}}',
          String(HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE),
        ),
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(getSubmitButton()).toBeEnabled());

    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(getDsaAmountInput(container)).toHaveValue(null);
      expect(getShortAmountInput(container)).toHaveValue(null);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  it('requires risk acknowledgement before enabling submit for risky collateral withdrawals', async () => {
    setReadyState({
      simulatedPool: {
        ...basePosition.pool,
        userHealthFactor: 1.2,
      },
    });

    const { container } = renderForm({
      action: 'withdrawDsa',
      balanceMutations: [withdrawMutation],
      limitDsaTokens: new BigNumber(5),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getDsaAmountInput(container), {
      target: { value: '1' },
    });

    await waitFor(() => expect(getSubmitButton()).toBeDisabled());
    expect(
      screen.getByText(en.operationForm.acknowledgements.riskyOperation.tooltip),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => expect(getSubmitButton()).toBeEnabled());
  });

  it('clamps the leverage factor to the computed maximum', async () => {
    const proportionalCloseTolerancePercentage = 1;
    const maximumLeverageFactor = calculateMaxLeverageFactor({
      dsaTokenCollateralFactor: basePosition.dsaAsset.collateralFactor,
      longTokenCollateralFactor: basePosition.longAsset.collateralFactor,
      proportionalCloseTolerancePercentage,
    });

    setReadyState({
      proportionalCloseTolerancePercentage,
    });

    renderForm({
      formValues: {
        leverageFactor: maximumLeverageFactor + 1,
      },
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: `${maximumLeverageFactor}x` })).toBeInTheDocument(),
    );
  });

  it('clamps the short amount to the provided short limit', async () => {
    const limitShortTokens = new BigNumber('1.25');
    const { container } = renderForm({
      limitShortTokens,
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() => expect(getShortAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getShortAmountInput(container), {
      target: { value: '2' },
    });

    await waitFor(() =>
      expect(getShortAmountInput(container).value).toBe(limitShortTokens.toFixed()),
    );
  });

  it('updates the short amount when moving the slider', async () => {
    const limitShortTokens = new BigNumber('4');
    const { container } = renderForm({
      limitShortTokens,
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() => expect(getShortAmountInput(container)).toBeInTheDocument());

    fireEvent.change(screen.getByTestId('slider'), {
      target: { value: '50' },
    });

    await waitFor(() => expect(getShortAmountInput(container).value).toBe('2'));
  });

  it('resets amount fields when the selected position tokens change', async () => {
    const { container, rerender } = renderForm({
      repaySwapQuote: makeSwapQuote(),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getDsaAmountInput(container), {
      target: { value: '1' },
    });
    fireEvent.change(getShortAmountInput(container), {
      target: { value: '0.1' },
    });

    await waitFor(() => {
      expect(getDsaAmountInput(container).value).toBe('1');
      expect(getShortAmountInput(container).value).toBe('0.1');
    });

    rerender(
      <FormHarness
        position={alternativePosition}
        repaySwapQuote={makeSwapQuote({
          fromToken: alternativePosition.shortAsset.vToken.underlyingToken,
          toToken: alternativePosition.longAsset.vToken.underlyingToken,
        })}
      />,
    );

    await waitFor(() => {
      expect(getDsaAmountInput(container)).toHaveValue(null);
      expect(getShortAmountInput(container)).toHaveValue(null);
    });
  });

  it('forwards submit errors to handleError without clearing the form', async () => {
    const error = new Error('submit failed');
    const onSubmit = vi.fn(async () => {
      throw error;
    });
    const { container } = renderForm({
      action: 'withdrawDsa',
      onSubmit,
      balanceMutations: [withdrawMutation],
      limitDsaTokens: new BigNumber(5),
    });

    await waitFor(() => expect(getDsaAmountInput(container)).toBeInTheDocument());

    fireEvent.change(getDsaAmountInput(container), {
      target: { value: '1' },
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() => expect(handleError).toHaveBeenCalledWith({ error }));
    expect(getDsaAmountInput(container).value).toBe('1');
  });
});
