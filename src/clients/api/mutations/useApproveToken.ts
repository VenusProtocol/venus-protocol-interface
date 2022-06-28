import { useMutation, MutationObserverOptions } from 'react-query';

import { TokenId } from 'types';
import { queryClient, approveToken, IApproveTokenInput, ApproveTokenOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';
import setCachedTokenAllowanceToMax from '../queries/getAllowance/setCachedTokenAllowanceToMax';

const useApproveToken = (
  { tokenId }: { tokenId: TokenId },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    ApproveTokenOutput,
    Error,
    Omit<IApproveTokenInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(tokenId);

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
        setCachedTokenAllowanceToMax({ queryClient, tokenId });

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useApproveToken;
