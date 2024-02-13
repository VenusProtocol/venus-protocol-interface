import { useAnalytics } from 'libs/analytics';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';

import { StakeInXvsVaultInput, queryClient, stakeInXvsVault } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { Token } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedStakeInXvsVaultInput = Omit<StakeInXvsVaultInput, 'xvsVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedStakeInXvsVaultInput>;

const useStakeInXvsVault = (
  { stakedToken, rewardToken }: { stakedToken: Token; rewardToken: Token },
  options?: Options,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.STAKE_IN_XVS_VAULT,
    fn: (input: TrimmedStakeInXvsVaultInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        stakeInXvsVault({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const { poolIndex, amountMantissa } = input;

      captureAnalyticEvent('Tokens staked in XVS vault', {
        poolIndex,
        rewardTokenSymbol: rewardToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: stakedToken,
          value: amountMantissa,
        }).toNumber(),
      });

      const accountAddress = await xvsVaultContract?.signer.getAddress();

      // Invalidate cached user info
      queryClient.invalidateQueries([
        FunctionKey.GET_XVS_VAULT_USER_INFO,
        {
          chainId,
          accountAddress,
          rewardTokenAddress: rewardToken.address,
          poolIndex,
        },
      ]);

      // Invalidate cached user balance
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress,
          tokenAddress: stakedToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId,
          tokenAddress: stakedToken.address,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

      // Invalidate cached vault data
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          chainId,
          accountAddress: xvsVaultContract?.address,
          tokenAddress: stakedToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_XVS_VAULT_POOL_INFOS,
        {
          chainId,
          rewardTokenAddress: rewardToken.address,
          poolIndex,
        },
      ]);

      // Invalidate cached Prime data
      queryClient.invalidateQueries([
        FunctionKey.GET_PRIME_STATUS,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_PRIME_TOKEN,
        {
          chainId,
          accountAddress,
        },
      ]);
    },
    options,
  });
};

export default useStakeInXvsVault;
