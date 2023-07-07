import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';

import {
  RevokeSpendingLimitInput,
  RevokeSpendingLimitOutput,
  queryClient,
  revokeSpendingLimit,
} from 'clients/api';
import { useTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useRevokeSpendingLimit = (
  { token }: { token: Token },
  options?: MutationObserverOptions<
    RevokeSpendingLimitOutput,
    Error,
    Omit<RevokeSpendingLimitInput, 'tokenContract'>
  >,
) => {
  const tokenContract = useTokenContract(token);

  return useMutation(
    [FunctionKey.REVOKE_SPENDING_LIMIT, { token }],
    params =>
      revokeSpendingLimit({
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

export default useRevokeSpendingLimit;
