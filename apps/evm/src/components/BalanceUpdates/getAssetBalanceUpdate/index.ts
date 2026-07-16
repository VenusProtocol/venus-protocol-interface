import type { TFunction } from 'i18next';

import type { BalanceMutation, Pool } from 'types';
import { areAddressesEqual } from 'utilities';

import type { BalanceUpdate } from '..';

export interface GetAssetBalanceUpdateInput {
  balanceMutation: BalanceMutation;
  pool?: Pool;
  t: TFunction<'translation', undefined>;
}

export const getAssetBalanceUpdate = ({
  balanceMutation,
  pool,
  t,
}: GetAssetBalanceUpdateInput): BalanceUpdate | undefined => {
  if (balanceMutation.type !== 'asset') {
    return undefined;
  }

  const asset = pool?.assets.find(poolAsset =>
    areAddressesEqual(poolAsset.vToken.address, balanceMutation.vTokenAddress),
  );

  if (!asset) {
    // This case should never happen
    return undefined;
  }

  const isBorrowBalance = balanceMutation.action === 'borrow' || balanceMutation.action === 'repay';
  let balanceTokens = balanceMutation.balanceTokens;

  if (!balanceTokens) {
    balanceTokens = isBorrowBalance ? asset.userBorrowBalanceTokens : asset.userSupplyBalanceTokens;
  }

  const label =
    balanceMutation.label ??
    t(
      isBorrowBalance
        ? 'accountData.balanceUpdate.borrowBalance'
        : 'accountData.balanceUpdate.supplyBalance',
    );

  return {
    action: balanceMutation.action,
    amountTokens: balanceMutation.amountTokens,
    balanceTokens,
    description: balanceMutation.description,
    label,
    token: asset.vToken.underlyingToken,
    tokenPriceCents: asset.tokenPriceCents,
  };
};
