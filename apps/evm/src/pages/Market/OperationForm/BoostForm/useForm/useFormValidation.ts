import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, SwapQuote, SwapQuoteError } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  borrowedAsset: Asset;
  suppliedAsset: Asset;
  pool: Pool;
  formValues: FormValues;
  limitTokens: BigNumber;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: SwapQuoteError;
  expectedSuppliedAmountTokens?: BigNumber;
  simulatedPool?: Pool;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formErrors: FormError<FormErrorCode>[];
}

const useFormValidation = ({
  borrowedAsset,
  suppliedAsset,
  pool,
  limitTokens,
  simulatedPool,
  formValues,
  swapQuote,
  getSwapQuoteError,
  expectedSuppliedAmountTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formErrors = useMemo<FormError<FormErrorCode>[]>(() => {
    const tmpErrors: FormError<FormErrorCode>[] = [];

    if (!pool?.userBorrowLimitCents || pool.userBorrowLimitCents.isEqualTo(0)) {
      tmpErrors.push({
        code: 'NO_COLLATERALS',
        message: t('operationForm.error.noCollateral', {
          tokenSymbol: borrowedAsset.vToken.underlyingToken.symbol,
        }),
      });
    }

    if (
      borrowedAsset.borrowCapTokens &&
      borrowedAsset.borrowBalanceTokens.isGreaterThanOrEqualTo(borrowedAsset.borrowCapTokens)
    ) {
      tmpErrors.push({
        code: 'BORROW_CAP_ALREADY_REACHED',
        message: t('operationForm.error.borrowCapReached', {
          assetBorrowCap: formatTokensToReadableValue({
            value: borrowedAsset.borrowCapTokens,
            token: borrowedAsset.vToken.underlyingToken,
          }),
        }),
      });
    }

    const borrowedTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!borrowedTokenAmountTokens || borrowedTokenAmountTokens.isLessThanOrEqualTo(0)) {
      tmpErrors.push({
        code: 'EMPTY_TOKEN_AMOUNT',
      });
    }

    if (getSwapQuoteError?.code === 'noSwapQuoteFound') {
      tmpErrors.push({
        code: 'NO_SWAP_QUOTE_FOUND',
        message: t('operationForm.error.noSwapQuoteFound'),
      });
    }

    if (
      borrowedTokenAmountTokens &&
      borrowedAsset.borrowBalanceTokens
        .plus(borrowedTokenAmountTokens)
        .isGreaterThan(borrowedAsset.borrowCapTokens)
    ) {
      tmpErrors.push({
        code: 'HIGHER_THAN_BORROW_CAP',
        message: t('operationForm.error.higherThanBorrowCap', {
          userMaxBorrowAmount: formatTokensToReadableValue({
            value: borrowedAsset.borrowCapTokens.minus(borrowedAsset.borrowBalanceTokens),
            token: borrowedAsset.vToken.underlyingToken,
            maxDecimalPlaces: borrowedAsset.vToken.underlyingToken.decimals,
          }),
          assetBorrowCap: formatTokensToReadableValue({
            value: borrowedAsset.borrowCapTokens,
            token: borrowedAsset.vToken.underlyingToken,
            maxDecimalPlaces: borrowedAsset.vToken.underlyingToken.decimals,
          }),
          assetBorrowBalance: formatTokensToReadableValue({
            value: borrowedAsset.borrowBalanceTokens,
            token: borrowedAsset.vToken.underlyingToken,
            maxDecimalPlaces: borrowedAsset.vToken.underlyingToken.decimals,
          }),
        }),
      });
    }

    if (
      expectedSuppliedAmountTokens &&
      suppliedAsset.supplyBalanceTokens
        .plus(expectedSuppliedAmountTokens)
        .isGreaterThan(suppliedAsset.supplyCapTokens)
    ) {
      tmpErrors.push({
        code: 'HIGHER_THAN_SUPPLY_CAP',
        message: t('operationForm.error.higherThanSupplyCap', {
          userMaxSupplyAmount: formatTokensToReadableValue({
            value: suppliedAsset.supplyCapTokens.minus(suppliedAsset.supplyBalanceTokens),
            token: suppliedAsset.vToken.underlyingToken,
            maxDecimalPlaces: suppliedAsset.vToken.underlyingToken.decimals,
          }),
          assetSupplyCap: formatTokensToReadableValue({
            value: suppliedAsset.supplyCapTokens,
            token: suppliedAsset.vToken.underlyingToken,
            maxDecimalPlaces: suppliedAsset.vToken.underlyingToken.decimals,
          }),
          assetSupplyBalance: formatTokensToReadableValue({
            value: suppliedAsset.supplyBalanceTokens,
            token: suppliedAsset.vToken.underlyingToken,
            maxDecimalPlaces: suppliedAsset.vToken.underlyingToken.decimals,
          }),
        }),
      });
    }

    const assetLiquidityTokens = new BigNumber(borrowedAsset.liquidityCents).dividedBy(
      borrowedAsset.tokenPriceCents,
    );

    if (borrowedTokenAmountTokens?.isGreaterThan(assetLiquidityTokens)) {
      // User is trying to borrow more than available liquidity
      tmpErrors.push({
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('operationForm.error.higherThanAvailableLiquidity'),
      });
    }

    if (borrowedTokenAmountTokens?.isGreaterThan(limitTokens)) {
      tmpErrors.push({
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      });
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor <= HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    ) {
      tmpErrors.push({
        code: 'TOO_RISKY',
        message: t('operationForm.error.tooRisky'),
      });
    }

    if (
      swapQuote &&
      swapQuote?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      tmpErrors.push({
        code: 'SWAP_PRICE_IMPACT_TOO_HIGH',
        message: t('operationForm.error.priceImpactTooHigh'),
      });
    }

    if (
      swapQuote &&
      swapQuote?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
      swapQuote?.priceImpactPercentage < MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
      !formValues.acknowledgeHighPriceImpact
    ) {
      tmpErrors.push({
        code: 'REQUIRES_SWAP_PRICE_IMPACT_ACKNOWLEDGEMENT',
      });
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
      !formValues.acknowledgeRisk
    ) {
      tmpErrors.push({
        code: 'REQUIRES_RISK_ACKNOWLEDGEMENT',
      });
    }

    if (!simulatedPool || !expectedSuppliedAmountTokens) {
      tmpErrors.push({
        code: 'MISSING_DATA',
      });
    }

    return tmpErrors;
  }, [
    borrowedAsset,
    suppliedAsset,
    pool,
    limitTokens,
    simulatedPool,
    formValues.amountTokens,
    expectedSuppliedAmountTokens,
    getSwapQuoteError,
    formValues.acknowledgeRisk,
    formValues.acknowledgeHighPriceImpact,
    swapQuote,
    t,
  ]);

  return {
    isFormValid: !formErrors.length,
    formErrors,
  };
};

export default useFormValidation;
