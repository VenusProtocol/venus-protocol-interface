import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { type GetMintableVaiInput, type GetMintableVaiOutput, getMintableVai } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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

const useGetMintableVai = (
  { accountAddress }: UseGetMintableVaiInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const vaiControllerContractAddress = useGetVaiControllerContractAddress();
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

export default useGetMintableVai;
