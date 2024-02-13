import { QueryObserverOptions, useQuery } from 'react-query';

import { GetPrimeDistributionForMarketOutput, getPrimeDistributionForMarket } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetPrimeContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

interface UseGetPrimeDistributionForMarketInput {
  vTokenAddress: string;
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

const useGetPrimeDistributionForMarket = (
  { vTokenAddress }: UseGetPrimeDistributionForMarketInput,
  options?: Options,
) => {
  const { chainId } = useChainId();
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });
  const primeContract = useGetPrimeContract();

  return useQuery(
    [FunctionKey.GET_PRIME_DISTRIBUTION_FOR_MARKET, { vTokenAddress, chainId }],
    () =>
      callOrThrow({ vTokenAddress, primeContract }, params =>
        getPrimeDistributionForMarket(params),
      ),
    {
      ...options,
      enabled: (options?.enabled === undefined || options?.enabled) && isPrimeEnabled,
    },
  );
};

export default useGetPrimeDistributionForMarket;
