import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenBalanceOf, {
  GetVTokenBalanceOfInput,
  GetVTokenBalanceOfOutput,
} from 'clients/api/queries/getVTokenBalanceOf';
import FunctionKey from 'constants/functionKey';
import { useGetVTokenContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId, VToken } from 'types';
import { callOrThrow } from 'utilities';

interface TrimmedGetVTokenBalanceOfInput extends Omit<GetVTokenBalanceOfInput, 'vTokenContract'> {
  vToken: VToken;
}

export type UseGetVTokenBalanceOfQueryKey = [
  FunctionKey.GET_V_TOKEN_BALANCE,
  Omit<TrimmedGetVTokenBalanceOfInput, 'vToken'> & {
    vTokenAddress: string;
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVTokenBalanceOfOutput,
  Error,
  GetVTokenBalanceOfOutput,
  GetVTokenBalanceOfOutput,
  UseGetVTokenBalanceOfQueryKey
>;

const useGetVTokenBalanceOf = (
  { accountAddress, vToken }: TrimmedGetVTokenBalanceOfInput,
  options?: Options,
) => {
  const { chainId } = useChainId();
  const vTokenContract = useGetVTokenContract({ vToken });

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress, vTokenAddress: vToken.address, chainId }],
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
