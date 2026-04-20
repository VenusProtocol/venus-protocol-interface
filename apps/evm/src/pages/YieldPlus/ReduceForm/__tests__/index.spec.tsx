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
  useGetSwapQuote,
  useReduceYieldPlusPositionWithLoss,
  useReduceYieldPlusPositionWithProfit,
} from 'clients/api';
import { FULL_REPAYMENT_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { ApproximateOutSwapQuote, ExactInSwapQuote, Pool, SwapQuote } from 'types';
import { convertTokensToMantissa } from 'utilities';

import { ReduceForm } from '..';

vi.mock('hooks/useGetUserSlippageTolerance');

const position = yieldPlusPositions[0];

const longToken = position.longAsset.vToken.underlyingToken;
const shortToken = position.shortAsset.vToken.underlyingToken;
const dsaToken = position.dsaAsset.vToken.underlyingToken;

const bufferedFactor = new BigNumber(1).plus(FULL_REPAYMENT_BUFFER_PERCENTAGE);
const smallestLongAmountTokens = new BigNumber(1).shiftedBy(-longToken.decimals);
const smallestShortAmountTokens = new BigNumber(1).shiftedBy(-shortToken.decimals);
const validShortAmountTokens = BigNumber.min(
  position.shortBalanceTokens,
  position.shortAsset.cashTokens,
)
  .div(2)
  .dp(shortToken.decimals, BigNumber.ROUND_DOWN);

type Scenario = 'profit' | 'loss' | 'noPnl';

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

const calculateShortAmountTokens = (longAmountTokens: BigNumber) =>
  position.shortBalanceTokens
    .multipliedBy(longAmountTokens.div(position.longBalanceTokens))
    .dp(shortToken.decimals, BigNumber.ROUND_DOWN);

const makeCloseablePosition = () => ({
  ...position,
  pool: {
    ...position.pool,
    assets: position.pool.assets.map(asset => {
      const hasMatchingAsset =
        asset.vToken.address === position.dsaAsset.vToken.address ||
        asset.vToken.address === position.longAsset.vToken.address ||
        asset.vToken.address === position.shortAsset.vToken.address;

      return hasMatchingAsset
        ? {
            ...asset,
            cashTokens: new BigNumber(1000000),
          }
        : asset;
    }),
  },
  dsaAsset: {
    ...position.dsaAsset,
    cashTokens: new BigNumber(1000000),
  },
  longAsset: {
    ...position.longAsset,
    cashTokens: new BigNumber(1000000),
  },
  shortAsset: {
    ...position.shortAsset,
    cashTokens: new BigNumber(1000000),
  },
});

const makeCloseablePositionWithEmptyShortBalance = () => {
  const closeablePosition = makeCloseablePosition();

  return {
    ...closeablePosition,
    shortBalanceTokens: new BigNumber(0),
    shortBalanceCents: 0,
    netValueCents: closeablePosition.dsaBalanceCents + closeablePosition.longBalanceCents,
  };
};

const convertTokenAmountToMantissa = (value: BigNumber, token: ExactInSwapQuote['fromToken']) =>
  BigInt(
    convertTokensToMantissa({
      value,
      token,
    }).toFixed(),
  );

const makeApproximateOutSwapQuote = ({
  fromToken = longToken,
  toToken = shortToken,
  fromTokenAmountTokens,
  expectedToTokenAmountTokens = new BigNumber(1),
}: {
  fromToken?: ApproximateOutSwapQuote['fromToken'];
  toToken?: ApproximateOutSwapQuote['toToken'];
  fromTokenAmountTokens: BigNumber;
  expectedToTokenAmountTokens?: BigNumber;
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

const mockUseGetContractAddress = useGetContractAddress as Mock;
const mockUseGetUserSlippageTolerance = useGetUserSlippageTolerance as Mock;
const mockUseGetProportionalCloseTolerancePercentage =
  useGetProportionalCloseTolerancePercentage as Mock;
const mockUseGetSimulatedPool = useGetSimulatedPool as Mock;
const mockUseGetSwapQuote = useGetSwapQuote as Mock;
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

describe('ReduceForm', () => {
  const setReadyState = ({
    scenario = 'profit',
    repayWithLossSwapQuoteError,
  }: {
    scenario?: Scenario;
    repayWithLossSwapQuoteError?: { code: string };
  } = {}) => {
    mockUseGetContractAddress.mockImplementation(({ name }: { name: string }) => ({
      address: `0xfake${name}ContractAddress`,
    }));

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
        pool,
      },
      isLoading: false,
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

    mockUseGetSwapQuote.mockImplementation(
      ({
        fromToken,
        toToken,
        direction,
        fromTokenAmountTokens,
        minToTokenAmountTokens,
      }: {
        fromToken: SwapQuote['fromToken'];
        toToken: SwapQuote['toToken'];
        direction: SwapQuote['direction'];
        fromTokenAmountTokens?: BigNumber;
        minToTokenAmountTokens?: BigNumber;
      }) => {
        const emptyResponse = {
          data: undefined,
          error: undefined,
          isLoading: false,
        };

        if (
          direction === 'approximate-out' &&
          fromToken.address === longToken.address &&
          toToken.address === shortToken.address
        ) {
          const bufferedShortAmountTokens = new BigNumber(minToTokenAmountTokens || 0);

          if (bufferedShortAmountTokens.isZero()) {
            return emptyResponse;
          }

          const shortAmountTokens = bufferedShortAmountTokens.div(bufferedFactor);
          const longAmountTokens = calculateLongAmountTokens(shortAmountTokens);
          const fromTokenAmountTokens =
            scenario === 'profit'
              ? longAmountTokens.div(2)
              : scenario === 'noPnl'
                ? longAmountTokens
                : longAmountTokens.plus(smallestLongAmountTokens);

          return {
            data: {
              swapQuote: makeApproximateOutSwapQuote({
                fromToken: longToken,
                toToken: shortToken,
                fromTokenAmountTokens,
                expectedToTokenAmountTokens: shortAmountTokens,
              }),
            },
            error: undefined,
            isLoading: false,
          };
        }

        if (
          direction === 'exact-in' &&
          fromToken.address === longToken.address &&
          toToken.address === shortToken.address
        ) {
          const longAmountTokens = new BigNumber(fromTokenAmountTokens || 0);

          if (longAmountTokens.isZero()) {
            return emptyResponse;
          }

          if (repayWithLossSwapQuoteError) {
            return {
              data: undefined,
              error: repayWithLossSwapQuoteError,
              isLoading: false,
            };
          }

          if (scenario === 'noPnl') {
            const minimumToTokenAmountTokens =
              calculateShortAmountTokens(longAmountTokens).plus(smallestShortAmountTokens);

            return {
              data: {
                swapQuote: makeExactInSwapQuote({
                  fromToken: longToken,
                  toToken: shortToken,
                  fromTokenAmountTokens: longAmountTokens,
                  minimumToTokenAmountTokens,
                }),
              },
              error: undefined,
              isLoading: false,
            };
          }

          if (scenario !== 'loss') {
            return emptyResponse;
          }

          return {
            data: {
              swapQuote: makeExactInSwapQuote({
                fromToken: longToken,
                toToken: shortToken,
                fromTokenAmountTokens: longAmountTokens,
                minimumToTokenAmountTokens: new BigNumber(0),
              }),
            },
            error: undefined,
            isLoading: false,
          };
        }

        if (
          direction === 'exact-in' &&
          fromToken.address === longToken.address &&
          toToken.address === dsaToken.address
        ) {
          const longProfitAmountDeltaTokens = new BigNumber(fromTokenAmountTokens || 0);

          if (scenario !== 'profit' || longProfitAmountDeltaTokens.isZero()) {
            return emptyResponse;
          }

          return {
            data: {
              swapQuote: makeExactInSwapQuote({
                fromToken: longToken,
                toToken: dsaToken,
                fromTokenAmountTokens: longProfitAmountDeltaTokens,
                minimumToTokenAmountTokens: new BigNumber(1),
              }),
            },
            error: undefined,
            isLoading: false,
          };
        }

        if (
          direction === 'approximate-out' &&
          fromToken.address === dsaToken.address &&
          toToken.address === shortToken.address
        ) {
          const requiredShortAmountTokens = new BigNumber(minToTokenAmountTokens || 0);

          if (scenario !== 'loss' || requiredShortAmountTokens.isZero()) {
            return emptyResponse;
          }

          return {
            data: {
              swapQuote: makeApproximateOutSwapQuote({
                fromToken: dsaToken,
                toToken: shortToken,
                fromTokenAmountTokens: new BigNumber(1),
                expectedToTokenAmountTokens: requiredShortAmountTokens,
              }),
            },
            error: undefined,
            isLoading: false,
          };
        }

        return emptyResponse;
      },
    );
  };

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

  it('shows no-swap error when the repay quote lookup fails', async () => {
    setReadyState({
      scenario: 'loss',
      repayWithLossSwapQuoteError: {
        code: 'NO_SWAP_QUOTE_FOUND',
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
      target: { value: validShortAmountTokens.toFixed() },
    });

    await waitFor(() =>
      expect(getByText(en.operationForm.error.noSwapQuoteFound)).toBeInTheDocument(),
    );
  });

  it('submits reduce position with profit when form is valid', async () => {
    const shortAmountTokens = validShortAmountTokens.toFixed();
    const closeFractionPercentage = validShortAmountTokens
      .div(position.shortBalanceTokens)
      .multipliedBy(100)
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
      minimumToTokenAmountTokens: new BigNumber(1),
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
      ).not.toBeDisabled(),
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
    setReadyState({
      scenario: 'loss',
    });

    const shortAmountTokens = validShortAmountTokens.toFixed();
    const closeFractionPercentage = validShortAmountTokens
      .div(position.shortBalanceTokens)
      .multipliedBy(100)
      .toNumber();
    const longAmountTokens = calculateLongAmountTokens(validShortAmountTokens);
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: longAmountTokens,
      minimumToTokenAmountTokens: new BigNumber(0),
    });
    const lossSwapQuote = makeApproximateOutSwapQuote({
      fromToken: dsaToken,
      toToken: shortToken,
      fromTokenAmountTokens: new BigNumber(1),
      expectedToTokenAmountTokens: validShortAmountTokens.multipliedBy(bufferedFactor),
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
      ).not.toBeDisabled(),
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

  it('submits reduce position without pnl when the long amount fully repays the short amount', async () => {
    setReadyState({
      scenario: 'noPnl',
    });

    const shortAmountTokens = validShortAmountTokens.toFixed();
    const closeFractionPercentage = validShortAmountTokens
      .div(position.shortBalanceTokens)
      .multipliedBy(100)
      .toNumber();
    const longAmountTokens = calculateLongAmountTokens(validShortAmountTokens);
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: longAmountTokens,
      minimumToTokenAmountTokens: validShortAmountTokens.plus(smallestShortAmountTokens),
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
      ).not.toBeDisabled(),
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
    const closeablePosition = makeCloseablePosition();
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
      minimumToTokenAmountTokens: new BigNumber(1),
    });

    const { getByText } = renderComponent(
      <ReduceForm position={closeablePosition} closePosition />,
      {
        accountAddress: closeablePosition.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).not.toBeDisabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPositionWithProfit).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPositionWithProfit).toHaveBeenCalledWith({
      longVTokenAddress: closeablePosition.longAsset.vToken.address,
      shortVTokenAddress: closeablePosition.shortAsset.vToken.address,
      repaySwapQuote,
      profitSwapQuote,
    });
  });

  it('submits close position with profit when the short balance is already zero', async () => {
    const closeablePosition = makeCloseablePositionWithEmptyShortBalance();
    const profitSwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: dsaToken,
      fromTokenAmountTokens: closeablePosition.longBalanceTokens,
      minimumToTokenAmountTokens: new BigNumber(1),
    });

    const { getByText } = renderComponent(
      <ReduceForm position={closeablePosition} closePosition />,
      {
        accountAddress: closeablePosition.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).not.toBeDisabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPositionWithProfit).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPositionWithProfit).toHaveBeenCalledWith({
      longVTokenAddress: closeablePosition.longAsset.vToken.address,
      shortVTokenAddress: closeablePosition.shortAsset.vToken.address,
      profitSwapQuote,
    });
  });

  it('submits close position with loss when form is valid', async () => {
    setReadyState({
      scenario: 'loss',
    });

    const closeablePosition = makeCloseablePosition();
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: position.longBalanceTokens,
      minimumToTokenAmountTokens: new BigNumber(0),
    });
    const lossSwapQuote = makeApproximateOutSwapQuote({
      fromToken: dsaToken,
      toToken: shortToken,
      fromTokenAmountTokens: new BigNumber(1),
      expectedToTokenAmountTokens: position.shortBalanceTokens.multipliedBy(bufferedFactor),
    });

    const { getByText } = renderComponent(
      <ReduceForm position={closeablePosition} closePosition />,
      {
        accountAddress: closeablePosition.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).not.toBeDisabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPositionWithLoss).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPositionWithLoss).toHaveBeenCalledWith({
      longVTokenAddress: closeablePosition.longAsset.vToken.address,
      shortVTokenAddress: closeablePosition.shortAsset.vToken.address,
      repaySwapQuote,
      lossSwapQuote,
    });
  });

  it('submits close position without pnl when the long amount fully repays the short amount', async () => {
    setReadyState({
      scenario: 'noPnl',
    });

    const closeablePosition = makeCloseablePosition();
    const repaySwapQuote = makeExactInSwapQuote({
      fromToken: longToken,
      toToken: shortToken,
      fromTokenAmountTokens: closeablePosition.longBalanceTokens,
      minimumToTokenAmountTokens:
        closeablePosition.shortBalanceTokens.plus(smallestShortAmountTokens),
    });

    const { getByText } = renderComponent(
      <ReduceForm position={closeablePosition} closePosition />,
      {
        accountAddress: closeablePosition.positionAccountAddress,
      },
    );

    await waitFor(() =>
      expect(
        getByText(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close),
      ).not.toBeDisabled(),
    );

    fireEvent.click(getSubmitButton(en.yieldPlus.operationForm.reduceForm.submitButtonLabel.close));

    await waitFor(() => expect(mockCloseYieldPlusPositionWithLoss).toHaveBeenCalledTimes(1));

    expect(mockCloseYieldPlusPositionWithLoss).toHaveBeenCalledWith({
      longVTokenAddress: closeablePosition.longAsset.vToken.address,
      shortVTokenAddress: closeablePosition.shortAsset.vToken.address,
      repaySwapQuote,
    });
  });
});
