import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { institutionalVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

type DepositToInstitutionalVaultInput = {
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<DepositToInstitutionalVaultInput>;

export const useDepositToInstitutionalVault = (
  { vaultAddress }: { vaultAddress: Address },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: ({ amountMantissa }: DepositToInstitutionalVaultInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: institutionalVaultAbi,
        address: vaultAddress,
        functionName: 'deposit' as const,
        args: [BigInt(amountMantissa.toFixed()), accountAddress] as const,
      } as WriteContractParameters<
        typeof institutionalVaultAbi,
        'deposit',
        readonly [bigint, Address],
        Chain,
        Account
      >;
    },
    onConfirmed: () => {
      captureAnalyticEvent('Institutional vault deposit', {
        vaultAddress,
      });

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS] });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_TOKEN_BALANCES, { chainId, accountAddress }],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_FIXED_RATED_VAULTS_USER_STAKED_TOKENS,
          {
            chainId,
            accountAddress,
          },
        ],
      });
    },
    options,
  });
};
