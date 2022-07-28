import { MutationObserverOptions, useMutation } from 'react-query';
import { TokenId } from 'types';

import { ApproveTokenInput, ApproveTokenOutput, approveToken, queryClient } from 'clients/api';
import { useTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

import setCachedTokenAllowanceToMax from '../../queries/getAllowance/setCachedTokenAllowanceToMax';

const useApproveToken = (
  { tokenId }: { tokenId: TokenId },
  // TODO: use custom error type https://app.clickup.com/t/2rvwhnt
  options?: MutationObserverOptions<
    ApproveTokenOutput,
    Error,
    Omit<ApproveTokenInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(tokenId);

  return useMutation(
    [FunctionKey.APPROVE_TOKEN, { tokenId }],
    params =>
      approveToken({
        tokenContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        const { spenderAddress, accountAddress } = onSuccessParams[1];
        setCachedTokenAllowanceToMax({ queryClient, tokenId, spenderAddress, accountAddress });

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useApproveToken;
