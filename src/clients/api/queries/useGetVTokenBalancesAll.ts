import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenBalancesAll, {
  IGetVTokenBalancesAllInput,
  IGetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVTokenBalancesAllOutput,
  Error,
  IGetVTokenBalancesAllOutput,
  IGetVTokenBalancesAllOutput,
  [FunctionKey.GET_V_TOKEN_BALANCES_ALL, string]
>;

const useGetVTokenBalancesAll = (
  { account, vtAddresses }: Omit<IGetVTokenBalancesAllInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLensContract();
  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCES_ALL, account],
    () => getVTokenBalancesAll({ venusLensContract, account, vtAddresses }),
    options,
  );
};

export default useGetVTokenBalancesAll;
