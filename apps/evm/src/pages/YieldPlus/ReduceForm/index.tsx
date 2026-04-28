import BigNumber from 'bignumber.js';
import { useEffect, useMemo } from 'react';

import {
  useCloseYieldPlusPosition,
  useCloseYieldPlusPositionWithLoss,
  useCloseYieldPlusPositionWithProfit,
  useGetYieldPlusReduceSwapQuotes,
  useReduceYieldPlusPositionWithLoss,
  useReduceYieldPlusPositionWithProfit,
} from 'clients/api';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { usePositionForm } from 'pages/YieldPlus/OperationForm/usePositionForm';
import { PositionForm } from 'pages/YieldPlus/PositionForm';
import type { AssetBalanceMutation, YieldPlusPosition } from 'types';
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

  const closeFractionPercentage = reduceRatio.multipliedBy(100).dp(2).toNumber();

  const { data, isLoading, error } = useGetYieldPlusReduceSwapQuotes(
    {
      dsaToken: position.dsaAsset.vToken.underlyingToken,
      shortToken: position.shortAsset.vToken.underlyingToken,
      shortAmountToRepayTokens: debouncedShortAmountTokens,
      longToken: position.longAsset.vToken.underlyingToken,
      longAmountToWithdrawTokens: longAmountTokens,
      closeFractionPercentage,
      isPositionShortBalanceZero: position.shortBalanceTokens.isZero(),
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: longAmountTokens?.isGreaterThan(0) || debouncedShortAmountTokens.isGreaterThan(0),
    },
  );

  const pnlDsaTokens = data?.pnlDsaTokens;
  const repayWithProfitSwapQuote = data?.repayWithProfitSwapQuote;
  const repayWithLossSwapQuote = data?.repayWithLossSwapQuote;
  const profitSwapQuote = data?.profitSwapQuote;
  const lossSwapQuote = data?.lossSwapQuote;

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

  const repaySwapQuote = pnlDsaTokens?.isGreaterThan(0)
    ? repayWithProfitSwapQuote
    : repayWithLossSwapQuote;

  return (
    <PositionForm
      action={closePosition ? 'close' : 'reduce'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      swapQuoteError={error ?? undefined}
      repaySwapQuote={repaySwapQuote}
      lossSwapQuote={lossSwapQuote}
      profitSwapQuote={profitSwapQuote}
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
