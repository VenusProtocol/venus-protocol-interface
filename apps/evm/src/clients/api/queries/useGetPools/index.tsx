import { useMemo } from 'react';

import { useGetIsolatedPools, useGetLegacyPool } from 'clients/api';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId } from 'libs/wallet';
import { ChainId, type Pool } from 'types';

export interface UseGetPoolsInput {
  poolComptrollerAddress?: string;
  accountAddress?: string;
}

export interface UseGetPoolsOutput {
  isLoading: boolean;
  data?: {
    pools: Pool[];
  };
}

const useGetPools = ({
  accountAddress,
  poolComptrollerAddress,
}: UseGetPoolsInput): UseGetPoolsOutput => {
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolDataLoading } = useGetLegacyPool({
    accountAddress,
  });

  const { data: getIsolatedPoolsData, isLoading: isGetIsolatedPoolsDataLoading } =
    useGetIsolatedPools(
      {
        accountAddress,
      },
      {
        enabled:
          (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) &&
          corePoolComptrollerContractAddress !== poolComptrollerAddress &&
          !(poolComptrollerAddress === undefined),
      },
    );

  const isLoading = isGetLegacyPoolDataLoading || isGetIsolatedPoolsDataLoading;

  const data = useMemo(() => {
    if (isLoading) {
      return undefined;
    }

    const pools = (getLegacyPoolData?.pool ? [getLegacyPoolData?.pool] : []).concat(
      getIsolatedPoolsData?.pools || [],
    );

    return {
      pools,
    };
  }, [getLegacyPoolData?.pool, getIsolatedPoolsData?.pools, isLoading]);

  return { isLoading, data };
};

export default useGetPools;
