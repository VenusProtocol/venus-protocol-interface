import { useMutation, MutationObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import {
  queryClient,
  redeemUnderlying,
  IRedeemUnderlyingInput,
  RedeemUnderlyingOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';

const useRedeemUnderlying = (
  { assetId }: { assetId: VTokenId },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemUnderlyingOutput,
    Error,
    Omit<IRedeemUnderlyingInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(assetId);
  return useMutation(
    FunctionKey.REDEEM_UNDERLYING,
    params =>
      redeemUnderlying({
        tokenContract,
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
