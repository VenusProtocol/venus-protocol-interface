import type { Address, PublicClient } from 'viem';

import type BigNumber from 'bignumber.js';
import { getInstitutionalVaultUserData } from '../getInstitutionalVaultUserData';

export interface GetInstitutionalVaultUserMetricsInput {
  accountAddress: Address;
  vaultAddresses: Address[];
  publicClient: PublicClient;
}

export type InstitutionalVaultUserMetric = {
  vaultAddress: Address;
  maxRedeemAmountMantissa: BigNumber;
  maxWithdrawAmountMantissa: BigNumber;
};

export type GetInstitutionalVaultUserMetricsOutput = InstitutionalVaultUserMetric[];

export const getInstitutionalVaultUserMetrics = async ({
  publicClient,
  accountAddress,
  vaultAddresses,
}: GetInstitutionalVaultUserMetricsInput): Promise<GetInstitutionalVaultUserMetricsOutput> => {
  const userData = await getInstitutionalVaultUserData({
    publicClient,
    accountAddress,
    vaultAddresses,
  });

  return userData.map(({ vaultAddress, maxRedeemAmountMantissa, maxWithdrawAmountMantissa }) => ({
    vaultAddress,
    maxRedeemAmountMantissa,
    maxWithdrawAmountMantissa,
  }));
};
