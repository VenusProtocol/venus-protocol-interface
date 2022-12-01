import { MutationObserverOptions, useMutation } from 'react-query';
import { VToken } from 'types';

import redeemUnderlying, {
  RedeemUnderlyingInput,
  RedeemUnderlyingOutput,
} from 'clients/api/mutations/redeemUnderlying';
import queryClient from 'clients/api/queryClient';
import { useVTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useRedeemUnderlying = (
  { vToken, accountAddress }: { vToken: VToken; accountAddress: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemUnderlyingOutput,
    Error,
    Omit<RedeemUnderlyingInput, 'vTokenContract' | 'accountAddress'>
  >,
) => {
  const vTokenContract = useVTokenContract(vToken);

  return useMutation(
    FunctionKey.REDEEM_UNDERLYING,
    params =>
      redeemUnderlying({
        vTokenContract,
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
            vTokenAddress: vToken.address,
          },
        ]);
        queryClient.invalidateQueries(FunctionKey.GET_ASSETS_IN_ACCOUNT);
        queryClient.invalidateQueries(FunctionKey.GET_MARKETS);
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_DAILY_XVS);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRedeemUnderlying;
