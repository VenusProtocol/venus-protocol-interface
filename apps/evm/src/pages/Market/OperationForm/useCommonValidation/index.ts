// TODO: add tests

import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, Pool, SwapQuote } from 'types';
import { areAddressesEqual, formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../types';

export interface UseCommonValidationInput {
  pool: Pool;
  balanceMutations: AssetBalanceMutation[];
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
  userAcknowledgesRisk?: boolean;
}

export type UseCommonValidationOutput = FormError | undefined;

export const useCommonValidation = ({
  pool,
  simulatedPool,
  swapQuote,
  balanceMutations,
  swapQuoteErrorCode,
  userAcknowledgesRisk,
}: UseCommonValidationInput): UseCommonValidationOutput => {
  const { t } = useTranslation();

  for (let b = 0; b < balanceMutations.length; b++) {
    const balanceMutation = balanceMutations[b];

    const asset = pool.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, balanceMutation.vTokenAddress),
    );

    if (!asset) {
      // Skip balance mutation if asset isn't in the pool
      continue;
    }

    if (
      asset.supplyCapTokens &&
      asset.supplyBalanceTokens.isGreaterThanOrEqualTo(asset.supplyCapTokens)
    ) {
      return {
        code: 'SUPPLY_CAP_ALREADY_REACHED',
        message: t('operationForm.error.supplyCapReached', {
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
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

    if (
      (balanceMutation.action === 'withdraw' || balanceMutation.action === 'borrow') &&
      balanceMutation.amountTokens.isGreaterThan(asset.cashTokens)
    ) {
      // User is trying to withdraw or borrow more than available liquidity
      return {
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('operationForm.error.higherThanAvailableLiquidity'),
      };
    }

    if (
      balanceMutation.action === 'withdraw' &&
      balanceMutation.amountTokens.isGreaterThan(asset.userSupplyBalanceTokens)
    ) {
      // User is trying to withdraw more than their supply balance
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    if (
      balanceMutation.action === 'repay' &&
      balanceMutation.amountTokens.isGreaterThan(asset.userBorrowBalanceTokens)
    ) {
      // User is trying to repay more than their borrow balance
      return {
        code: 'HIGHER_THAN_REPAY_BALANCE',
        message: t('operationForm.error.higherThanRepayBalance'),
      };
    }

    if (
      swapQuote &&
      swapQuote?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      return {
        code: 'SWAP_PRICE_IMPACT_TOO_HIGH',
        message: t('operationForm.error.priceImpactTooHigh'),
      };
    }

    if (swapQuoteErrorCode === 'noSwapQuoteFound') {
      return {
        code: 'NO_SWAP_QUOTE_FOUND',
        message: t('operationForm.error.noSwapQuoteFound'),
      };
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor <= HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    ) {
      return {
        code: 'TOO_RISKY',
        message: t('operationForm.error.tooRisky'),
      };
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
      !userAcknowledgesRisk
    ) {
      return {
        code: 'REQUIRES_RISK_ACKNOWLEDGEMENT',
      };
    }

    const simulatedAsset = simulatedPool?.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, balanceMutation.vTokenAddress),
    );

    if (!simulatedAsset) {
      // Skip balance mutation if asset isn't in the pool
      continue;
    }

    if (
      balanceMutation.action === 'supply' &&
      simulatedAsset.supplyBalanceTokens.isGreaterThan(asset.supplyCapTokens)
    ) {
      return {
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
      };
    }

    if (
      balanceMutation.action === 'borrow' &&
      simulatedAsset.borrowBalanceTokens.isGreaterThan(asset.borrowCapTokens)
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
  }
};
