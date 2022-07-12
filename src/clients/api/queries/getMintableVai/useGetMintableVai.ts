import { useQuery, QueryObserverOptions } from 'react-query';
import getMintableVai, {
  GetMintableVaiInput,
  GetMintableVaiOutput,
} from 'clients/api/queries/getMintableVai';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

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
  const vaiControllerContract = useVaiUnitrollerContract();

  return useQuery(
    [FunctionKey.GET_MINTABLE_VAI, params],
    () => getMintableVai({ vaiControllerContract, ...params }),
    options,
  );
};

export default useGetMintableVai;
