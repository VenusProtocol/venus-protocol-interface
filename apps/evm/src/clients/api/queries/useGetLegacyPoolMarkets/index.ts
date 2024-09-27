import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetApiMarketsOutput, getApiMarkets } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetApiMarketsOutput,
  Error,
  GetApiMarketsOutput,
  GetApiMarketsOutput,
  [FunctionKey.GET_LEGACY_CORE_POOL_MARKETS]
>;

const useGetLegacyPoolMarkets = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const isQueryEnabled =
    (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) && !!options?.enabled;

  return useQuery({
    queryKey: [FunctionKey.GET_LEGACY_CORE_POOL_MARKETS],
    queryFn: () =>
      callOrThrow(
        { xvs, chainId, poolComptrollerAddress: corePoolComptrollerContractAddress },
        getApiMarkets,
      ),
    ...options,
    enabled: isQueryEnabled,
  });
};

export default useGetLegacyPoolMarkets;
