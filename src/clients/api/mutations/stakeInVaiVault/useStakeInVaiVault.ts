import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  StakeInVaiVaultInput,
  StakeInVaiVaultOutput,
  queryClient,
  stakeInVaiVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedStakeInVaiVaultInput = Omit<StakeInVaiVaultInput, 'vaiVaultContract'>;
type Options = MutationObserverOptions<StakeInVaiVaultOutput, Error, TrimmedStakeInVaiVaultInput>;

const useStakeInVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetUniqueContract({
    name: 'vaiVault',
  });

  return useMutation(
    FunctionKey.STAKE_IN_VAI_VAULT,
    (input: TrimmedStakeInVaiVaultInput) =>
      callOrThrow(
        {
          vaiVaultContract,
        },
        params =>
          stakeInVaiVault({
            ...params,
            ...input,
          }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await vaiVaultContract?.signer.getAddress();

        // Invalidate cached user info, including pending reward
        queryClient.invalidateQueries([FunctionKey.GET_VAI_VAULT_USER_INFO, accountAddress]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: TOKENS.vai.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: TOKENS.vai.address,
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: vaiVaultContract?.address,
            tokenAddress: TOKENS.vai.address,
          },
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeInVaiVault;
