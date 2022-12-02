import { QueryObserverOptions, useQuery } from 'react-query';
import { VToken } from 'types';

import getVTokenBalanceOf, {
  GetVTokenBalanceOfInput,
  GetVTokenBalanceOfOutput,
} from 'clients/api/queries/getVTokenBalanceOf';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

interface TrimmedParams extends Omit<GetVTokenBalanceOfInput, 'vTokenContract'> {
  vToken: VToken;
}

type Options = QueryObserverOptions<
  GetVTokenBalanceOfOutput,
  Error,
  GetVTokenBalanceOfOutput,
  GetVTokenBalanceOfOutput,
  [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress: string; vTokenAddress: string }]
>;

const useGetVTokenBalanceOf = ({ accountAddress, vToken }: TrimmedParams, options?: Options) => {
  const vTokenContract = useVTokenContract(vToken);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress, vTokenAddress: vToken.address }],
    () => getVTokenBalanceOf({ vTokenContract, accountAddress }),
    options,
  );
};

export default useGetVTokenBalanceOf;
