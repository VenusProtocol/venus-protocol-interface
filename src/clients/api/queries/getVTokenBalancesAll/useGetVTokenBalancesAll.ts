import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenBalancesAll, {
  GetVTokenBalancesAllInput,
  IGetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVTokenBalancesAllOutput,
  Error,
  IGetVTokenBalancesAllOutput,
  IGetVTokenBalancesAllOutput,
  [FunctionKey.GET_V_TOKEN_BALANCES_ALL, Omit<GetVTokenBalancesAllInput, 'venusLensContract'>]
>;

const useGetVTokenBalancesAll = (
  { account, vTokenAddresses }: Omit<GetVTokenBalancesAllInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLensContract();
  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCES_ALL, { account, vTokenAddresses }],
    () => getVTokenBalancesAll({ venusLensContract, account, vTokenAddresses }),
    options,
  );
};

export default useGetVTokenBalancesAll;
