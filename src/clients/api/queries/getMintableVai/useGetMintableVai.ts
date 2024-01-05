import { QueryObserverOptions, useQuery } from 'react-query';

import getMintableVai, {
  GetMintableVaiInput,
  GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetVaiContract, useGetVaiControllerContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId, Token } from 'types';
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

const useGetMintableVai = ({ vai, ...input }: TrimmedGetMintableVaiInput, options?: Options) => {
  const { chainId } = useChainId();
  const vaiControllerContract = useGetVaiControllerContract();
  const { blockTimeMs } = useGetChainMetadata();
  const vaiContract = useGetVaiContract({
    address: vai.address,
    chainId,
    passSigner: false,
  });

  return useQuery(
    [FunctionKey.GET_MINTABLE_VAI, { ...input, vai, chainId }],
    () =>
      callOrThrow({ vaiControllerContract, vaiContract }, params =>
        getMintableVai({
          ...params,
          ...input,
        }),
      ),
    {
      refetchInterval: blockTimeMs * 3,
      ...options,
    },
  );
};

export default useGetMintableVai;
