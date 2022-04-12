import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenBalancesAll, {
  IGetVTokenBalancesAllInput,
  IGetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import { useVenusLens } from 'hooks/useContract';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVTokenBalancesAllOutput,
  Error,
  IGetVTokenBalancesAllOutput,
  IGetVTokenBalancesAllOutput,
  FunctionKey.GET_VTOKEN_BALANCES_ALL
>;

const useGetVTokenBalancesAll = (
  { account, vtAddresses }: Omit<IGetVTokenBalancesAllInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLens();
  return useQuery(
    FunctionKey.GET_VTOKEN_BALANCES_ALL,
    () => getVTokenBalancesAll({ venusLensContract, account, vtAddresses }),
    options,
  );
};

export default useGetVTokenBalancesAll;
