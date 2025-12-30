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
import type { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, SwapQuote } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  formValues: FormValues;
  limitTokens: BigNumber;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: VError<'swapQuote' | 'interaction'>;
  expectedSuppliedAmountTokens?: BigNumber;
  simulatedPool?: Pool;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formErrors: FormError<FormErrorCode>[];
}

const useFormValidation = ({
  asset,
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
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        }),
      });
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      tmpErrors.push({
        code: 'BORROW_CAP_ALREADY_REACHED',
        message: t('operationForm.error.borrowCapReached', {
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        }),
      });
    }

    if (getSwapQuoteError?.code === 'noSwapQuoteFound') {
      tmpErrors.push({
        code: 'NO_SWAP_QUOTE_FOUND',
        message: t('operationForm.error.noSwapQuoteFound'),
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

    if (
      borrowedTokenAmountTokens &&
      asset.borrowBalanceTokens.plus(borrowedTokenAmountTokens).isGreaterThan(asset.borrowCapTokens)
    ) {
      tmpErrors.push({
        code: 'HIGHER_THAN_BORROW_CAP',
        message: t('operationForm.error.higherThanBorrowCap', {
          userMaxBorrowAmount: formatTokensToReadableValue({
            value: asset.borrowCapTokens.minus(asset.borrowBalanceTokens),
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetBorrowBalance: formatTokensToReadableValue({
            value: asset.borrowBalanceTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
        }),
      });
    }

    if (
      expectedSuppliedAmountTokens &&
      asset.supplyBalanceTokens
        .plus(expectedSuppliedAmountTokens)
        .isGreaterThan(asset.supplyCapTokens)
    ) {
      tmpErrors.push({
        code: 'HIGHER_THAN_SUPPLY_CAP',
        message: t('operationForm.error.higherThanSupplyCap', {
          userMaxSupplyAmount: formatTokensToReadableValue({
            value: asset.supplyCapTokens.minus(asset.supplyBalanceTokens),
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetSupplyBalance: formatTokensToReadableValue({
            value: asset.supplyBalanceTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
        }),
      });
    }

    const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(
      asset.tokenPriceCents,
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
    asset,
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
