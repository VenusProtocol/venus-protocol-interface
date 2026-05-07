import type BigNumber from 'bignumber.js';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { institutionalVaultAbi } from 'libs/contracts/abis/institutionalVaultAbi';
import { VError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet';
import type { Address } from 'viem';
import { invalidateInstitutionalVaultQueries } from '../invalidateInstitutionalVaultQueries';

type StakeIntoInstitutionalVaultInput = {
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<StakeIntoInstitutionalVaultInput>;

export const useStakeIntoInstitutionalVault = (
  { vaultAddress }: { vaultAddress: Address },
  options?: Partial<Options>,
) => {
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: ({ amountMantissa }: StakeIntoInstitutionalVaultInput) => {
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
      };
    },
    onConfirmed: () => {
      captureAnalyticEvent('Institutional vault deposit', {
        vaultAddress,
        accountAddress,
      });

      invalidateInstitutionalVaultQueries();
    },
    options,
  });
};
