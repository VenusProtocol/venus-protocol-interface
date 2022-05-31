import { useQuery, QueryObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import getVTokenCash, { GetVTokenCashOutput } from 'clients/api/queries/getVTokenCash';
import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVTokenCashOutput,
  Error,
  GetVTokenCashOutput,
  GetVTokenCashOutput,
  [FunctionKey.GET_V_TOKEN_CASH, VTokenId]
>;

const useGetVTokenCash = ({ vTokenId }: { vTokenId: VTokenId }, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_CASH, vTokenId],
    () => getVTokenCash({ vTokenContract }),
    options,
  );
};

export default useGetVTokenCash;
