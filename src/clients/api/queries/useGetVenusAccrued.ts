import { useQuery, QueryObserverOptions } from 'react-query';

import getVenusAccrued, { GetVenusAccruedOutput } from 'clients/api/queries/getVenusAccrued';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVenusAccruedOutput,
  Error,
  GetVenusAccruedOutput,
  GetVenusAccruedOutput,
  FunctionKey.GET_VENUS_ACCRUED
>;

const useGetVenusInitialIndex = (accountAddress: string, options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_ACCRUED,
    () => getVenusAccrued({ accountAddress, comptrollerContract }),
    options,
  );
};

export default useGetVenusInitialIndex;
