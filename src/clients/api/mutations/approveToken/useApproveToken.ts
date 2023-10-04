import { useGetTokenContract } from 'packages/contracts';
import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

import { ApproveTokenInput, ApproveTokenOutput, approveToken, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type TrimmedApproveTokenInput = Omit<ApproveTokenInput, 'tokenContract'>;
type Options = MutationObserverOptions<ApproveTokenOutput, Error, TrimmedApproveTokenInput>;

const useApproveToken = ({ token }: { token: Token }, options?: Options) => {
  const tokenContract = useGetTokenContract({ token, passSigner: true });

  return useMutation(
    [FunctionKey.APPROVE_TOKEN, { token }],
    (input: TrimmedApproveTokenInput) =>
      callOrThrow({ tokenContract }, params =>
        approveToken({
          ...input,
          ...params,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { spenderAddress } = onSuccessParams[1];
        const accountAddress = await tokenContract?.signer.getAddress();

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
