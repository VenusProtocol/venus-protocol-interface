import type { Address } from 'viem';

import { useGetPool } from 'clients/api';
import { useChain } from 'hooks/useChain';

export const useGetYieldPlusAssets = (input?: { accountAddress?: Address }) => {
  const { corePoolComptrollerContractAddress } = useChain();

  const {
    data: getPoolData,
    isLoading,
    ...otherProps
  } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress: input?.accountAddress,
  });
  const corePool = getPoolData?.pool;

  const borrowAssets = (corePool?.assets || []).filter(
    asset => !asset.disabledTokenActions.includes('borrow'),
  );

  const supplyAssets = (corePool?.assets || []).filter(
    asset => asset.collateralFactor > 0 && !asset.disabledTokenActions.includes('supply'),
  );

  return {
    data: {
      borrowAssets,
      supplyAssets,
    },
    isLoading,
    ...otherProps,
  };
};
