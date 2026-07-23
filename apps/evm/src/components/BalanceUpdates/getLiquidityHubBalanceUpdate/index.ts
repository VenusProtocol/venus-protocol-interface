import type { TFunction } from 'i18next';

import type { BalanceMutation, LiquidityHub } from 'types';
import { areAddressesEqual } from 'utilities';

import type { BalanceUpdate } from '..';

export interface GetLiquidityHubBalanceUpdateInput {
  balanceMutation: BalanceMutation;
  liquidityHubs?: LiquidityHub[];
  t: TFunction<'translation', undefined>;
}

export const getLiquidityHubBalanceUpdate = ({
  balanceMutation,
  liquidityHubs,
  t,
}: GetLiquidityHubBalanceUpdateInput): BalanceUpdate | undefined => {
  if (balanceMutation.type !== 'liquidityHub') {
    return undefined;
  }

  const liquidityHub = liquidityHubs?.find(hub =>
    areAddressesEqual(hub.vhToken.address, balanceMutation.vhTokenAddress),
  );

  if (!liquidityHub?.userSupplyBalanceTokens) {
    return undefined;
  }

  return {
    action: balanceMutation.action,
    amountTokens: balanceMutation.amountTokens,
    balanceTokens: liquidityHub.userSupplyBalanceTokens,
    description: balanceMutation.description,
    label: balanceMutation.label ?? t('accountData.balanceUpdate.supplyBalance'),
    token: liquidityHub.vhToken.underlyingToken,
    tokenPriceCents: liquidityHub.tokenPriceCents,
  };
};
