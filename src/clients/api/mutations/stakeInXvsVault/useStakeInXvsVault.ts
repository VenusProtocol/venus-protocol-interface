import { useGetXvsVaultContract } from 'packages/contracts';
import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import {
  StakeInXvsVaultInput,
  StakeInXvsVaultOutput,
  queryClient,
  stakeInXvsVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAnalytics } from 'context/Analytics';

type TrimmedStakeInXvsVaultInput = Omit<StakeInXvsVaultInput, 'xvsVaultContract'>;
type Options = MutationObserverOptions<StakeInXvsVaultOutput, Error, TrimmedStakeInXvsVaultInput>;

const useStakeInXvsVault = (
  { stakedToken, rewardToken }: { stakedToken: Token; rewardToken: Token },
  options?: Options,
) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useMutation(
    FunctionKey.STAKE_IN_XVS_VAULT,
    (input: TrimmedStakeInXvsVaultInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        stakeInXvsVault({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { poolIndex, amountWei } = onSuccessParams[1];

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

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeInXvsVault;
