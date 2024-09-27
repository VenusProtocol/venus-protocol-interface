import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getApiPools, {
  type GetApiPoolsInput,
  type GetApiPoolsOutput,
} from 'clients/api/queries/getApiPools';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetApiPoolsInput = Omit<GetApiPoolsInput, 'xvs'>;

export type UseGetApiPoolsQueryKey = [FunctionKey.GET_POOLS, TrimmedGetApiPoolsInput];

type Options = QueryObserverOptions<
  GetApiPoolsOutput,
  Error,
  GetApiPoolsOutput,
  GetApiPoolsOutput,
  UseGetApiPoolsQueryKey
>;

const useGetApiPools = (options?: Options) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { chainId } = useChainId();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return useQuery({
    queryKey: [FunctionKey.GET_POOLS, { chainId, corePoolComptrollerContractAddress }],
    queryFn: () => callOrThrow({ chainId, corePoolComptrollerContractAddress, xvs }, getApiPools),
    ...options,
  });
};

export default useGetApiPools;
