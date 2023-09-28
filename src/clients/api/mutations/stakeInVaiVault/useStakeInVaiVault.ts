import { useGetVaiVaultContract } from 'packages/contractsNew';
import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import {
  StakeInVaiVaultInput,
  StakeInVaiVaultOutput,
  queryClient,
  stakeInVaiVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';
import useGetToken from 'hooks/useGetToken';

type TrimmedStakeInVaiVaultInput = Omit<StakeInVaiVaultInput, 'vaiVaultContract'>;
type Options = MutationObserverOptions<StakeInVaiVaultOutput, Error, TrimmedStakeInVaiVaultInput>;

const useStakeInVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetVaiVaultContract({
    passSigner: true,
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { captureAnalyticEvent } = useAnalytics();

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
        const { amountWei } = onSuccessParams[1];
        const accountAddress = await vaiVaultContract?.signer.getAddress();

        if (vai) {
          captureAnalyticEvent('Tokens staked in VAI vault', {
            tokenAmountTokens: convertWeiToTokens({
              token: vai,
              valueWei: amountWei,
            }).toNumber(),
          });

          // Invalidate cached user balance
          queryClient.invalidateQueries([
            FunctionKey.GET_BALANCE_OF,
            {
              accountAddress,
              tokenAddress: vai.address,
            },
          ]);

          queryClient.invalidateQueries([
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              tokenAddress: vai.address,
              accountAddress,
            },
          ]);

          // Invalidate cached vault data
          queryClient.invalidateQueries([
            FunctionKey.GET_BALANCE_OF,
            {
              accountAddress: vaiVaultContract?.address,
              tokenAddress: vai.address,
            },
          ]);
        }

        // Invalidate cached user info, including pending reward
        queryClient.invalidateQueries([FunctionKey.GET_VAI_VAULT_USER_INFO, accountAddress]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
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
