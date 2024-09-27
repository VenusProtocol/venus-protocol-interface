import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getMintableVai, {
  type GetMintableVaiInput,
  type GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetVaiContract, useGetVaiControllerContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetMintableVaiInput = Omit<
  GetMintableVaiInput,
  'vaiControllerContract' | 'vaiContract'
> & {
  vai: Token;
};

export type UseGetMintableVaiQueryKey = [
  FunctionKey.GET_MINTABLE_VAI,
  TrimmedGetMintableVaiInput & { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetMintableVaiOutput | undefined,
  Error,
  GetMintableVaiOutput | undefined,
  GetMintableVaiOutput | undefined,
  UseGetMintableVaiQueryKey
>;

const useGetMintableVai = (
  { vai, ...input }: TrimmedGetMintableVaiInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();
  const { blockTimeMs } = useGetChainMetadata();
  const vaiContract = useGetVaiContract({
    address: vai.address,
    chainId,
    passSigner: false,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_MINTABLE_VAI, { ...input, vai, chainId }],

    queryFn: () =>
      callOrThrow({ vaiControllerContract, vaiContract }, params =>
        getMintableVai({
          ...params,
          ...input,
        }),
      ),

    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};

export default useGetMintableVai;
