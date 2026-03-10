import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { exactInSwapQuote } from '__mocks__/models/swap';
import {
  useGetDsaVTokens,
  useGetPool,
  useGetProportionalCloseTolerancePercentage,
} from 'clients/api';
import { useGetSimulatedPool, useGetSwapQuote, useOpenYieldPlusPosition } from 'clients/api';
import { en } from 'libs/translations';
import {
  LONG_TOKEN_ADDRESS_PARAM_KEY,
  SHORT_TOKEN_ADDRESS_PARAM_KEY,
} from 'pages/YieldPlus/constants';
import { renderComponent } from 'testUtils/render';
import type { ExactInSwapQuote, Pool, SwapQuote } from 'types';
import { OpenForm } from '..';

const longAsset = poolData[0].assets[2];
const shortAsset = poolData[0].assets[3];
const dsaAsset = poolData[0].assets[0];

const getSwapQuote = ({
  priceImpactPercentage = 0.1,
}: {
  priceImpactPercentage?: number;
} = {}): ExactInSwapQuote => ({
  ...exactInSwapQuote,
  fromToken: shortAsset.vToken.underlyingToken,
  toToken: longAsset.vToken.underlyingToken,
  priceImpactPercentage,
});

const renderOpenForm = ({
  accountAddress,
}: {
  accountAddress?: string;
} = {}) =>
  renderComponent(<OpenForm />, {
    accountAddress,
    routerInitialEntries: [
      `/?${SHORT_TOKEN_ADDRESS_PARAM_KEY}=${shortAsset.vToken.underlyingToken.address}&${LONG_TOKEN_ADDRESS_PARAM_KEY}=${longAsset.vToken.underlyingToken.address}`,
    ],
  });

const getFormInputs = (container: HTMLElement) => {
  const dsaAmountInput = container.querySelector(
    'input[name="dsaAmountTokens"]',
  ) as HTMLInputElement;
  const shortAmountInput = container.querySelector(
    'input[name="shortAmountTokens"]',
  ) as HTMLInputElement;

  if (!dsaAmountInput || !shortAmountInput) {
    throw new Error('Expected dsa and short amount inputs to be rendered');
  }

  return {
    dsaAmountInput,
    shortAmountInput,
  };
};

const enterFormValues = ({
  container,
  dsaAmountTokens,
  shortAmountTokens,
}: {
  container: HTMLElement;
  dsaAmountTokens: string;
  shortAmountTokens: string;
}) => {
  const { dsaAmountInput, shortAmountInput } = getFormInputs(container);

  fireEvent.change(dsaAmountInput, {
    target: { value: dsaAmountTokens },
  });

  fireEvent.change(shortAmountInput, {
    target: { value: shortAmountTokens },
  });
};

describe('OpenForm', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseGetDsaVTokens = useGetDsaVTokens as Mock;
  const mockUseGetProportionalCloseTolerancePercentage =
    useGetProportionalCloseTolerancePercentage as Mock;
  const mockUseGetSwapQuote = useGetSwapQuote as Mock;
  const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
  const mockUseOpenYieldPlusPosition = useOpenYieldPlusPosition as Mock;
  const mockOpenYieldPlusPosition = vi.fn();

  const setReadyState = ({
    simulatedPool = poolData[0],
    swapQuote = getSwapQuote(),
    swapQuoteError,
  }: {
    simulatedPool?: Pool;
    swapQuote?: SwapQuote;
    swapQuoteError?: { code: string };
  } = {}) => {
    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    }));

    mockUseGetDsaVTokens.mockImplementation(() => ({
      data: {
        dsaVTokenAddresses: [dsaAsset.vToken.address] as Address[],
      },
      isLoading: false,
    }));

    mockUseGetProportionalCloseTolerancePercentage.mockImplementation(() => ({
      data: {
        proportionalCloseTolerancePercentage: 2,
      },
    }));

    mockUseGetSwapQuote.mockImplementation(() => ({
      data: {
        swapQuote,
      },
      error: swapQuoteError,
      isLoading: false,
    }));

    mockUseGetSimulatedPool.mockImplementation(({ pool }: { pool: Pool }) => ({
      data: {
        pool: simulatedPool || pool,
      },
      isLoading: false,
    }));

    mockUseOpenYieldPlusPosition.mockImplementation(() => ({
      mutateAsync: mockOpenYieldPlusPosition,
      isPending: false,
    }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setReadyState();
  });

  it('renders real form when data is ready', async () => {
    const { container, getByText, getAllByText } = renderOpenForm({
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );
    expect(getAllByText(en.yieldPlus.operationForm.openForm.dsaFieldLabel).length).toBeGreaterThan(
      0,
    );
    expect(getAllByText(en.yieldPlus.operationForm.openForm.longFieldLabel).length).toBeGreaterThan(
      0,
    );

    expect(
      getAllByText(en.yieldPlus.operationForm.openForm.shortFieldLabel).length,
    ).toBeGreaterThan(0);

    expect(container.textContent).toMatchSnapshot();
  });

  it('requires wallet connection to interact with form fields', async () => {
    const { container, getByText } = renderOpenForm();

    await waitFor(() => expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument());

    const { dsaAmountInput, shortAmountInput } = getFormInputs(container);

    expect(dsaAmountInput).toBeDisabled();
    expect(shortAmountInput).toBeDisabled();
  });

  it('shows wallet balance error when collateral amount exceeds wallet balance', async () => {
    const { container, getByText } = renderOpenForm({ accountAddress: fakeAccountAddress });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );

    const { dsaAmountInput } = getFormInputs(container);

    fireEvent.change(dsaAmountInput, {
      target: { value: '1000' },
    });

    await waitFor(() =>
      expect(
        getByText(en.operationForm.error.higherThanWalletBalance.replace('{{tokenSymbol}}', 'XVS')),
      ).toBeInTheDocument(),
    );
  });

  it('shows no-swap error when quote lookup fails', async () => {
    setReadyState({
      swapQuote: undefined,
      swapQuoteError: {
        code: 'NO_SWAP_QUOTE_FOUND',
      },
    });

    const { container, getByText } = renderOpenForm({ accountAddress: fakeAccountAddress });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );

    enterFormValues({
      container,
      dsaAmountTokens: '1',
      shortAmountTokens: '0.1',
    });

    await waitFor(() =>
      expect(getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );
  });

  it('requires acknowledgement in the risky operation case before submit can be enabled', async () => {
    setReadyState({
      simulatedPool: {
        ...poolData[0],
        userHealthFactor: 1.2,
      },
    });

    const { container, getByRole, getByText } = renderOpenForm({
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );

    enterFormValues({
      container,
      dsaAmountTokens: '1',
      shortAmountTokens: '0.1',
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(getByText(en.operationForm.acknowledgements.riskyOperation.tooltip)).toBeInTheDocument();

    const acknowledgementCheckbox = getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(acknowledgementCheckbox);

    await waitFor(() => expect(acknowledgementCheckbox).toBeChecked());
  });

  it('requires acknowledgement in the high price impact case before submit can be enabled', async () => {
    setReadyState({
      swapQuote: getSwapQuote({
        priceImpactPercentage: 3,
      }),
      simulatedPool: {
        ...poolData[0],
        userHealthFactor: 2,
      },
    });

    const { container, getByRole, getByText } = renderOpenForm({
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );

    enterFormValues({
      container,
      dsaAmountTokens: '1',
      shortAmountTokens: '0.1',
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(
      getByText(
        en.operationForm.acknowledgements.highPriceImpact.tooltip.replace(
          '{{priceImpactPercentage}}',
          '3',
        ),
      ),
    ).toBeInTheDocument();

    const acknowledgementCheckbox = getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(acknowledgementCheckbox);

    await waitFor(() => expect(acknowledgementCheckbox).toBeChecked());
  });

  it('submits open position request with transformed values when form is valid', async () => {
    const swapQuote = getSwapQuote();
    setReadyState({ swapQuote });

    const { container, getByText } = renderOpenForm({ accountAddress: fakeAccountAddress });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );

    enterFormValues({
      container,
      dsaAmountTokens: '1',
      shortAmountTokens: '0.1',
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockOpenYieldPlusPosition).toHaveBeenCalledTimes(1));

    expect(mockOpenYieldPlusPosition).toHaveBeenCalledWith({
      longVTokenAddress: longAsset.vToken.address,
      shortVTokenAddress: shortAsset.vToken.address,
      dsaIndex: 0,
      initialPrincipalMantissa: 1000000000000000000n,
      leverageFactor: 2,
      shortAmountMantissa: 100000000000000000n,
      minLongAmountMantissa: swapQuote.minimumToTokenAmountReceivedMantissa,
      swapQuote,
    });
  });

  it('clamps short amount to the maximum borrowable amount', async () => {
    const { container, getByText } = renderOpenForm({ accountAddress: fakeAccountAddress });

    await waitFor(() =>
      expect(getByText(en.yieldPlus.operationForm.openForm.submitButtonLabel)).toBeInTheDocument(),
    );

    const { dsaAmountInput, shortAmountInput } = getFormInputs(container);

    fireEvent.change(dsaAmountInput, {
      target: { value: '1' },
    });

    fireEvent.change(shortAmountInput, {
      target: { value: '9999' },
    });

    await waitFor(() =>
      expect(new BigNumber(shortAmountInput.value).isLessThan(new BigNumber(9999))).toBe(true),
    );
  });
});
