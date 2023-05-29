import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';

import { ApproveTokenInput, ApproveTokenOutput, approveToken, queryClient } from 'clients/api';
import { useTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useApproveToken = (
  { token }: { token: Token },
  options?: MutationObserverOptions<
    ApproveTokenOutput,
    Error,
    Omit<ApproveTokenInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(token);

  return useMutation(
    [FunctionKey.APPROVE_TOKEN, { token }],
    params =>
      approveToken({
        tokenContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { spenderAddress } = onSuccessParams[1];
        const accountAddress = await tokenContract.signer.getAddress();

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: token.address,
            spenderAddress,
            accountAddress,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useApproveToken;
