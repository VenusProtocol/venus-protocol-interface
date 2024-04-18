import { useGetIsolatedPools } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useMemo } from 'react';

export const useGetFilteredPools = () => {
  const { data: getPoolsData } = useGetIsolatedPools();
  const chainMetaData = useGetChainMetadata();

  const pools = useMemo(
    () =>
      (getPoolsData?.pools || []).filter(
        pool =>
          pool.comptrollerAddress !== chainMetaData.corePoolComptrollerContractAddress &&
          pool.comptrollerAddress !== chainMetaData.stakedEthPoolComptrollerContractAddress,
      ),
    [
      getPoolsData?.pools,
      chainMetaData.corePoolComptrollerContractAddress,
      chainMetaData.stakedEthPoolComptrollerContractAddress,
    ],
  );

  return { pools };
};
