import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContractAddress } from 'libs/contracts';
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
  const primeContractAddress = useGetPrimeContractAddress();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_PRIME_DISTRIBUTION_FOR_MARKET, { vTokenAddress, chainId }],

    queryFn: () =>
      callOrThrow({ vTokenAddress, primeContractAddress, publicClient }, params =>
        getPrimeDistributionForMarket(params),
      ),

    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isPrimeEnabled,
  });
};
