import { useQuery, QueryObserverOptions } from 'react-query';

import { getVTokenBalance, GetVTokenBalanceOutput, IGetVTokenBalanceInput } from 'clients/api';
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
  { account, assetId }: Omit<IGetVTokenBalanceInput, 'tokenContract'> & { assetId: VTokenId },
  options?: Options,
) => {
  const tokenContract = useVTokenContract(assetId as VTokenId);
  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, assetId],
    () => getVTokenBalance({ tokenContract, account }),
    options,
  );
};

export default useGetVTokenBalance;
