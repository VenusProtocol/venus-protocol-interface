import { RevokeSpendingLimitInput, queryClient, revokeSpendingLimit } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useGetTokenContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedRevokeSpendingLimitInput = Omit<RevokeSpendingLimitInput, 'tokenContract'>;
type Options = UseSendTransactionOptions<TrimmedRevokeSpendingLimitInput>;

const useRevokeSpendingLimit = ({ token }: { token: Token }, options?: Options) => {
  const { chainId } = useChainId();
  const tokenContract = useGetTokenContract({
    token,
    passSigner: true,
  });

  return useSendTransaction({
    fnKey: [FunctionKey.REVOKE_SPENDING_LIMIT, { tokenAddress: token.address }],
    fn: (input: TrimmedRevokeSpendingLimitInput) =>
      callOrThrow({ tokenContract }, params =>
        revokeSpendingLimit({
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

export default useRevokeSpendingLimit;
