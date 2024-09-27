import { useGetIsolatedPools } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useMemo } from 'react';

export const useGetFilteredPools = () => {
  const { data: getPoolsData } = useGetIsolatedPools();
  const chainMetadata = useGetChainMetadata();

  const pools = useMemo(
    () =>
      (getPoolsData?.pools || []).filter(
        pool => pool.comptrollerAddress !== chainMetadata.corePoolComptrollerContractAddress,
      ),
    [getPoolsData?.pools, chainMetadata.corePoolComptrollerContractAddress],
  );

  return { pools };
};
