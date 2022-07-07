import { useMutation, MutationObserverOptions } from 'react-query';
import { VBep20 } from 'types/contracts';
import { VTokenId } from 'types';
import queryClient from 'clients/api/queryClient';
import redeem, { IRedeemInput, RedeemOutput } from 'clients/api/mutations/redeem';

import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

const useRedeem = (
  { vTokenId, accountAddress }: { vTokenId: VTokenId; accountAddress: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemOutput,
    Error,
    Omit<IRedeemInput, 'tokenContract' | 'accountAddress'>
  >,
) => {
  const tokenContract = useVTokenContract(vTokenId);

  return useMutation(
    FunctionKey.REDEEM,
    params =>
      redeem({
        tokenContract: tokenContract as VBep20,
        accountAddress,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        queryClient.invalidateQueries([
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress,
            vTokenId,
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRedeem;
