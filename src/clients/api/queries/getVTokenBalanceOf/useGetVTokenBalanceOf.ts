import { useGetVTokenContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import getVTokenBalanceOf, {
  GetVTokenBalanceOfInput,
  GetVTokenBalanceOfOutput,
} from 'clients/api/queries/getVTokenBalanceOf';
import FunctionKey from 'constants/functionKey';

interface TrimmedGetVTokenBalanceOfInput extends Omit<GetVTokenBalanceOfInput, 'vTokenContract'> {
  vToken: VToken;
}

type Options = QueryObserverOptions<
  GetVTokenBalanceOfOutput,
  Error,
  GetVTokenBalanceOfOutput,
  GetVTokenBalanceOfOutput,
  [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress: string; vTokenAddress: string }]
>;

const useGetVTokenBalanceOf = (
  { accountAddress, vToken }: TrimmedGetVTokenBalanceOfInput,
  options?: Options,
) => {
  const vTokenContract = useGetVTokenContract({ vToken });

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress, vTokenAddress: vToken.address }],
    () =>
      callOrThrow({ vTokenContract }, params =>
        getVTokenBalanceOf({
          ...params,
          accountAddress,
        }),
      ),
    options,
  );
};

export default useGetVTokenBalanceOf;
