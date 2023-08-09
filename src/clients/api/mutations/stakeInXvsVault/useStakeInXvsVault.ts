import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

import {
  StakeInXvsVaultInput,
  StakeInXvsVaultOutput,
  queryClient,
  stakeInXvsVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedStakeInXvsVaultInput = Omit<StakeInXvsVaultInput, 'xvsVaultContract'>;
type Options = MutationObserverOptions<StakeInXvsVaultOutput, Error, TrimmedStakeInXvsVaultInput>;

const useStakeInXvsVault = ({ stakedToken }: { stakedToken: Token }, options?: Options) => {
  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

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
        const { poolIndex } = onSuccessParams[1];
        const accountAddress = await xvsVaultContract?.signer.getAddress();

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
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
          { rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeInXvsVault;
