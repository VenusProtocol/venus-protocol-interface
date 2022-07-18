import { QueryObserverOptions, useQuery } from 'react-query';

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
  [FunctionKey.GET_V_TOKEN_BALANCES_ALL, Omit<IGetVTokenBalancesAllInput, 'venusLensContract'>]
>;

const useGetVTokenBalancesAll = (
  { account, vTokenAddresses }: Omit<IGetVTokenBalancesAllInput, 'venusLensContract'>,
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
