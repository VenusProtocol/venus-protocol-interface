import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenBalanceOf, {
  GetVTokenBalanceOfInput,
  GetVTokenBalanceOfOutput,
} from 'clients/api/queries/getVTokenBalanceOf';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

interface TrimmedParams extends Omit<GetVTokenBalanceOfInput, 'vTokenContract'> {
  vTokenId: string;
}

type Options = QueryObserverOptions<
  GetVTokenBalanceOfOutput,
  Error,
  GetVTokenBalanceOfOutput,
  GetVTokenBalanceOfOutput,
  [FunctionKey.GET_V_TOKEN_BALANCE, TrimmedParams]
>;

const useGetVTokenBalanceOf = ({ accountAddress, vTokenId }: TrimmedParams, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress, vTokenId }],
    () => getVTokenBalanceOf({ vTokenContract, accountAddress }),
    options,
  );
};

export default useGetVTokenBalanceOf;
