import {
  ExecuteWithdrawalFromXvsVaultInput,
  executeWithdrawalFromXvsVault,
  queryClient,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'packages/analytics';
import { useGetXvsVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedExecuteWithdrawalFromXvsVaultInput = Omit<
  ExecuteWithdrawalFromXvsVaultInput,
  'xvsVaultContract'
>;
type Options = UseSendTransactionOptions<TrimmedExecuteWithdrawalFromXvsVaultInput>;

const useExecuteWithdrawalFromXvsVault = (
  { stakedToken }: { stakedToken: Token },
  options?: Options,
) => {
  const xvsVaultContract = useGetXvsVaultContract({
    passSigner: true,
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
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
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          { accountAddress, rewardTokenAddress: xvs.address, poolIndex },
        ]);

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
          {
            rewardTokenAddress: xvs.address,
            poolIndex,
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_POOL_INFOS,
          { rewardTokenAddress: xvs.address, poolIndex },
        ]);
      }

      // Invalidate cached user balance
      queryClient.invalidateQueries([
        FunctionKey.GET_BALANCE_OF,
        {
          accountAddress,
          tokenAddress: stakedToken.address,
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
    },
    options,
  });
};

export default useExecuteWithdrawalFromXvsVault;
