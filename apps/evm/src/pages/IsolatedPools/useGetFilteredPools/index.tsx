import { useGetPools } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useMemo } from 'react';

export const useGetFilteredPools = () => {
  const { data: getPoolsData } = useGetPools();
  const chainMetaData = useGetChainMetadata();

  const pools = useMemo(
    () =>
      (getPoolsData?.pools || []).filter(
        pool =>
          pool.isIsolated &&
          pool.comptrollerAddress !== chainMetaData.corePoolComptrollerContractAddress,
      ),
    [getPoolsData?.pools, chainMetaData.corePoolComptrollerContractAddress],
  );

  return { pools };
};
