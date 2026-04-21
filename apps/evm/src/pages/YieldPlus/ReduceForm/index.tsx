import BigNumber from 'bignumber.js';
import { useEffect, useMemo } from 'react';

import { keepPreviousData } from '@tanstack/react-query';
import {
  useCloseYieldPlusPosition,
  useCloseYieldPlusPositionWithLoss,
  useCloseYieldPlusPositionWithProfit,
  useGetSwapQuote,
  useReduceYieldPlusPositionWithLoss,
  useReduceYieldPlusPositionWithProfit,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { FULL_REPAYMENT_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import { PositionForm } from 'pages/YieldPlus/PositionForm';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
import { convertMantissaToTokens, getSwapToTokenAmount } from 'utilities';
import { store } from '../ClosePositionModal/store';

export interface ReduceFormProps {
  position: YieldPlusPosition;
  closePosition?: boolean;
}

export const ReduceForm: React.FC<ReduceFormProps> = ({ position, closePosition = false }) => {
  const { t } = useTranslation();
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();
  const { formValues, setFormValues } = usePositionForm({ position });

  const hideClosePositionModal = store.use.hideModal();

  const { mutateAsync: reducePositionWithProfit, isPending: isReducingPositionWithProfit } =
    useReduceYieldPlusPositionWithProfit({
      waitForConfirmation: true,
    });

  const { mutateAsync: reducePositionWithLoss, isPending: isReducingPositionWithLoss } =
    useReduceYieldPlusPositionWithLoss({
      waitForConfirmation: true,
    });

  const { mutateAsync: closePositionWithProfit, isPending: isClosingPositionWithProfit } =
    useCloseYieldPlusPositionWithProfit({
      waitForConfirmation: true,
      onSuccess: hideClosePositionModal,
    });

  const { mutateAsync: closePositionWithLoss, isPending: isClosingPositionWithLoss } =
    useCloseYieldPlusPositionWithLoss({
      waitForConfirmation: true,
      onSuccess: hideClosePositionModal,
    });

  const { mutateAsync: closeEmptyPosition, isPending: isClosingEmptyPosition } =
    useCloseYieldPlusPosition({
      waitForConfirmation: true,
      onSuccess: hideClosePositionModal,
    });

  const longAmountTokens = new BigNumber(formValues.longAmountTokens || 0);

  const _debouncedShortAmountTokens = useDebounceValue(formValues.shortAmountTokens);
  const debouncedShortAmountTokens = useMemo(
    () => new BigNumber(_debouncedShortAmountTokens || 0),
    [_debouncedShortAmountTokens],
  );

  const reduceRatio = useMemo(() => {
    if (closePosition) {
      return new BigNumber(1);
    }

    if (position.shortBalanceTokens.isZero()) {
      return new BigNumber(0);
    }

    return debouncedShortAmountTokens.dividedBy(position.shortBalanceTokens);
  }, [debouncedShortAmountTokens, position.shortBalanceTokens, closePosition]);

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const sharedOptions = closePosition
    ? {
        placeholderData: keepPreviousData,
      }
    : {};

  // Repay (repay short using long) swap quote, in the case of a profit
  const {
    data: getRepayWithProfitSwapQuoteData,
    error: getRepayWithProfitSwapQuoteError,
    isLoading: isGetRepayWithProfitSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.longAsset.vToken.underlyingToken,
      toToken: position.shortAsset.vToken.underlyingToken,
      minToTokenAmountTokens:
        debouncedShortAmountTokens?.multipliedBy(
          // Buff amount to account from accrued interests while the transaction is being mined
          new BigNumber(1).plus(FULL_REPAYMENT_BUFFER_PERCENTAGE),
        ) || new BigNumber(0),
      direction: 'approximate-out',
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: !!leverageManagerContractAddress && !!debouncedShortAmountTokens.isGreaterThan(0),
      ...sharedOptions,
    },
  );
  const repayWithProfitSwapQuote = getRepayWithProfitSwapQuoteData?.swapQuote;

  const repayWithProfitSwapQuoteFromTokenAmountTokens =
    repayWithProfitSwapQuote?.direction === 'approximate-out'
      ? convertMantissaToTokens({
          value: repayWithProfitSwapQuote.fromTokenAmountSoldMantissa,
          token: repayWithProfitSwapQuote.fromToken,
        })
      : undefined;

  // If longProfitAmountDeltaTokens is positive, then it means there's a profit
  let longProfitAmountDeltaTokens: BigNumber | undefined;

  if (position.shortBalanceTokens.isEqualTo(0)) {
    // If the position has an empty short balance, then the leftover long is pure profit
    longProfitAmountDeltaTokens = longAmountTokens;
  } else {
    // Otherwise the profit is based on the amount of extra long tokens obtained after repaying the
    // short balance
    longProfitAmountDeltaTokens =
      repayWithProfitSwapQuoteFromTokenAmountTokens &&
      longAmountTokens.minus(repayWithProfitSwapQuoteFromTokenAmountTokens);
  }

  const isProfitable = !!longProfitAmountDeltaTokens?.isGreaterThan(0);

  // Repay (repay short using long) swap quote, in the case of a loss
  const {
    data: getRepayWithLossSwapQuoteData,
    error: getRepayWithLossSwapQuoteError,
    isLoading: isGetRepayWithLossSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.longAsset.vToken.underlyingToken,
      fromTokenAmountTokens: longAmountTokens,
      toToken: position.shortAsset.vToken.underlyingToken,
      direction: 'exact-in',
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: !!leverageManagerContractAddress && !!longAmountTokens.isGreaterThan(0),
      ...sharedOptions,
    },
  );
  const repayWithLossSwapQuote = getRepayWithLossSwapQuoteData?.swapQuote;

  const repayWithLossSwapQuoteMinToTokenAmountTokens =
    repayWithLossSwapQuote?.direction === 'exact-in'
      ? convertMantissaToTokens({
          value: repayWithLossSwapQuote.minimumToTokenAmountReceivedMantissa,
          token: repayWithLossSwapQuote.toToken,
        })
      : undefined;

  // If shortLossAmountDeltaTokens is positive, then it means there's a loss
  const shortLossAmountDeltaTokens =
    repayWithLossSwapQuoteMinToTokenAmountTokens &&
    debouncedShortAmountTokens.minus(repayWithLossSwapQuoteMinToTokenAmountTokens);

  // Profit swap quote (swap extra long to supply DSA = generate profit)
  const {
    data: getProfitSwapQuoteData,
    error: getProfitSwapQuoteError,
    isLoading: isGetProfitSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.longAsset.vToken.underlyingToken,
      fromTokenAmountTokens: longProfitAmountDeltaTokens || new BigNumber(0),
      toToken: position.dsaAsset.vToken.underlyingToken,
      direction: 'exact-in',
      // When closing with a profit, the long assets need to be transferred to the
      // RelativePositionManager contract
      recipientAddress: relativePositionManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: !!leverageManagerContractAddress && isProfitable,
      ...sharedOptions,
    },
  );
  const profitSwapQuote = getProfitSwapQuoteData?.swapQuote;

  // Loss swap quote (swap DSA to repay short = repay loss)
  const {
    data: getLossSwapQuoteData,
    error: getLossSwapQuoteError,
    isLoading: isGetLossSwapQuoteLoading,
  } = useGetSwapQuote(
    {
      fromToken: position.dsaAsset.vToken.underlyingToken,
      toToken: position.shortAsset.vToken.underlyingToken,
      minToTokenAmountTokens:
        shortLossAmountDeltaTokens?.multipliedBy(
          // Buff amount to account from accrued interests while the transaction is being mined
          new BigNumber(1).plus(FULL_REPAYMENT_BUFFER_PERCENTAGE),
        ) || new BigNumber(0),
      direction: 'approximate-out',
      recipientAddress: leverageManagerContractAddress || NULL_ADDRESS,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled:
        !!leverageManagerContractAddress &&
        !isProfitable &&
        !!shortLossAmountDeltaTokens?.isGreaterThan(0),
      ...sharedOptions,
    },
  );
  const lossSwapQuote = getLossSwapQuoteData?.swapQuote;

  // Calculate actual PnL based on swaps
  let pnlDsaTokens: BigNumber | undefined;

  // Closing/Reducing with profit
  if (isProfitable && profitSwapQuote?.direction === 'exact-in') {
    pnlDsaTokens = getSwapToTokenAmount(profitSwapQuote);
  }
  // Closing/Reducing with loss
  else if (!isProfitable && lossSwapQuote?.direction === 'approximate-out') {
    pnlDsaTokens = convertMantissaToTokens({
      value: lossSwapQuote.fromTokenAmountSoldMantissa,
      token: lossSwapQuote.fromToken,
    }).multipliedBy(-1);
  }
  // Closing/Reducing the position isn't generating profit, but it's not generating loss either (the
  // long balance used is sufficient to repay the short balance portion)
  else if (!isProfitable && shortLossAmountDeltaTokens?.isNegative()) {
    pnlDsaTokens = new BigNumber(0);
  }

  // Update long amount when short amount is updated
  useEffect(() => {
    if (closePosition) {
      return;
    }

    if (debouncedShortAmountTokens) {
      setFormValues(currFormValues => {
        let newLongAmountTokens = '';

        const sanitizedShortAmountTokens = new BigNumber(currFormValues.shortAmountTokens || 0);

        if (sanitizedShortAmountTokens.isGreaterThan(0)) {
          const newLongAmountToWithdrawTokens =
            position.longBalanceTokens.multipliedBy(reduceRatio);

          newLongAmountTokens = newLongAmountToWithdrawTokens
            .dp(position.longAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
            .toFixed();
        }

        return {
          ...currFormValues,
          longAmountTokens: newLongAmountTokens,
        };
      });
    }
  }, [
    closePosition,
    setFormValues,
    reduceRatio,
    debouncedShortAmountTokens,
    position.longBalanceTokens,
    position.longAsset.vToken.underlyingToken,
  ]);

  // Keep short amount updated when fully closing position
  useEffect(() => {
    if (closePosition) {
      setFormValues(currFormValues => ({
        ...currFormValues,
        longAmountTokens: position.longBalanceTokens.toFixed(),
        shortAmountTokens: position.shortBalanceTokens.toFixed(),
      }));
    }
  }, [setFormValues, closePosition, position.longBalanceTokens, position.shortBalanceTokens]);

  let dsaBalanceUpdateTokens = new BigNumber(0);

  if (pnlDsaTokens) {
    dsaBalanceUpdateTokens = closePosition
      ? position.dsaBalanceTokens
      : pnlDsaTokens.absoluteValue();
  }

  const balanceMutations: AssetBalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: position.dsaAsset.vToken.address,
      action: pnlDsaTokens?.isPositive() && !closePosition ? 'supply' : 'withdraw',
      amountTokens: dsaBalanceUpdateTokens,
      balanceTokens: position.dsaBalanceTokens,
      label: t('yieldPlus.operationForm.openForm.collateral'),
    },
    {
      type: 'asset',
      vTokenAddress: position.longAsset.vToken.address,
      action: 'withdraw',
      amountTokens: new BigNumber(pnlDsaTokens ? longAmountTokens : 0),
      balanceTokens: position.longBalanceTokens,
      label: t('yieldPlus.operationForm.openForm.long'),
    },
    {
      type: 'asset',
      vTokenAddress: position.shortAsset.vToken.address,
      action: 'repay',
      amountTokens: new BigNumber(pnlDsaTokens ? debouncedShortAmountTokens : 0),
      balanceTokens: position.shortBalanceTokens,
      label: t('yieldPlus.operationForm.openForm.short'),
    },
  ];

  const handleSubmit = async () => {
    // Close empty position
    if (
      position.shortBalanceTokens.isZero() &&
      position.longBalanceTokens.isZero() &&
      closePosition
    ) {
      return closeEmptyPosition({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
      });
    }

    // Close position with empty short balance but non-empty long balance
    if (
      position.shortBalanceTokens.isZero() &&
      closePosition &&
      profitSwapQuote?.direction === 'exact-in'
    ) {
      return closePositionWithProfit({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        profitSwapQuote,
      });
    }

    const isReducingWithProfit = pnlDsaTokens?.isPositive();
    const closeFractionPercentage = reduceRatio.multipliedBy(100).toNumber();

    // Reduce with profit
    if (
      isReducingWithProfit &&
      !closePosition &&
      repayWithProfitSwapQuote?.direction === 'approximate-out' &&
      profitSwapQuote?.direction === 'exact-in'
    ) {
      return reducePositionWithProfit({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        closeFractionPercentage,
        repaySwapQuote: repayWithProfitSwapQuote,
        profitSwapQuote,
      });
    }

    // Close with profit
    if (
      isReducingWithProfit &&
      closePosition &&
      repayWithProfitSwapQuote?.direction === 'approximate-out' &&
      profitSwapQuote?.direction === 'exact-in'
    ) {
      return closePositionWithProfit({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        repaySwapQuote: repayWithProfitSwapQuote,
        profitSwapQuote,
      });
    }

    const isReducingWithLoss =
      pnlDsaTokens?.isLessThan(0) &&
      repayWithLossSwapQuote?.direction === 'exact-in' &&
      lossSwapQuote?.direction === 'approximate-out';

    const isReducingWithoutPnl =
      pnlDsaTokens?.isZero() && repayWithLossSwapQuote?.direction === 'exact-in';

    // Reduce with loss
    if (isReducingWithLoss && !closePosition) {
      return reducePositionWithLoss({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        closeFractionPercentage,
        repaySwapQuote: repayWithLossSwapQuote,
        lossSwapQuote,
      });
    }

    // Close with loss
    if (isReducingWithLoss && closePosition) {
      return closePositionWithLoss({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        repaySwapQuote: repayWithLossSwapQuote,
        lossSwapQuote,
      });
    }

    // Reduce without PnL
    if (isReducingWithoutPnl && !closePosition) {
      return reducePositionWithLoss({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        closeFractionPercentage,
        repaySwapQuote: repayWithLossSwapQuote,
      });
    }

    // Close without PnL
    if (isReducingWithoutPnl && closePosition) {
      return closePositionWithLoss({
        longVTokenAddress: position.longAsset.vToken.address,
        shortVTokenAddress: position.shortAsset.vToken.address,
        repaySwapQuote: repayWithLossSwapQuote,
      });
    }

    // This case should never happen, as the form is only valid if all the quotes have been fetched
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  };

  const limitShortTokens = BigNumber.min(
    position.shortBalanceTokens,
    position.shortAsset.cashTokens,
  );

  const isSubmitting =
    isReducingPositionWithProfit ||
    isReducingPositionWithLoss ||
    isClosingPositionWithProfit ||
    isClosingPositionWithLoss ||
    isClosingEmptyPosition;

  const isLoading =
    isGetRepayWithProfitSwapQuoteLoading ||
    isGetRepayWithLossSwapQuoteLoading ||
    isGetProfitSwapQuoteLoading ||
    isGetLossSwapQuoteLoading;

  const repaySwapQuoteErrorCode = isProfitable
    ? getRepayWithProfitSwapQuoteError?.code
    : getRepayWithLossSwapQuoteError?.code;

  const repaySwapQuote = isProfitable ? repayWithProfitSwapQuote : repayWithLossSwapQuote;

  return (
    <PositionForm
      action={closePosition ? 'close' : 'reduce'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      repaySwapQuote={repaySwapQuote}
      repaySwapQuoteErrorCode={repaySwapQuoteErrorCode}
      lossSwapQuote={lossSwapQuote}
      lossSwapQuoteErrorCode={getLossSwapQuoteError?.code}
      profitSwapQuote={profitSwapQuote}
      profitSwapQuoteErrorCode={getProfitSwapQuoteError?.code}
      isLoading={isLoading}
      position={position}
      formValues={formValues}
      setFormValues={setFormValues}
      limitShortTokens={limitShortTokens}
      balanceMutations={balanceMutations}
      pnlDsaTokens={pnlDsaTokens}
      submitButtonLabel={
        closePosition
          ? t('yieldPlus.operationForm.reduceForm.submitButtonLabel.close')
          : t('yieldPlus.operationForm.reduceForm.submitButtonLabel.reduce')
      }
    />
  );
};
