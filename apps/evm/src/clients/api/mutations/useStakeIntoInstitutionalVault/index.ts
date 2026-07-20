import type BigNumber from 'bignumber.js';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { institutionalVaultAbi } from 'libs/contracts/abis/institutionalVaultAbi';
import { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type Address, keccak256, toBytes } from 'viem';
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
  const { t } = useTranslation();

  return useSendTransaction({
    fn: ({ amountMantissa }: StakeIntoInstitutionalVaultInput) => {
      if (!accountAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      // Hash the exact disclaimer the user was shown (in their language), with the i18n component
      // markup stripped, and record it on-chain alongside the supply as the consent record. Hashing
      // the live text means the on-chain hash always matches the displayed copy, even if it changes.
      const disclaimer = t('vault.modals.institutionalTcsAgreement').replace(
        /<\/?[a-zA-Z][^>]*>/g,
        '',
      );
      const consentHash = keccak256(toBytes(disclaimer));

      return {
        abi: institutionalVaultAbi,
        address: vaultAddress,
        functionName: 'depositWithConsent' as const,
        args: [BigInt(amountMantissa.toFixed()), accountAddress, consentHash] as const,
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
