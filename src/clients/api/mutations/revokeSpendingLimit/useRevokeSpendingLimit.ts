import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

import {
  RevokeSpendingLimitInput,
  RevokeSpendingLimitOutput,
  queryClient,
  revokeSpendingLimit,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import useGetTokenContract from 'hooks/useGetTokenContract';

type TrimmedRevokeSpendingLimitInput = Omit<RevokeSpendingLimitInput, 'tokenContract'>;
type Options = MutationObserverOptions<
  RevokeSpendingLimitOutput,
  Error,
  TrimmedRevokeSpendingLimitInput
>;

const useRevokeSpendingLimit = ({ token }: { token: Token }, options?: Options) => {
  const tokenContract = useGetTokenContract({
    token,
    passSigner: true,
  });

  return useMutation(
    [FunctionKey.REVOKE_SPENDING_LIMIT, { token }],
    (input: TrimmedRevokeSpendingLimitInput) =>
      callOrThrow({ tokenContract }, params =>
        revokeSpendingLimit({
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

export default useRevokeSpendingLimit;
