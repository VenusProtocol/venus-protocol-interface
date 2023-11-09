import { useGetVaiControllerContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getMintableVai, {
  GetMintableVaiInput,
  GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetMintableVaiInput = Omit<GetMintableVaiInput, 'vaiControllerContract'>;

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

const useGetMintableVai = (input: TrimmedGetMintableVaiInput, options?: Options) => {
  const { chainId } = useAuth();
  const vaiControllerContract = useGetVaiControllerContract();

  return useQuery(
    [FunctionKey.GET_MINTABLE_VAI, { ...input, chainId }],
    () =>
      callOrThrow({ vaiControllerContract }, params =>
        getMintableVai({
          ...params,
          ...input,
        }),
      ),
    options,
  );
};

export default useGetMintableVai;
