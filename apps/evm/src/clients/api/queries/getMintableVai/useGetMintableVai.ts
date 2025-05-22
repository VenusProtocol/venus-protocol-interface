import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetToken } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetMintableVaiInput, type GetMintableVaiOutput, getMintableVai } from '.';

export interface UseGetMintableVaiInput
  extends Omit<
    GetMintableVaiInput,
    'publicClient' | 'vaiControllerContractAddress' | 'vaiAddress'
  > {}

export type UseGetMintableVaiQueryKey = [
  FunctionKey.GET_MINTABLE_VAI,
  UseGetMintableVaiInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetMintableVaiOutput,
  Error,
  GetMintableVaiOutput,
  GetMintableVaiOutput,
  UseGetMintableVaiQueryKey
>;

export const useGetMintableVai = (
  { accountAddress }: UseGetMintableVaiInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: vaiControllerContractAddress } = useGetContractAddress({
    name: 'VaiController',
  });
  const vai = useGetToken({
    symbol: 'VAI',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_MINTABLE_VAI, { accountAddress, chainId }],
    queryFn: () =>
      callOrThrow({ vaiControllerContractAddress, vaiAddress: vai?.address }, params =>
        getMintableVai({
          accountAddress,
          publicClient,
          ...params,
        }),
      ),
    ...options,
  });
};
