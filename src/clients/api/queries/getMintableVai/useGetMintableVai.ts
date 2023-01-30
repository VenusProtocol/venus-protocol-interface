import { QueryObserverOptions, useQuery } from 'react-query';

import getMintableVai, {
  GetMintableVaiInput,
  GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import { useVaiControllerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMintableVaiOutput,
  Error,
  GetMintableVaiOutput,
  GetMintableVaiOutput,
  [FunctionKey.GET_MINTABLE_VAI, Omit<GetMintableVaiInput, 'vaiControllerContract'>]
>;

const useGetMintableVai = (
  params: Omit<GetMintableVaiInput, 'vaiControllerContract'>,
  options?: Options,
) => {
  const vaiControllerContract = useVaiControllerContract();

  return useQuery(
    [FunctionKey.GET_MINTABLE_VAI, params],
    () => getMintableVai({ vaiControllerContract, ...params }),
    options,
  );
};

export default useGetMintableVai;
