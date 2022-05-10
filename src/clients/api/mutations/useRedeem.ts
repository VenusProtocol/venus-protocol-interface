import { useMutation, MutationObserverOptions } from 'react-query';
import { VBep20 } from 'types/contracts';
import { VTokenId } from 'types';
import queryClient from 'clients/api/queryClient';
import redeem, { IRedeemInput, RedeemOutput } from 'clients/api/mutations/redeem';

import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

const useRedeem = (
  { assetId, account }: { assetId: VTokenId; account: string },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    RedeemOutput,
    Error,
    Omit<IRedeemInput, 'tokenContract' | 'account'>
  >,
) => {
  const tokenContract = useVTokenContract(assetId);
  return useMutation(
    FunctionKey.REDEEM,
    params =>
      redeem({
        tokenContract: tokenContract as VBep20,
        account,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_V_TOKEN_BALANCES_ALL);
        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRedeem;
