import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenCash, { GetVTokenCashOutput } from 'clients/api/queries/getVTokenCash';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVTokenCashOutput,
  Error,
  GetVTokenCashOutput,
  GetVTokenCashOutput,
  [FunctionKey.GET_V_TOKEN_CASH, string]
>;

const useGetVTokenCash = ({ vTokenId }: { vTokenId: string }, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_CASH, vTokenId],
    () => getVTokenCash({ vTokenContract }),
    options,
  );
};

export default useGetVTokenCash;
