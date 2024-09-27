import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getXvsVaultPoolCount, {
  type GetXvsVaultPoolCountOutput,
} from 'clients/api/queries/getXvsVaultPoolCount';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

export type UseGetXvsVaultPoolCountQueryKey = [
  FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
  { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetXvsVaultPoolCountOutput,
  Error,
  GetXvsVaultPoolCountOutput,
  GetXvsVaultPoolCountOutput,
  UseGetXvsVaultPoolCountQueryKey
>;

const useGetXvsVaultPoolCount = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOLS_COUNT, { chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContract, xvsTokenAddress: xvs?.address }, getXvsVaultPoolCount),
    ...options,
  });
};

export default useGetXvsVaultPoolCount;
