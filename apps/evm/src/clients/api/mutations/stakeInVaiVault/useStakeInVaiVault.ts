import { type StakeInVaiVaultInput, queryClient, stakeInVaiVault } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetVaiVaultContract } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedStakeInVaiVaultInput = Omit<StakeInVaiVaultInput, 'vaiVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedStakeInVaiVaultInput>;

const useStakeInVaiVault = (options?: Options) => {
  const { chainId } = useChainId();
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
          tokenAmountTokens: convertMantissaToTokens({
            token: vai,
            value: input.amountMantissa,
          }).toNumber(),
        });

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: vai.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: vai.address,
            accountAddress,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress: vaiVaultContract?.address,
            tokenAddress: vai.address,
          },
        ]);
      }

      // Invalidate cached user info, including pending reward
      queryClient.invalidateQueries([
        FunctionKey.GET_VAI_VAULT_USER_INFO,
        { chainId, accountAddress },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE);
    },
    options,
  });
};

export default useStakeInVaiVault;
