import { useQuery, QueryObserverOptions } from 'react-query';

import getVenusInitialIndex, {
  GetVenusInitialIndexOutput,
} from 'clients/api/queries/getVenusInitialIndex';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVenusInitialIndexOutput,
  Error,
  GetVenusInitialIndexOutput,
  GetVenusInitialIndexOutput,
  FunctionKey.GET_VENUS_INITIAL_INDEX
>;

const useGetVenusInitialIndex = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_INITIAL_INDEX,
    () => getVenusInitialIndex({ comptrollerContract }),
    options,
  );
};

export default useGetVenusInitialIndex;
