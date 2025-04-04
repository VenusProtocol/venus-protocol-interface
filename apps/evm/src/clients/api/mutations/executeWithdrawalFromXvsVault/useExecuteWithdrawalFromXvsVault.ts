import {
  type ExecuteWithdrawalFromXvsVaultInput,
  executeWithdrawalFromXvsVault,
  queryClient,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedExecuteWithdrawalFromXvsVaultInput = Omit<
  ExecuteWithdrawalFromXvsVaultInput,
  'xvsVaultContract'
>;
type Options = UseSendTransactionOptions<TrimmedExecuteWithdrawalFromXvsVaultInput>;

const useExecuteWithdrawalFromXvsVault = (
  { stakedToken }: { stakedToken: Token },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: TrimmedExecuteWithdrawalFromXvsVaultInput) =>
      callOrThrow({ xvsVaultContract }, params =>
        executeWithdrawalFromXvsVault({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const { poolIndex } = input;
      const accountAddress = await xvsVaultContract?.signer.getAddress();

      if (xvs) {
        captureAnalyticEvent('Token withdrawals executed from XVS vault', {
          poolIndex,
          rewardTokenSymbol: xvs.symbol,
        });

        // Invalidate cached user info
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_USER_INFO,
            {
              chainId,
              accountAddress,
              rewardTokenAddress: xvs.address,
              poolIndex,
            },
          ],
        });

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
            {
              chainId,
              rewardTokenAddress: xvs.address,
              poolIndex,
              accountAddress,
            },
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_POOL_INFOS,
            {
              chainId,
              rewardTokenAddress: xvs.address,
              poolIndex,
            },
          ],
        });
      }

      // Invalidate cached user balance
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: stakedToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      // Invalidate cached vault data
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress: xvsVaultContract?.address,
            tokenAddress: stakedToken.address,
          },
        ],
      });
    },
    options,
  });
};

export default useExecuteWithdrawalFromXvsVault;
