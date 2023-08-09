import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getMintableVai, {
  GetMintableVaiInput,
  GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedGetMintableVaiInput = Omit<GetMintableVaiInput, 'vaiControllerContract'>;
type Options = QueryObserverOptions<
  GetMintableVaiOutput | undefined,
  Error,
  GetMintableVaiOutput | undefined,
  GetMintableVaiOutput | undefined,
  [FunctionKey.GET_MINTABLE_VAI, TrimmedGetMintableVaiInput]
>;

const useGetMintableVai = (input: TrimmedGetMintableVaiInput, options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  return useQuery(
    [FunctionKey.GET_MINTABLE_VAI, input],
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
