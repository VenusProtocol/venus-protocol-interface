import { useQueries } from '@tanstack/react-query';
import { chains } from '@venusprotocol/chains';

import FunctionKey from 'constants/functionKey';
import { ISOLATED_POOL_CHAIN_IDS } from 'constants/isolatedPoolChains';
import { getContractAddress } from 'libs/contracts';
import { useAccountAddress, usePublicClients } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { getHasIsolatedPoolPosition } from '.';

export interface UseGetChainIdsWithIsolatedPoolPositionOutput {
  chainIds: ChainId[];
  isLoading: boolean;
}

export const useGetChainIdsWithIsolatedPoolPosition = () => {
  const { accountAddress } = useAccountAddress();
  const { publicClients } = usePublicClients({ chainIds: ISOLATED_POOL_CHAIN_IDS });

  const queryableChainIds = ISOLATED_POOL_CHAIN_IDS.filter(chainId => !!publicClients[chainId]);

  const results = useQueries({
    queries: queryableChainIds.map(chainId => {
      const poolLensContractAddress = getContractAddress({ name: 'PoolLens', chainId });
      const poolRegistryContractAddress = getContractAddress({ name: 'PoolRegistry', chainId });

      return {
        queryKey: [FunctionKey.GET_HAS_ISOLATED_POOL_POSITION, { chainId, accountAddress }],
        queryFn: () =>
          callOrThrow(
            {
              publicClient: publicClients[chainId],
              accountAddress,
              poolLensContractAddress,
              poolRegistryContractAddress,
            },
            params =>
              getHasIsolatedPoolPosition({
                ...params,
                corePoolComptrollerContractAddress:
                  chains[chainId].corePoolComptrollerContractAddress,
              }),
          ),
        enabled: !!accountAddress && !!poolLensContractAddress && !!poolRegistryContractAddress,
      };
    }),
  });

  const output: UseGetChainIdsWithIsolatedPoolPositionOutput = {
    chainIds: queryableChainIds.filter((_chainId, index) => results[index]?.data?.hasPosition),
    isLoading: results.some(result => result.isLoading),
  };

  return output;
};
