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
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(FunctionKey.GET_VTOKEN_BALANCES_ALL);
        if (options?.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      },
    },
  );
};

export default useApproveToken;
