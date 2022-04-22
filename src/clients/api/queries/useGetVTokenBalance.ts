import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenBalance, {
  GetVTokenBalanceOutput,
  IGetVTokenBalanceInput,
} from 'clients/api/queries/getVTokenBalance';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';

type Options = QueryObserverOptions<
  GetVTokenBalanceOutput,
  Error,
  GetVTokenBalanceOutput,
  GetVTokenBalanceOutput,
  [FunctionKey.GET_V_TOKEN_BALANCE, VTokenId]
>;

const useGetVTokenBalance = (
  { account, vTokenId }: Omit<IGetVTokenBalanceInput, 'tokenContract'> & { vTokenId: VTokenId },
  options?: Options,
) => {
  const tokenContract = useVTokenContract(vTokenId as VTokenId);
  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, vTokenId],
    () => getVTokenBalance({ tokenContract, account }),
    options,
  );
};

export default useGetVTokenBalance;
