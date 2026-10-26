import BigNumber from 'bignumber.js';
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

  if (!liquidityHub) {
    return undefined;
  }

  // A withdrawal also burns the shares that pay the redeem fee
  const amountTokens =
    balanceMutation.action === 'withdraw'
      ? balanceMutation.amountTokens.dividedBy(
          new BigNumber(1).minus(liquidityHub.redeemFeePercentage.dividedBy(100)),
        )
      : balanceMutation.amountTokens;

  return {
    action: balanceMutation.action,
    amountTokens,
    balanceTokens: liquidityHub.userSupplyBalanceTokens ?? new BigNumber(0),
    description: balanceMutation.description,
    label: balanceMutation.label ?? t('accountData.balanceUpdate.supplyBalance'),
    token: liquidityHub.vhToken.underlyingToken,
    tokenPriceCents: liquidityHub.tokenPriceCents,
  };
};
