import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { approximateOutSwapQuote, exactInSwapQuote } from '__mocks__/models/swap';
import { yieldPlusPositions } from '__mocks__/models/yieldPlus';
import {
  useCloseYieldPlusPosition,
  useCloseYieldPlusPositionWithLoss,
  useCloseYieldPlusPositionWithProfit,
  useGetProportionalCloseTolerancePercentage,
  useGetSimulatedPool,
  useGetYieldPlusReduceSwapQuotes,
  useReduceYieldPlusPositionWithLoss,
  useReduceYieldPlusPositionWithProfit,
} from 'clients/api';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { VError } from 'libs/errors';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { ApproximateOutSwapQuote, ExactInSwapQuote, Pool, SwapQuoteError } from 'types';
import { convertTokensToMantissa } from 'utilities';
import { ReduceForm } from '..';

vi.mock('hooks/useGetUserSlippageTolerance');

const basePosition = yieldPlusPositions[0];

const makeCloseablePosition = () => ({
  ...basePosition,
  pool: {
    ...basePosition.pool,
    assets: basePosition.pool.assets.map(asset => {
      const isPositionAsset = [
        basePosition.dsaAsset.vToken.address,
        basePosition.longAsset.vToken.address,
        basePosition.shortAsset.vToken.address,
      ].includes(asset.vToken.address);

      return isPositionAsset
        ? {
            ...asset,
            cashTokens: new BigNumber(1_000_000),
          }
        : asset;
    }),
  },
  dsaAsset: {
    ...basePosition.dsaAsset,
    cashTokens: new BigNumber(1_000_000),
  },
  longAsset: {
    ...basePosition.longAsset,
    cashTokens: new BigNumber(1_000_000),
  },
  shortAsset: {
    ...basePosition.shortAsset,
    cashTokens: new BigNumber(1_000_000),
  },
});

const position = makeCloseablePosition();
const longToken = position.longAsset.vToken.underlyingToken;
const shortToken = position.shortAsset.vToken.underlyingToken;
const dsaToken = position.dsaAsset.vToken.underlyingToken;

const validShortAmountTokens = position.shortBalanceTokens
  .div(2)
  .dp(shortToken.decimals, BigNumber.ROUND_DOWN);

const getShortAmountInput = (container: HTMLElement) => {
  const input = container.querySelector(
    'input[name="shortAmountTokens"]',
  ) as HTMLInputElement | null;

  if (!input) {
    throw new Error('Expected short amount input to be rendered');
  }

  return input;
};

const getLongAmountInput = (container: HTMLElement) => {
  const input = container.querySelector(
    'input[name="longAmountTokens"]',
  ) as HTMLInputElement | null;

  if (!input) {
    throw new Error('Expected long amount input to be rendered');
  }

  return input;
};

const getSubmitButton = (submitButtonLabel: string) =>
  screen.getByRole('button', { name: submitButtonLabel });

const calculateLongAmountTokens = (shortAmountTokens: BigNumber) =>
  position.longBalanceTokens
    .multipliedBy(shortAmountTokens.div(position.shortBalanceTokens))
    .dp(longToken.decimals, BigNumber.ROUND_DOWN);

const convertTokenAmountToMantissa = (value: BigNumber, token: ExactInSwapQuote['fromToken']) =>
  BigInt(
    convertTokensToMantissa({
      value,
      token,
    }).toFixed(),
  );

const makeApproximateOutSwapQuote = ({
  fromToken,
  toToken,
  fromTokenAmountTokens,
  expectedToTokenAmountTokens,
}: {
  fromToken: ApproximateOutSwapQuote['fromToken'];
  toToken: ApproximateOutSwapQuote['toToken'];
  fromTokenAmountTokens: BigNumber;
  expectedToTokenAmountTokens: BigNumber;
}): ApproximateOutSwapQuote => ({
  ...approximateOutSwapQuote,
  fromToken,
  toToken,
  priceImpactPercentage: 0.1,
  fromTokenAmountSoldMantissa: convertTokenAmountToMantissa(fromTokenAmountTokens, fromToken),
  expectedToTokenAmountReceivedMantissa: convertTokenAmountToMantissa(
    expectedToTokenAmountTokens,
    toToken,
  ),
  minimumToTokenAmountReceivedMantissa: convertTokenAmountToMantissa(
    expectedToTokenAmountTokens,
    toToken,
  ),
});

const makeExactInSwapQuote = ({
  fromToken,
  toToken,
  fromTokenAmountTokens,
  minimumToTokenAmountTokens,
  expectedToTokenAmountTokens = minimumToTokenAmountTokens,
}: {
  fromToken: ExactInSwapQuote['fromToken'];
  toToken: ExactInSwapQuote['toToken'];
  fromTokenAmountTokens: BigNumber;
  minimumToTokenAmountTokens: BigNumber;
  expectedToTokenAmountTokens?: BigNumber;
}): ExactInSwapQuote => ({
  ...exactInSwapQuote,
  fromToken,
  toToken,
  priceImpactPercentage: 0.1,
  fromTokenAmountSoldMantissa: convertTokenAmountToMantissa(fromTokenAmountTokens, fromToken),
  expectedToTokenAmountReceivedMantissa: convertTokenAmountToMantissa(
    expectedToTokenAmountTokens,
    toToken,
  ),
  minimumToTokenAmountReceivedMantissa: convertTokenAmountToMantissa(
    minimumToTokenAmountTokens,
    toToken,
  ),
});

const mockUseGetProportionalCloseTolerancePercentage =
  useGetProportionalCloseTolerancePercentage as Mock;
const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
const mockUseGetYieldPlusReduceSwapQuotes = useGetYieldPlusReduceSwapQuotes as Mock;
const mockUseGetUserSlippageTolerance = useGetUserSlippageTolerance as Mock;
const mockUseReduceYieldPlusPositionWithProfit = useReduceYieldPlusPositionWithProfit as Mock;
const mockUseReduceYieldPlusPositionWithLoss = useReduceYieldPlusPositionWithLoss as Mock;
const mockUseCloseYieldPlusPosition = useCloseYieldPlusPosition as Mock;
const mockUseCloseYieldPlusPositionWithProfit = useCloseYieldPlusPositionWithProfit as Mock;
const mockUseCloseYieldPlusPositionWithLoss = useCloseYieldPlusPositionWithLoss as Mock;

const mockReduceYieldPlusPositionWithProfit = vi.fn();
const mockReduceYieldPlusPositionWithLoss = vi.fn();
const mockCloseYieldPlusPosition = vi.fn();
const mockCloseYieldPlusPositionWithProfit = vi.fn();
const mockCloseYieldPlusPositionWithLoss = vi.fn();

type ReduceSwapQuotesData = {
  pnlDsaTokens: BigNumber;
  repayWithProfitSwapQuote?: ReturnType<typeof makeApproximateOutSwapQuote>;
  repayWithLossSwapQuote?: ReturnType<typeof makeExactInSwapQuote>;
  profitSwapQuote?: ReturnType<typeof makeExactInSwapQuote>;
  lossSwapQuote?: ReturnType<typeof makeApproximateOutSwapQuote>;
};

const setReadyState = ({
  reduceSwapQuotesData,
  reduceSwapQuotesError,
  isLoading = false,
  simulatedPool = position.pool,
}: {
  reduceSwapQuotesData?: ReduceSwapQuotesData;
  reduceSwapQuotesError?: SwapQuoteError;
  isLoading?: boolean;
  simulatedPool?: Pool;
} = {}) => {
  mockUseGetUserSlippageTolerance.mockReturnValue({
    userSlippageTolerancePercentage: 0.5,
  });

  mockUseGetProportionalCloseTolerancePercentage.mockReturnValue({
    data: {
      proportionalCloseTolerancePercentage: 2,
    },
  });

  mockUseGetSimulatedPool.mockImplementation(({ pool }: { pool: Pool }) => ({
    data: {
      pool: simulatedPool || pool,
    },
    isLoading: false,
  }));

  mockUseGetYieldPlusReduceSwapQuotes.mockImplementation(() => ({
    data: reduceSwapQuotesData,
    error: reduceSwapQuotesError,
    isLoading,
  }));

  mockUseReduceYieldPlusPositionWithProfit.mockImplementation(() => ({
    mutateAsync: mockReduceYieldPlusPositionWithProfit,
    isPending: false,
  }));

  mockUseReduceYieldPlusPositionWithLoss.mockImplementation(() => ({
    mutateAsync: mockReduceYieldPlusPositionWithLoss,
    isPending: false,
  }));

  mockUseCloseYieldPlusPosition.mockImplementation(() => ({
    mutateAsync: mockCloseYieldPlusPosition,
    isPending: false,
  }));

  mockUseCloseYieldPlusPositionWithProfit.mockImplementation(() => ({
    mutateAsync: mockCloseYieldPlusPositionWithProfit,
    isPending: false,
  }));

  mockUseCloseYieldPlusPositionWithLoss.mockImplementation(() => ({
    mutateAsync: mockCloseYieldPlusPositionWithLoss,
    isPending: false,
  }));
};

describe('ReduceForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setReadyState();
  });

  it('renders form when data is ready', async () => {
    const { getByText, getAllByText } = renderComponent(<ReduceForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeInTheDocument(),
    );

    expect(getAllByText(en.yieldPlus.operationForm.openForm.longFieldLabel).length).toBeGreaterThan(
      0,
    );
    expect(
      getAllByText(en.yieldPlus.operationForm.openForm.shortFieldLabel).length,
    ).toBeGreaterThan(0);
  });

  it('requires wallet connection to interact with form fields', async () => {
    const { container, getByText } = renderComponent(<ReduceForm position={position} />);

    await waitFor(() => expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument());

    expect(getShortAmountInput(container)).toBeDisabled();
  });

  it('updates the long amount when the short amount changes', async () => {
    const { container, getByText } = renderComponent(<ReduceForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeInTheDocument(),
    );

    const shortAmountInput = getShortAmountInput(container);
    const longAmountInput = getLongAmountInput(container);
    const shortAmountTokens = validShortAmountTokens.toFixed();
    const expectedLongAmountTokens = calculateLongAmountTokens(validShortAmountTokens).toFixed();

    fireEvent.change(shortAmountInput, {
      target: { value: shortAmountTokens },
    });

    await waitFor(() => expect(shortAmountInput.value).toBe(shortAmountTokens));
    await waitFor(() => expect(longAmountInput.value).toBe(expectedLongAmountTokens));
  });

  it('shows no-swap error when the combined quote lookup fails', async () => {
    setReadyState({
      reduceSwapQuotesError: new VError({
        type: 'swapQuote',
        code: 'noSwapQuoteFound',
      }),
    });

    const { container, getByText } = renderComponent(<ReduceForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeInTheDocument(),
    );

    fireEvent.change(getShortAmountInput(container), {
      target: { value: validShortAmountTokens.toFixed() },
    });

    await waitFor(() =>
      expect(screen.getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );
  });

  it('submits reduce position with profit when form is valid', async () => {
    const shortAmountTokens = validShortAmountTokens.toFixed();
    const closeFractionPercentage = validShortAmountTokens
      .div(position.shortBalanceTokens)
      .multipliedBy(100)
      .dp(2)
      .toNumber();
    const longAmountTokens = calculateLongAmountTokens(validShortAmountTokens);
    const repaySwapQuote = makeApproximateOutSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: longAmountTokens.div(2),
      expectedToTokenAmountTokens: validShortAmountTokens,
    });
    const profitSwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: dsaToken,
      fromTokenAmountTokens: longAmountTokens.minus(longAmountTokens.div(2)),
      minimumToTokenAmountTokens: new BigNumber(3),
    });

    setReadyState({
      reduceSwapQuotesData: {
        pnlDsaTokens: new BigNumber(3),
        repayWithProfitSwapQuote: repaySwapQuote,
        profitSwapQuote,
      },
    });

    const { container, getByText } = renderComponent(<ReduceForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeInTheDocument(),
    );

    fireEvent.change(getShortAmountInput(container), {
      target: { value: shortAmountTokens },
    });

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeEnabled(),
    );

    fireEvent.click(
      getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
    );

    await waitFor(() => expect(mockReduceYieldPlusPositionWithProfit).toHaveBeenCalledTimes(1));

    expect(mockReduceYieldPlusPositionWithProfit).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      closeFractionPercentage,
      repaySwapQuote,
      profitSwapQuote,
    });
  });

  it('submits reduce position with loss when form is valid', async () => {
    const shortAmountTokens = validShortAmountTokens.toFixed();
    const closeFractionPercentage = validShortAmountTokens
      .div(position.shortBalanceTokens)
      .multipliedBy(100)
      .dp(2)
      .toNumber();
    const longAmountTokens = calculateLongAmountTokens(validShortAmountTokens);
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: longAmountTokens,
      minimumToTokenAmountTokens: new BigNumber(1),
    });
    const lossSwapQuote = makeApproximateOutSwapQuote({
      fromToken: dsaToken,
      toToken: shortToken,
      fromTokenAmountTokens: new BigNumber(2),
      expectedToTokenAmountTokens: new BigNumber(1),
    });

    setReadyState({
      reduceSwapQuotesData: {
        pnlDsaTokens: new BigNumber(-2),
        repayWithLossSwapQuote: repaySwapQuote,
        lossSwapQuote,
      },
    });

    const { container, getByText } = renderComponent(<ReduceForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeInTheDocument(),
    );

    fireEvent.change(getShortAmountInput(container), {
      target: { value: shortAmountTokens },
    });

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeEnabled(),
    );

    fireEvent.click(
      getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
    );

    await waitFor(() => expect(mockReduceYieldPlusPositionWithLoss).toHaveBeenCalledTimes(1));

    expect(mockReduceYieldPlusPositionWithLoss).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      closeFractionPercentage,
      repaySwapQuote,
      lossSwapQuote,
    });
  });

  it('submits reduce position without pnl when the repay quote fully covers the short amount', async () => {
    const shortAmountTokens = validShortAmountTokens.toFixed();
    const closeFractionPercentage = validShortAmountTokens
      .div(position.shortBalanceTokens)
      .multipliedBy(100)
      .dp(2)
      .toNumber();
    const longAmountTokens = calculateLongAmountTokens(validShortAmountTokens);
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: longAmountTokens,
      minimumToTokenAmountTokens: validShortAmountTokens,
    });

    setReadyState({
      reduceSwapQuotesData: {
        pnlDsaTokens: new BigNumber(0),
        repayWithLossSwapQuote: repaySwapQuote,
      },
    });

    const { container, getByText } = renderComponent(<ReduceForm position={position} />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeInTheDocument(),
    );

    fireEvent.change(getShortAmountInput(container), {
      target: { value: shortAmountTokens },
    });

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
      ).toBeEnabled(),
    );

    fireEvent.click(
      getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce),
    );

    await waitFor(() => expect(mockReduceYieldPlusPositionWithLoss).toHaveBeenCalledTimes(1));

    expect(mockReduceYieldPlusPositionWithLoss).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      closeFractionPercentage,
      repaySwapQuote,
    });
  });

  it('submits close position with profit when form is valid', async () => {
    const closeFractionPercentage = new BigNumber(100).toNumber();
    const repaySwapQuote = makeApproximateOutSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: position.longBalanceTokens.div(2),
      expectedToTokenAmountTokens: position.shortBalanceTokens,
    });
    const profitSwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: dsaToken,
      fromTokenAmountTokens: position.longBalanceTokens.minus(position.longBalanceTokens.div(2)),
      minimumToTokenAmountTokens: new BigNumber(3),
    });

    setReadyState({
      reduceSwapQuotesData: {
        pnlDsaTokens: new BigNumber(3),
        repayWithProfitSwapQuote: repaySwapQuote,
        profitSwapQuote,
      },
    });

    const { getByText } = renderComponent(<ReduceForm position={position} closePosition />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeEnabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPositionWithProfit).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPositionWithProfit).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      repaySwapQuote,
      profitSwapQuote,
    });
    expect(closeFractionPercentage).toBe(100);
  });

  it('submits close position with loss when form is valid', async () => {
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: position.longBalanceTokens,
      minimumToTokenAmountTokens: new BigNumber(1),
    });
    const lossSwapQuote = makeApproximateOutSwapQuote({
      fromToken: dsaToken,
      toToken: shortToken,
      fromTokenAmountTokens: new BigNumber(2),
      expectedToTokenAmountTokens: new BigNumber(1),
    });

    setReadyState({
      reduceSwapQuotesData: {
        pnlDsaTokens: new BigNumber(-2),
        repayWithLossSwapQuote: repaySwapQuote,
        lossSwapQuote,
      },
    });

    const { getByText } = renderComponent(<ReduceForm position={position} closePosition />, {
      accountAddress: position.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeEnabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPositionWithLoss).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPositionWithLoss).toHaveBeenCalledWith({
      longVTokenAddress: position.longAsset.vToken.address,
      shortVTokenAddress: position.shortAsset.vToken.address,
      repaySwapQuote,
      lossSwapQuote,
    });
  });

  it('closes an empty position without requesting swap quotes', async () => {
    const emptyPosition = {
      ...position,
      longBalanceTokens: new BigNumber(0),
      longBalanceCents: 0,
      shortBalanceTokens: new BigNumber(0),
      shortBalanceCents: 0,
      netValueCents: position.dsaBalanceCents,
    };

    setReadyState();

    const { getByText } = renderComponent(<ReduceForm position={emptyPosition} closePosition />, {
      accountAddress: emptyPosition.positionAccountAddress,
    });

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeEnabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPosition).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPosition).toHaveBeenCalledWith({
      longVTokenAddress: emptyPosition.longAsset.vToken.address,
      shortVTokenAddress: emptyPosition.shortAsset.vToken.address,
    });
    expect(mockUseGetYieldPlusReduceSwapQuotes).toHaveBeenCalled();
  });
});
