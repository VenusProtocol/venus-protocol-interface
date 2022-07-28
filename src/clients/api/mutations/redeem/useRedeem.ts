import { MutationObserverOptions, useMutation } from 'react-query';
import { VTokenId } from 'types';

import redeem, { RedeemInput, RedeemOutput } from 'clients/api/mutations/redeem';
import queryClient from 'clients/api/queryClient';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { VBep20 } from 'types/contracts';

const useRedeem = (
  { vTokenId, accountAddress }: { vTokenId: VTokenId; accountAddress: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemOutput,
    Error,
    Omit<RedeemInput, 'tokenContract' | 'accountAddress'>
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
