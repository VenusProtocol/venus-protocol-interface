import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { exactInSwapQuote } from '__mocks__/models/swap';
import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import {
  useGetProportionalCloseTolerancePercentage,
  useGetSimulatedPool,
  useGetSwapQuote,
  useIncreaseYieldPlusPosition,
} from 'clients/api';
import { VError } from 'libs/errors';
import { en } from 'libs/translations';
import { calculateMaxBorrowShortTokens } from 'pages/YieldPlus/OperationForm/calculateMaxBorrowShortTokens';
import { renderComponent } from 'testUtils/render';
import type { ExactInSwapQuote, Pool, SwapQuote } from 'types';
import { convertTokensToMantissa } from 'utilities';
import { IncreaseForm } from '..';

const position = yieldPlusPositions[0];

if (!position) {
  throw new Error('Expected Yield+ mock positions');
}

const longAsset = position.longAsset;
const shortAsset = position.shortAsset;

const defaultSwapQuote: ExactInSwapQuote = {
  ...exactInSwapQuote,
  fromToken: shortAsset.vToken.underlyingToken,
  toToken: longAsset.vToken.underlyingToken,
  priceImpactPercentage: 0.1,
};

describe('IncreaseForm', () => {
  const mockUseGetProportionalCloseTolerancePercentage =
    useGetProportionalCloseTolerancePercentage as Mock;
  const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
  const mockUseGetSwapQuote = useGetSwapQuote as Mock;
  const mockUseIncreaseYieldPlusPosition = useIncreaseYieldPlusPosition as Mock;
  const mockIncreaseYieldPlusPosition = vi.fn();

  const setReadyState = ({
    simulatedPool = position.pool,
    swapQuote = defaultSwapQuote,
    swapQuoteError,
  }: {
    simulatedPool?: Pool;
    swapQuote?: SwapQuote;
    swapQuoteError?: Error;
  } = {}) => {
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

    mockUseIncreaseYieldPlusPosition.mockImplementation(() => ({
      mutateAsync: mockIncreaseYieldPlusPosition,
      isPending: false,
    }));
  };

  beforeEach(() => {
    setReadyState();
  });

  it('renders form when data is ready', async () => {
    const { container, getByText, getAllByText } = renderComponent(
      <IncreaseForm position={position} />,
      {
        accountAddress: position.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.increaseForm.submitButtonLabel),
      ).toBeInTheDocument(),
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
    const { container, getByText } = renderComponent(<IncreaseForm position={position} />);

    await waitFor(() => expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument());

    const shortAmountInput = container.querySelector(
      'input[name="shortAmountTokens"]',
    ) as HTMLInputElement;

    if (!shortAmountInput) {
      throw new Error('Expected short amount input to be rendered');
    }

    expect(shortAmountInput).toBeDisabled();
  });

  it('shows no-swap error when quote lookup fails', async () => {
    setReadyState({
      swapQuote: undefined,
      swapQuoteError: new VError({
        type: 'swapQuote',
        code: 'noSwapQuoteFound',
      }),
    });

    const { container, getByText } = renderComponent(<IncreaseForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.increaseForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const shortAmountInput = container.querySelector(
      'input[name="shortAmountTokens"]',
    ) as HTMLInputElement;

    if (!shortAmountInput) {
      throw new Error('Expected short amount input to be rendered');
    }

    fireEvent.change(shortAmountInput, {
      target: { value: '0.1' },
    });

    await waitFor(() =>
      expect(getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );
  });

  it('submits scale position request with transformed values when form is valid', async () => {
    const swapQuote = defaultSwapQuote;
    setReadyState({ swapQuote });

    const expectedShortAmountMantissa = BigInt(
      convertTokensToMantissa({
        value: new BigNumber('0.1'),
        token: shortAsset.vToken.underlyingToken,
      }).toFixed(),
    );

    const { container, getByText } = renderComponent(<IncreaseForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.increaseForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const shortAmountInput = container.querySelector(
      'input[name="shortAmountTokens"]',
    ) as HTMLInputElement;

    if (!shortAmountInput) {
      throw new Error('Expected short amount input to be rendered');
    }

    fireEvent.change(shortAmountInput, {
      target: { value: '0.1' },
    });

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockIncreaseYieldPlusPosition).toHaveBeenCalledTimes(1));

    expect(mockIncreaseYieldPlusPosition).toHaveBeenCalledWith({
      longVTokenAddress: longAsset.vToken.address,
      shortVTokenAddress: shortAsset.vToken.address,
      additionalPrincipalMantissa: 0n,
      shortAmountMantissa: expectedShortAmountMantissa,
      minLongAmountMantissa: swapQuote.minimumToTokenAmountReceivedMantissa,
      swapQuote,
    });

    await waitFor(() => {
      expect(shortAmountInput).toHaveValue(null);
    });
  });

  it('clamps short amount to the maximum borrowable amount', async () => {
    const { container, getByText } = renderComponent(<IncreaseForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.increaseForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const shortAmountInput = container.querySelector(
      'input[name="shortAmountTokens"]',
    ) as HTMLInputElement;

    if (!shortAmountInput) {
      throw new Error('Expected short amount input to be rendered');
    }

    fireEvent.change(shortAmountInput, {
      target: { value: '9999' },
    });

    await waitFor(() =>
      expect(new BigNumber(shortAmountInput.value).isLessThan(new BigNumber(9999))).toBe(true),
    );
  });

  it('clamps short amount when value is one unit above computed limit', async () => {
    const { container, getByText } = renderComponent(<IncreaseForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.increaseForm.submitButtonLabel),
      ).toBeInTheDocument(),
    );

    const shortAmountInput = container.querySelector(
      'input[name="shortAmountTokens"]',
    ) as HTMLInputElement;

    if (!shortAmountInput) {
      throw new Error('Expected short amount input to be rendered');
    }

    const maxShortCapacityTokens = calculateMaxBorrowShortTokens({
      dsaAmountTokens: position.dsaBalanceTokens,
      dsaTokenPriceCents: position.dsaAsset.tokenPriceCents,
      dsaTokenCollateralFactor: position.dsaAsset.collateralFactor,
      longAmountTokens: position.longBalanceTokens,
      longTokenPriceCents: position.longAsset.tokenPriceCents,
      longTokenCollateralFactor: position.longAsset.collateralFactor,
      shortAmountTokens: position.shortBalanceTokens,
      shortTokenPriceCents: position.shortAsset.tokenPriceCents,
      leverageFactor: position.leverageFactor,
      shortTokenDecimals: position.shortAsset.vToken.underlyingToken.decimals,
      proportionalCloseTolerancePercentage: 0.1,
    });

    const smallestShortTokenUnit = new BigNumber(10).pow(
      -position.shortAsset.vToken.underlyingToken.decimals,
    );
    const aboveLimit = maxShortCapacityTokens.plus(smallestShortTokenUnit);

    fireEvent.change(shortAmountInput, {
      target: { value: aboveLimit.toFixed(position.shortAsset.vToken.underlyingToken.decimals) },
    });

    await waitFor(() =>
      expect(shortAmountInput.value).toBe(
        maxShortCapacityTokens.toFixed(position.shortAsset.vToken.underlyingToken.decimals),
      ),
    );
  });
});
