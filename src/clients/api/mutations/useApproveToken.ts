import { useMutation, MutationObserverOptions } from 'react-query';

import { TokenId } from 'types';
import { queryClient, approveToken, IApproveTokenInput, ApproveTokenOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';

const useApproveToken = (
  { assetId }: { assetId: TokenId },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    ApproveTokenOutput,
    Error,
    Omit<IApproveTokenInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(assetId);
  return useMutation(
    FunctionKey.APPROVE_TOKEN,
    params =>
      approveToken({
        tokenContract,
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

export default useApproveToken;
