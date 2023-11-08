import { useAnalytics } from 'packages/analytics';
import { useGetXvsVaultContract } from 'packages/contracts';
import { Token } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { StakeInXvsVaultInput, queryClient, stakeInXvsVault } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedStakeInXvsVaultInput = Omit<StakeInXvsVaultInput, 'xvsVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedStakeInXvsVaultInput>;

const useStakeInXvsVault = (
  { stakedToken, rewardToken }: { stakedToken: Token; rewardToken: Token },
  options?: Options,
) => {
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
      const { poolIndex, amountWei } = input;

      captureAnalyticEvent('Tokens staked in XVS vault', {
        poolIndex,
        rewardTokenSymbol: rewardToken.symbol,
        tokenAmountTokens: convertWeiToTokens({
          token: stakedToken,
          valueWei: amountWei,
        }).toNumber(),
      });

      const accountAddress = await xvsVaultContract?.signer.getAddress();

      // Invalidate cached user info
      queryClient.invalidateQueries([
        FunctionKey.GET_XVS_VAULT_USER_INFO,
        { accountAddress, rewardTokenAddress: rewardToken.address, poolIndex },
      ]);

      // Invalidate cached user balance
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          accountAddress,
          tokenAddress: stakedToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          tokenAddress: stakedToken.address,
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
          accountAddress: xvsVaultContract?.address,
          tokenAddress: stakedToken.address,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_XVS_VAULT_POOL_INFOS,
        { rewardTokenAddress: rewardToken.address, poolIndex },
      ]);

      // Invalidate cached Prime data
      queryClient.invalidateQueries([
        FunctionKey.GET_PRIME_STATUS,
        {
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_PRIME_TOKEN,
        {
          accountAddress,
        },
      ]);
    },
    options,
  });
};

export default useStakeInXvsVault;
