import BigNumber from 'bignumber.js';

import { useGetPool, useGetProportionalCloseTolerancePercentage } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useChain } from 'hooks/useChain';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { useTokenPair } from 'pages/YieldPlus/useTokenPair';
import type { Asset, Pool } from 'types';
import { areAddressesEqual, formatToYieldPlusPosition } from 'utilities';
import { calculateMaximumLeverageFactor } from '../../calculateMaximumLeverageFactor';

const DEFAULT_LEVERAGE_FACTOR = 2;

export const useGetNewYieldPlusPosition = () => {
  const { corePoolComptrollerContractAddress } = useChain();
  const { longToken, shortToken } = useTokenPair();
  const { chainId } = useChainId();

  const { accountAddress } = useAccountAddress();
  const {
    data: { dsaAssets },
    isLoading: isGetYieldPlusAssetsLoading,
  } = useGetYieldPlusAssets({
    accountAddress,
  });

  const { data: getProportionalCloseTolerancePercentageData } =
    useGetProportionalCloseTolerancePercentage();

  const proportionalCloseTolerancePercentage =
    getProportionalCloseTolerancePercentageData?.proportionalCloseTolerancePercentage;

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
  const firstDsaAsset = dsaAssets[0];

  corePool?.assets.forEach(asset => {
    if (firstDsaAsset && areAddressesEqual(asset.vToken.address, firstDsaAsset.vToken.address)) {
      dsaAsset = asset;
    }

    if (areAddressesEqual(asset.vToken.underlyingToken.address, shortToken.address)) {
      shortAsset = asset;
    }

    if (areAddressesEqual(asset.vToken.underlyingToken.address, longToken.address)) {
      longAsset = asset;
    }
  });

  const maximumLeverageFactor =
    dsaAsset && longAsset && typeof proportionalCloseTolerancePercentage === 'number'
      ? calculateMaximumLeverageFactor({
          dsaTokenCollateralFactor: dsaAsset.userCollateralFactor,
          longTokenCollateralFactor: longAsset.userCollateralFactor,
          proportionalCloseTolerancePercentage,
        })
      : undefined;

  // Create base position from Core pool
  const position =
    corePool && dsaAsset && longAsset && shortAsset && typeof maximumLeverageFactor === 'number'
      ? formatToYieldPlusPosition({
          pool: corePool,
          chainId,
          positionAccountAddress: NULL_ADDRESS,
          dsaVTokenAddress: dsaAsset.vToken.address,
          longVTokenAddress: longAsset.vToken.address,
          shortVTokenAddress: shortAsset.vToken.address,
          leverageFactor: BigNumber.min(maximumLeverageFactor, DEFAULT_LEVERAGE_FACTOR).toNumber(),
          unrealizedPnlCents: 0,
          unrealizedPnlPercentage: 0,
        })
      : undefined;

  return {
    data: {
      position,
    },
    ...otherProps,
    isLoading: otherProps.isLoading || isGetYieldPlusAssetsLoading,
  };
};
