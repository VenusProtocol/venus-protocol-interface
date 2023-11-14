import { useAnalytics } from 'packages/analytics';
import { useGetVaiVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { StakeInVaiVaultInput, queryClient, stakeInVaiVault } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedStakeInVaiVaultInput = Omit<StakeInVaiVaultInput, 'vaiVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedStakeInVaiVaultInput>;

const useStakeInVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetVaiVaultContract({
    passSigner: true,
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.SET_VOTE_DELEGATE,
    fn: (input: TrimmedStakeInVaiVaultInput) =>
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
    onConfirmed: async ({ input }) => {
      const accountAddress = await vaiVaultContract?.signer.getAddress();

      if (vai) {
        captureAnalyticEvent('Tokens staked in VAI vault', {
          tokenAmountTokens: convertWeiToTokens({
            token: vai,
            value: input.amountWei,
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
    },
    options,
  });
};

export default useStakeInVaiVault;
