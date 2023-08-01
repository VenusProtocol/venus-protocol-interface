import { QueryObserverOptions, useQuery } from 'react-query';

import getMintableVai, {
  GetMintableVaiInput,
  GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

type HandleGetMintableVaiInput = Omit<GetMintableVaiInput, 'vaiControllerContract'>;
type Options = QueryObserverOptions<
  GetMintableVaiOutput | undefined,
  Error,
  GetMintableVaiOutput | undefined,
  GetMintableVaiOutput | undefined,
  [FunctionKey.GET_MINTABLE_VAI, HandleGetMintableVaiInput]
>;

const useGetMintableVai = (params: HandleGetMintableVaiInput, options?: Options) => {
  const vaiControllerContract = useGetUniqueContract({
    name: 'vaiController',
  });

  const handleGetMintableVai = async () => {
    if (!vaiControllerContract) {
      logError('Contract infos missing for getMintableVai query function call');
      return undefined;
    }

    return getMintableVai({ vaiControllerContract, ...params });
  };

  return useQuery([FunctionKey.GET_MINTABLE_VAI, params], handleGetMintableVai, options);
};

export default useGetMintableVai;
