import type { TFunction } from 'i18next';

import type { BalanceMutation, LiquidityHub, TxFormError } from 'types';

import areAddressesEqual from '../areAddressesEqual';
import { formatTokensToReadableValue } from '../formatTokensToReadableValue';

export interface ValidateLiquidityHubBalanceMutationsInput {
  t: TFunction<'translation', undefined>;
  liquidityHub: LiquidityHub;
  balanceMutations: BalanceMutation[];
}

export type LiquidityHubBalanceMutationsErrorCode =
  | 'SUPPLY_CAP_ALREADY_REACHED'
  | 'HIGHER_THAN_SUPPLY_CAP'
  | 'HIGHER_THAN_LIQUIDITY'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT';

export type ValidateLiquidityHubBalanceMutationsOutput =
  | TxFormError<LiquidityHubBalanceMutationsErrorCode>
  | undefined;

export const validateLiquidityHubBalanceMutations = ({
  t,
  liquidityHub,
  balanceMutations,
}: ValidateLiquidityHubBalanceMutationsInput): ValidateLiquidityHubBalanceMutationsOutput => {
  for (let b = 0; b < balanceMutations.length; b++) {
    const balanceMutation = balanceMutations[b];

    if (balanceMutation.type !== 'liquidityHub') {
      // Skip non-Liquidity Hub mutations
      continue;
    }

    if (!areAddressesEqual(liquidityHub.vhToken.address, balanceMutation.vhTokenAddress)) {
      // Skip balance mutation if it isn't for the passed Liquidity Hub
      continue;
    }

    if (
      balanceMutation.action === 'supply' &&
      liquidityHub.supplyBalanceTokens.isGreaterThanOrEqualTo(liquidityHub.supplyCapTokens)
    ) {
      return {
        code: 'SUPPLY_CAP_ALREADY_REACHED',
        message: t('liquidityHubForm.error.supplyCapReached', {
          supplyCap: formatTokensToReadableValue({
            value: liquidityHub.supplyCapTokens,
            token: liquidityHub.vhToken.underlyingToken,
            maxDecimalPlaces: liquidityHub.vhToken.underlyingToken.decimals,
          }),
        }),
      };
    }

    if (
      balanceMutation.action === 'supply' &&
      liquidityHub.supplyBalanceTokens
        .plus(balanceMutation.amountTokens)
        .isGreaterThan(liquidityHub.supplyCapTokens)
    ) {
      return {
        code: 'HIGHER_THAN_SUPPLY_CAP',
        message: t('liquidityHubForm.error.higherThanSupplyCap', {
          userMaxSupplyAmount: formatTokensToReadableValue({
            value: liquidityHub.supplyCapTokens.minus(liquidityHub.supplyBalanceTokens),
            token: liquidityHub.vhToken.underlyingToken,
            maxDecimalPlaces: liquidityHub.vhToken.underlyingToken.decimals,
          }),
          supplyCap: formatTokensToReadableValue({
            value: liquidityHub.supplyCapTokens,
            token: liquidityHub.vhToken.underlyingToken,
            maxDecimalPlaces: liquidityHub.vhToken.underlyingToken.decimals,
          }),
          supplyBalance: formatTokensToReadableValue({
            value: liquidityHub.supplyBalanceTokens,
            token: liquidityHub.vhToken.underlyingToken,
            maxDecimalPlaces: liquidityHub.vhToken.underlyingToken.decimals,
          }),
        }),
      };
    }

    if (
      balanceMutation.action === 'withdraw' &&
      balanceMutation.amountTokens.isGreaterThan(liquidityHub.liquidityTokens)
    ) {
      return {
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('liquidityHubForm.error.higherThanAvailableLiquidity'),
      };
    }

    if (
      balanceMutation.action === 'withdraw' &&
      liquidityHub.userSupplyBalanceTokens &&
      balanceMutation.amountTokens.isGreaterThan(liquidityHub.userSupplyBalanceTokens)
    ) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('liquidityHubForm.error.higherThanAvailableAmount'),
      };
    }
  }
};
