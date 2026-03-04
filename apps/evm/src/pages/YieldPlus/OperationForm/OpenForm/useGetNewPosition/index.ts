import BigNumber from 'bignumber.js';

import { useGetPool } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useChain } from 'hooks/useChain';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useTokenPair } from 'pages/YieldPlus/useTokenPair';
import type { Asset, Pool } from 'types';
import { areAddressesEqual, formatToYieldPlusPosition } from 'utilities';

export const useGetNewPosition = () => {
  const { corePoolComptrollerContractAddress } = useChain();
  const { longToken, shortToken } = useTokenPair();
  const { chainId } = useChainId();

  const { accountAddress } = useAccountAddress();

  // Fetch the core pool without any user data so that it can serve as base for the Open form
  const { data: getPoolData, ...otherProps } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });

  // Reset every user-related value (except wallet balances)
  const corePool: Pool | undefined = getPoolData?.pool && {
    ...getPoolData.pool,
    userBorrowBalanceCents: new BigNumber(0),
    userSupplyBalanceCents: new BigNumber(0),
    userBorrowLimitCents: new BigNumber(0),
    userLiquidationThresholdCents: new BigNumber(0),
    userYearlyEarningsCents: new BigNumber(0),
    userEModeGroup: undefined,
    userHealthFactor: Number.POSITIVE_INFINITY,
    assets: getPoolData.pool.assets.map(asset => ({
      ...asset,
      userBorrowBalanceCents: new BigNumber(0),
      userBorrowBalanceTokens: new BigNumber(0),
      userSupplyBalanceCents: new BigNumber(0),
      userSupplyBalanceTokens: new BigNumber(0),
      userBorrowLimitSharePercentage: 0,
      isCollateralOfUser: false,
      userLiquidationThresholdPercentage: asset.liquidationThresholdPercentage,
      userCollateralFactor: asset.collateralFactor,
      isBorrowableByUser: asset.isBorrowable,
    })),
  };

  let longAsset: Asset | undefined;
  let shortAsset: Asset | undefined;
  let dsaAsset: Asset | undefined;

  corePool?.assets.forEach(asset => {
    if (areAddressesEqual(asset.vToken.underlyingToken.address, shortToken.address)) {
      dsaAsset = asset;
    }

    if (areAddressesEqual(asset.vToken.underlyingToken.address, shortToken.address)) {
      shortAsset = asset;
    }

    if (areAddressesEqual(asset.vToken.underlyingToken.address, longToken.address)) {
      longAsset = asset;
    }
  });

  // Create base position from Core pool
  const position =
    corePool &&
    dsaAsset &&
    longAsset &&
    shortAsset &&
    formatToYieldPlusPosition({
      pool: corePool,
      chainId,
      positionAccountAddress: NULL_ADDRESS,
      dsaVTokenAddress: dsaAsset.vToken.address,
      longVTokenAddress: longAsset.vToken.address,
      shortVTokenAddress: shortAsset.vToken.address,
      leverageFactor: 2, // TODO: calculate
      unrealizedPnlCents: 0,
      unrealizedPnlPercentage: 0,
    });

  return {
    data: {
      position,
    },
    ...otherProps,
  };
};
