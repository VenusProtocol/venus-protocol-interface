import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenBalanceOf, {
  GetVTokenBalanceOfOutput,
  IGetVTokenBalanceOfInput,
} from 'clients/api/queries/getVTokenBalanceOf';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';

interface TrimmedParams extends Omit<IGetVTokenBalanceOfInput, 'vTokenContract'> {
  vTokenId: VTokenId;
}

type Options = QueryObserverOptions<
  GetVTokenBalanceOfOutput,
  Error,
  GetVTokenBalanceOfOutput,
  GetVTokenBalanceOfOutput,
  [FunctionKey.GET_V_TOKEN_BALANCE, TrimmedParams]
>;

const useGetVTokenBalanceOf = ({ accountAddress, vTokenId }: TrimmedParams, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId as VTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress, vTokenId }],
    () => getVTokenBalanceOf({ vTokenContract, accountAddress }),
    options,
  );
};

export default useGetVTokenBalanceOf;
