import type { Address } from 'viem';

import type { GetInstitutionalVaultUserMetricsOutput } from '.';
import {
  type UseGetInstitutionalVaultUserDataOptions,
  useGetInstitutionalVaultUserData,
} from '../getInstitutionalVaultUserData/useGetInstitutionalVaultUserData';

export interface UseGetInstitutionalVaultUserMetricsInput {
  vaultAddresses: Address[];
}

export const useGetInstitutionalVaultUserMetrics = (
  { vaultAddresses }: UseGetInstitutionalVaultUserMetricsInput,
  options?: Partial<
    UseGetInstitutionalVaultUserDataOptions<GetInstitutionalVaultUserMetricsOutput>
  >,
) =>
  useGetInstitutionalVaultUserData(
    { vaultAddresses },
    {
      ...options,
      select: userData =>
        userData.map(({ vaultAddress, maxRedeemAmountMantissa, maxWithdrawAmountMantissa }) => ({
          vaultAddress,
          maxRedeemAmountMantissa,
          maxWithdrawAmountMantissa,
        })),
    },
  );
