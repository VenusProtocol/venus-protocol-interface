import { useQuery, QueryObserverOptions } from 'react-query';

import getVenusVaiMinterIndex, {
  GetVenusVaiMinterIndexOutput,
} from 'clients/api/queries/getVenusVaiMinterIndex';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVenusVaiMinterIndexOutput,
  Error,
  GetVenusVaiMinterIndexOutput,
  GetVenusVaiMinterIndexOutput,
  FunctionKey.GET_VENUS_INITIAL_INDEX
>;

const useGetVenusInitialIndex = (accountAddress: string, options?: Options) => {
  const vaiUnitrollerContract = useVaiUnitrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_INITIAL_INDEX,
    () => getVenusVaiMinterIndex({ accountAddress, vaiUnitrollerContract }),
    options,
  );
};

export default useGetVenusInitialIndex;
