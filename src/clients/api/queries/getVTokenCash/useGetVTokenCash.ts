import { QueryObserverOptions, useQuery } from 'react-query';
import { VToken } from 'types';

import getVTokenCash, { GetVTokenCashOutput } from 'clients/api/queries/getVTokenCash';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVTokenCashOutput,
  Error,
  GetVTokenCashOutput,
  GetVTokenCashOutput,
  [FunctionKey.GET_V_TOKEN_CASH, { vTokenAddress: string }]
>;

const useGetVTokenCash = ({ vToken }: { vToken: VToken }, options?: Options) => {
  const vTokenContract = useVTokenContract(vToken);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_CASH, { vTokenAddress: vToken.address }],
    () => getVTokenCash({ vTokenContract }),
    options,
  );
};

export default useGetVTokenCash;
