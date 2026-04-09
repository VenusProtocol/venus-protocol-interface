import type { Address } from 'viem';

import { useGetDsaVTokens, useGetPool } from 'clients/api';
import { useChain } from 'hooks/useChain';
import type { Asset } from 'types';
import { areAddressesEqual } from 'utilities';

export const useGetYieldPlusAssets = (input?: { accountAddress?: Address }) => {
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

  const corePool = getPoolData?.pool;
  const dsaVTokenAddresses = getDsaVTokensData?.dsaVTokenAddresses;

  const isDataReady =
    !isGetPoolLoading && !isGetDsaVTokensLoading && !!corePool && !!dsaVTokenAddresses;

  const assets = isDataReady
    ? corePool.assets.filter(asset => !asset.vToken.underlyingToken.isNative)
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

  return {
    data: {
      dsaAssets,
      supplyAssets: assets,
      borrowAssets: assets,
    },
    isLoading: isGetPoolLoading || isGetDsaVTokensLoading,
    ...otherProps,
  };
};
