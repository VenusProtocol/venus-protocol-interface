import { useGetTokenContract } from 'packages/contracts';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

import { ApproveTokenInput, approveToken, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedApproveTokenInput = Omit<ApproveTokenInput, 'tokenContract'>;
type Options = UseSendTransactionOptions<TrimmedApproveTokenInput>;

const useApproveToken = ({ token }: { token: Token }, options?: Options) => {
  const tokenContract = useGetTokenContract({ token, passSigner: true });

  return useSendTransaction({
    fnKey: [FunctionKey.APPROVE_TOKEN, { token }],
    fn: (input: TrimmedApproveTokenInput) =>
      callOrThrow({ tokenContract }, params =>
        approveToken({
          ...input,
          ...params,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const accountAddress = await tokenContract?.signer.getAddress();

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          tokenAddress: token.address,
          spenderAddress: input.spenderAddress,
          accountAddress,
        },
      ]);
    },
    options,
  });
};

export default useApproveToken;
