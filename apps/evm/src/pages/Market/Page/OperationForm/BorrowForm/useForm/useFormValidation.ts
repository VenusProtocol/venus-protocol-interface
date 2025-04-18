import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Asset, Pool } from 'types';

import { HEALTH_FACTOR_LIQUIDATION_THRESHOLD } from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import { calculateHealthFactor, formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  limitTokens: string;
  formValues: FormValues;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  pool,
  limitTokens,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError = useMemo<FormError<FormErrorCode> | undefined>(() => {
    if (!pool?.userBorrowLimitCents || pool.userBorrowLimitCents.isEqualTo(0)) {
      return {
        code: 'NO_COLLATERALS',
        message: t('operationForm.error.noCollateral', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        }),
      };
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      return {
        code: 'BORROW_CAP_ALREADY_REACHED',
        message: t('operationForm.error.borrowCapReached', {
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        }),
      };
    }

    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.plus(fromTokenAmountTokens).isGreaterThan(asset.borrowCapTokens)
    ) {
      return {
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
      };
    }

    const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(
      asset.tokenPriceCents,
    );

    if (fromTokenAmountTokens.isGreaterThan(assetLiquidityTokens)) {
      // User is trying to withdraw more than available liquidity
      return {
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('operationForm.error.higherThanAvailableLiquidity'),
      };
    }

    if (fromTokenAmountTokens.isGreaterThan(limitTokens)) {
      return {
        code: 'HIGHER_THAN_BORROWABLE_AMOUNT',
        message: t('operationForm.error.higherThanBorrowableAmount'),
      };
    }

    const hypotheticalUserBorrowBalanceCents = new BigNumber(pool.userBorrowBalanceCents || 0).plus(
      fromTokenAmountTokens.multipliedBy(asset.tokenPriceCents),
    );

    const hypotheticalHealthFactor = calculateHealthFactor({
      borrowBalanceCents: hypotheticalUserBorrowBalanceCents.toNumber(),
      borrowLimitCents: pool.userBorrowLimitCents.toNumber(),
    });

    if (hypotheticalHealthFactor <= HEALTH_FACTOR_LIQUIDATION_THRESHOLD) {
      return {
        code: 'TOO_RISKY',
        message: t('operationForm.error.tooRisky'),
      };
    }
  }, [asset, pool, limitTokens, formValues.amountTokens, t]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
