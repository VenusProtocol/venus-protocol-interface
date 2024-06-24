import { type QueryObserverOptions, useQuery } from 'react-query';

import getApiPools, { type GetApiPoolsOutput } from 'clients/api/queries/getApiPools';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetApiPoolsOutput,
  Error,
  GetApiPoolsOutput,
  GetApiPoolsOutput,
  FunctionKey.GET_POOLS
>;

const useGetApiPools = (options?: Options) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return useQuery(
    FunctionKey.GET_POOLS,
    () => callOrThrow({ chainId, corePoolComptrollerContractAddress, xvs }, getApiPools),
    options,
  );
};

export default useGetApiPools;
