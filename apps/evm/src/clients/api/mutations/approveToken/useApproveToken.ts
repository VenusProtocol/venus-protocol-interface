import { type ApproveTokenInput, approveToken, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedApproveTokenInput = Omit<ApproveTokenInput, 'tokenContract'>;
type Options = UseSendTransactionOptions<TrimmedApproveTokenInput>;

const useApproveToken = ({ token }: { token: Token }, options?: Options) => {
  const { chainId } = useChainId();
  const tokenContract = useGetTokenContract({ token, passSigner: true });

  return useSendTransaction({
    fnKey: [FunctionKey.APPROVE_TOKEN, { tokenAddress: token.address }],
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
          chainId,
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
