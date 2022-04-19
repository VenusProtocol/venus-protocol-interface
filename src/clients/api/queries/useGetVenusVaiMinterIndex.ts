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
  FunctionKey.GET_VENUS_VAI_MINTER_INDEX
>;

const useGetVenusVaiMinterIndex = (accountAddress: string, options?: Options) => {
  const vaiUnitrollerContract = useVaiUnitrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_VAI_MINTER_INDEX,
    () => getVenusVaiMinterIndex({ accountAddress, vaiUnitrollerContract }),
    options,
  );
};

export default useGetVenusVaiMinterIndex;
