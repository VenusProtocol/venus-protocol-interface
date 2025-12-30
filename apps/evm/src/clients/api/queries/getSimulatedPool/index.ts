import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import type {
  Asset,
  AssetBalanceMutation,
  BalanceMutation,
  Pool,
  PoolVai,
  VaiBalanceMutation,
} from 'types';
import {
  addUserBorrowLimitShares,
  areAddressesEqual,
  calculateUserPoolValues,
  calculateYearlyEarningsForAssets,
  clampToZero,
} from 'utilities';
import { addUserPrimeApys } from './addUserPrimeApys';

export interface GetSimulatedPoolInput {
  publicClient: PublicClient;
  balanceMutations: BalanceMutation[];
  pool?: Pool;
  accountAddress?: Address;
  primeContractAddress?: Address;
  isUserPrime?: boolean;
  userXvsStakedMantissa?: BigNumber;
}

export interface GetSimulatedPoolOutput {
  pool: Pool | undefined;
}

export const getSimulatedPool = async ({
  balanceMutations,
  pool,
  accountAddress,
  publicClient,
  primeContractAddress,
  isUserPrime = false,
  userXvsStakedMantissa,
}: GetSimulatedPoolInput): Promise<GetSimulatedPoolOutput> => {
  // Filter out 0 balance mutations
  const filteredBalanceMutations = balanceMutations.filter(b => !b.amountTokens.isEqualTo(0));

  if (!pool || filteredBalanceMutations.length === 0) {
    return {
      pool: undefined,
    };
  }

  const { vaiMutations, assetMutations } = filteredBalanceMutations.reduce<{
    vaiMutations: VaiBalanceMutation[];
    assetMutations: AssetBalanceMutation[];
  }>(
    (acc, balanceMutation) => ({
      vaiMutations:
        balanceMutation.type === 'vai'
          ? acc.vaiMutations.concat(balanceMutation)
          : acc.vaiMutations,
      assetMutations:
        balanceMutation.type === 'asset'
          ? acc.assetMutations.concat(balanceMutation)
          : acc.assetMutations,
    }),
    {
      vaiMutations: [],
      assetMutations: [],
    },
  );

  const mutatedVTokenAddresses = assetMutations.map(
    mutation => mutation.vTokenAddress.toLowerCase() as Address,
  );

  const mutatedPrimeVTokenAddresses: Address[] = [];

  let simulatedAssets: Asset[] = pool.assets.map(asset => {
    const assetBalanceMutations = assetMutations.filter(balanceMutation =>
      areAddressesEqual(balanceMutation.vTokenAddress, asset.vToken.address),
    );

    if (assetBalanceMutations.length === 0) {
      return asset;
    }

    const isAssetPrime = [
      ...asset.supplyTokenDistributions,
      ...asset.borrowTokenDistributions,
    ].some(d => d.type === 'prime' || d.type === 'primeSimulation');

    if (isAssetPrime) {
      mutatedPrimeVTokenAddresses.push(asset.vToken.address.toLowerCase() as Address);
    }

    let supplyBalanceTokens = asset.supplyBalanceTokens;
    let supplyBalanceCents = asset.supplyBalanceCents;
    let borrowBalanceTokens = asset.borrowBalanceTokens;
    let borrowBalanceCents = asset.borrowBalanceCents;

    let userSupplyBalanceTokens = asset.userSupplyBalanceTokens;
    let userSupplyBalanceCents = asset.userSupplyBalanceCents;
    let userBorrowBalanceTokens = asset.userBorrowBalanceTokens;
    let userBorrowBalanceCents = asset.userBorrowBalanceCents;

    let isCollateralOfUser = asset.isCollateralOfUser;

    assetBalanceMutations.forEach(({ action, amountTokens, enableAsCollateralOfUser }) => {
      const amountCents = amountTokens.multipliedBy(asset.tokenPriceCents);

      if (enableAsCollateralOfUser) {
        isCollateralOfUser = true;
      }

      switch (action) {
        case 'supply':
          supplyBalanceTokens = supplyBalanceTokens.plus(amountTokens);
          userSupplyBalanceTokens = userSupplyBalanceTokens.plus(amountTokens);

          supplyBalanceCents = supplyBalanceCents.plus(amountCents);
          userSupplyBalanceCents = userSupplyBalanceCents.plus(amountCents);
          break;
        case 'withdraw':
          supplyBalanceTokens = clampToZero({ value: supplyBalanceTokens.minus(amountTokens) });
          userSupplyBalanceTokens = clampToZero({
            value: userSupplyBalanceTokens.minus(amountTokens),
          });

          supplyBalanceCents = clampToZero({ value: supplyBalanceCents.minus(amountCents) });
          userSupplyBalanceCents = clampToZero({
            value: userSupplyBalanceCents.minus(amountCents),
          });
          break;
        case 'borrow':
          borrowBalanceTokens = borrowBalanceTokens.plus(amountTokens);
          userBorrowBalanceTokens = userBorrowBalanceTokens.plus(amountTokens);

          borrowBalanceCents = borrowBalanceCents.plus(amountCents);
          userBorrowBalanceCents = userBorrowBalanceCents.plus(amountCents);
          break;
        case 'repay':
          borrowBalanceTokens = clampToZero({ value: borrowBalanceTokens.minus(amountTokens) });
          userBorrowBalanceTokens = clampToZero({
            value: userBorrowBalanceTokens.minus(amountTokens),
          });

          borrowBalanceCents = clampToZero({ value: borrowBalanceCents.minus(amountCents) });
          userBorrowBalanceCents = clampToZero({
            value: userBorrowBalanceCents.minus(amountCents),
          });
          break;
      }
    });

    const simulatedAsset: Asset = {
      ...asset,
      supplyBalanceTokens,
      supplyBalanceCents,
      borrowBalanceTokens,
      borrowBalanceCents,
      userSupplyBalanceTokens,
      userSupplyBalanceCents,
      userBorrowBalanceTokens,
      userBorrowBalanceCents,
      isCollateralOfUser,
    };

    return simulatedAsset;
  });

  let userVaiBorrowBalanceTokens = pool.vai?.userBorrowBalanceTokens ?? new BigNumber(0);
  let userVaiBorrowBalanceCents = pool.vai?.userBorrowBalanceCents ?? new BigNumber(0);

  if (vaiMutations.length > 0 && pool.vai?.tokenPriceCents) {
    vaiMutations.forEach(vaiMutation => {
      const vaiAmountCents = vaiMutation.amountTokens.multipliedBy(pool.vai!.tokenPriceCents);

      if (vaiMutation.action === 'borrow') {
        userVaiBorrowBalanceTokens = userVaiBorrowBalanceTokens.plus(vaiMutation.amountTokens);
        userVaiBorrowBalanceCents = userVaiBorrowBalanceCents.plus(vaiAmountCents);
      } else {
        // VAI debt repayment
        userVaiBorrowBalanceTokens = clampToZero({
          value: userVaiBorrowBalanceTokens.minus(vaiMutation.amountTokens),
        });
        userVaiBorrowBalanceCents = clampToZero({
          value: userVaiBorrowBalanceCents.minus(vaiAmountCents),
        });
      }
    });
  }

  const userPoolValues = calculateUserPoolValues({
    assets: simulatedAssets,
    userVaiBorrowBalanceCents,
    vaiBorrowAprPercentage: pool.vai?.borrowAprPercentage,
  });

  const { assets: assetWithBorrowLimitShares } = addUserBorrowLimitShares({
    assets: simulatedAssets,
    userBorrowLimitCents: userPoolValues.userBorrowLimitCents,
  });

  simulatedAssets = assetWithBorrowLimitShares;

  // Recalculate Prime APYs
  if (
    accountAddress &&
    isUserPrime &&
    primeContractAddress &&
    userXvsStakedMantissa &&
    mutatedPrimeVTokenAddresses.length > 0
  ) {
    const { assets: assetsWithPrimeApys } = await addUserPrimeApys({
      assets: simulatedAssets,
      mutatedVTokenAddresses,
      accountAddress,
      primeContractAddress,
      userXvsStakedMantissa,
      publicClient,
    });

    simulatedAssets = assetsWithPrimeApys;

    // Recalculate user earnings
    userPoolValues.userYearlyEarningsCents = calculateYearlyEarningsForAssets({
      assets: simulatedAssets,
    });
  }

  const poolVai: undefined | PoolVai = pool.vai
    ? {
        ...pool.vai,
        userBorrowBalanceTokens: userVaiBorrowBalanceTokens,
        userBorrowBalanceCents: userVaiBorrowBalanceCents,
      }
    : undefined;

  const simulatedPool: Pool = {
    ...pool,
    ...userPoolValues,
    assets: simulatedAssets,
    vai: poolVai,
  };

  return {
    pool: simulatedPool,
  };
};
