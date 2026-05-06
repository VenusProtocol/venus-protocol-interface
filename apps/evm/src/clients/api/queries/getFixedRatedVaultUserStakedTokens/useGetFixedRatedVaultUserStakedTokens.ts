import type { Address } from 'viem';

import type { GetFixedRatedVaultUserStakedTokensOutput } from '.';
import {
  type UseGetInstitutionalVaultUserDataOptions,
  useGetInstitutionalVaultUserData,
} from '../getInstitutionalVaultUserData/useGetInstitutionalVaultUserData';

export interface UseGetFixedRatedVaultUserStakedTokensInput {
  vaultAddresses: Address[];
}

export const useGetFixedRatedVaultUserStakedTokens = (
  { vaultAddresses }: UseGetFixedRatedVaultUserStakedTokensInput,
  options?: Partial<
    UseGetInstitutionalVaultUserDataOptions<GetFixedRatedVaultUserStakedTokensOutput>
  >,
) =>
  useGetInstitutionalVaultUserData(
    { vaultAddresses },
    {
      ...options,
      select: userData =>
        userData.map(({ vaultAddress, tokensMantissa }) => ({
          vaultAddress,
          tokensMantissa,
        })),
    },
  );
