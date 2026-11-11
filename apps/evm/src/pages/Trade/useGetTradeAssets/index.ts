import type { Address } from 'viem';

import { useGetDsaVTokens, useGetLiquidityHubs, useGetPool } from 'clients/api';
import { useChain } from 'hooks/useChain';
import type { Asset } from 'types';
import { areAddressesEqual, areTokensEqual } from 'utilities';

export const useGetTradeAssets = (input?: { accountAddress?: Address }) => {
  const { corePoolComptrollerContractAddress } = useChain();

  const {
    data: getPoolData,
    isLoading: isGetPoolLoading,
    ...otherProps
  } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress: input?.accountAddress,
  });

  const { data: getDsaVTokensData, isLoading: isGetDsaVTokensLoading } = useGetDsaVTokens();

  const {
    data: getLiquidityHubsData,
    isLoading: isGetLiquidityHubsQueryLoading,
    isFetched: isGetLiquidityHubsFetched,
  } = useGetLiquidityHubs();

  const isGetLiquidityHubsLoading = isGetLiquidityHubsQueryLoading && !isGetLiquidityHubsFetched;

  const corePool = getPoolData?.pool;
  const dsaVTokenAddresses = getDsaVTokensData?.dsaVTokenAddresses;

  const isDataReady =
    !isGetPoolLoading &&
    !isGetDsaVTokensLoading &&
    !isGetLiquidityHubsLoading &&
    !!corePool &&
    !!dsaVTokenAddresses;

  const assets = isDataReady
    ? corePool.assets.filter(asset => !asset.vToken.underlyingToken.isNative && !asset.isRestricted)
    : [];

  const dsaAssets = isDataReady
    ? dsaVTokenAddresses.reduce<Asset[]>((acc, dsaVTokenAddress) => {
        const asset = assets.find(({ vToken }) =>
          areAddressesEqual(vToken.address, dsaVTokenAddress),
        );

        if (asset && asset.collateralFactor > 0 && !asset.disabledTokenActions.includes('supply')) {
          acc.push(asset);
        }

        return acc;
      }, [])
    : [];

  const liquidityHubs = getLiquidityHubsData?.liquidityHubs ?? [];

  const pairAssets = assets.filter(
    asset =>
      !liquidityHubs.some(liquidityHub =>
        areTokensEqual(liquidityHub.vhToken, asset.vToken.underlyingToken),
      ),
  );

  return {
    data: {
      dsaAssets,
      supplyAssets: pairAssets,
      borrowAssets: pairAssets,
    },
    isLoading: isGetPoolLoading || isGetDsaVTokensLoading || isGetLiquidityHubsLoading,
    ...otherProps,
  };
};
