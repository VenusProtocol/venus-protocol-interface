import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import { type GetPrimeDistributionForMarketOutput, getPrimeDistributionForMarket } from '.';

interface UseGetPrimeDistributionForMarketInput {
  vTokenAddress: Address;
}

export type UseGetPrimeDistributionForMarketQueryKey = [
  FunctionKey.GET_PRIME_DISTRIBUTION_FOR_MARKET,
  UseGetPrimeDistributionForMarketInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPrimeDistributionForMarketOutput,
  Error,
  GetPrimeDistributionForMarketOutput,
  GetPrimeDistributionForMarketOutput,
  UseGetPrimeDistributionForMarketQueryKey
>;

export const useGetPrimeDistributionForMarket = (
  { vTokenAddress }: UseGetPrimeDistributionForMarketInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const { address: primeContractAddress } = useGetContractAddress({
    name: 'Prime',
  });
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_DISTRIBUTION_FOR_MARKET, { vTokenAddress, chainId }],

    queryFn: () =>
      callOrThrow({ vTokenAddress, primeContractAddress }, params =>
        getPrimeDistributionForMarket({ ...params, publicClient }),
      ),

    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isPrimeEnabled,
  });
};
