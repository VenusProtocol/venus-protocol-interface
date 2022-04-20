import { useMutation, MutationObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import {
  queryClient,
  redeemUnderlying,
  IRedeemUnderlyingInput,
  RedeemUnderlyingOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

const useRedeemUnderlying = (
  { assetId, account }: { assetId: VTokenId; account: string | undefined },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemUnderlyingOutput,
    Error,
    Omit<IRedeemUnderlyingInput, 'tokenContract' | 'account'>
  >,
) => {
  const tokenContract = useVTokenContract(assetId);
  return useMutation(
    FunctionKey.REDEEM_UNDERLYING,
    params =>
      redeemUnderlying({
        tokenContract,
        account,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_VTOKEN_BALANCES_ALL);
        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRedeemUnderlying;
