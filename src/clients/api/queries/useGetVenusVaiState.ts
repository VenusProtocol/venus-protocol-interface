import { useQuery, QueryObserverOptions } from 'react-query';

import getVenusVaiState, { IGetVenusVaiStateOutput } from 'clients/api/queries/getVenusVaiState';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  IGetVenusVaiStateOutput,
  Error,
  IGetVenusVaiStateOutput,
  IGetVenusVaiStateOutput,
  FunctionKey.GET_VENUS_VAI_STATE
>;

const useGetVenusVaiStateIndex = (options?: Options) => {
  const vaiUnitrollerContract = useVaiUnitrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_VAI_STATE,
    () => getVenusVaiState({ vaiUnitrollerContract }),
    options,
  );
};

export default useGetVenusVaiStateIndex;
