import type { Address } from 'viem';

import { useGetDsaVTokens, useGetPool } from 'clients/api';
import { useChain } from 'hooks/useChain';
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

  const borrowAssets = isDataReady
    ? corePool.assets.filter(asset => !asset.disabledTokenActions.includes('borrow'))
    : [];

  const supplyAssets = isDataReady
    ? corePool.assets.filter(
        asset => asset.collateralFactor > 0 && !asset.disabledTokenActions.includes('supply'),
      )
    : [];

  const dsaAssets = isDataReady
    ? supplyAssets.filter(asset =>
        dsaVTokenAddresses.some(dsaVTokenAddress =>
          areAddressesEqual(dsaVTokenAddress, asset.vToken.address),
        ),
      )
    : [];

  return {
    data: {
      dsaAssets,
      supplyAssets,
      borrowAssets,
    },
    isLoading: isGetPoolLoading || isGetDsaVTokensLoading,
    ...otherProps,
  };
};
