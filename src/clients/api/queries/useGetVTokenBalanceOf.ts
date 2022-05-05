import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenBalanceOf, {
  GetVTokenBalanceOfOutput,
  IGetVTokenBalanceOfInput,
} from 'clients/api/queries/getVTokenBalanceOf';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';

type Options = QueryObserverOptions<
  GetVTokenBalanceOfOutput,
  Error,
  GetVTokenBalanceOfOutput,
  GetVTokenBalanceOfOutput,
  [FunctionKey.GET_V_TOKEN_BALANCE, VTokenId]
>;

const useGetVTokenBalanceOf = (
  { account, vTokenId }: Omit<IGetVTokenBalanceOfInput, 'tokenContract'> & { vTokenId: VTokenId },
  options?: Options,
) => {
  const tokenContract = useVTokenContract(vTokenId as VTokenId);
  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, vTokenId],
    () => getVTokenBalanceOf({ tokenContract, account }),
    options,
  );
};

export default useGetVTokenBalanceOf;
