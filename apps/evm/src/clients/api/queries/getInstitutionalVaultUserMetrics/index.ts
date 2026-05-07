import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { institutionalVaultAbi } from 'libs/contracts/abis/institutionalVaultAbi';
import { VError } from 'libs/errors';

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
  if (!accountAddress) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: 'accountAddress is required' },
    });
  }

  const results = await publicClient.multicall({
    contracts: vaultAddresses.flatMap(vaultAddress => [
      {
        abi: institutionalVaultAbi,
        address: vaultAddress,
        functionName: 'maxRedeem' as const,
        args: [accountAddress],
      },
      {
        abi: institutionalVaultAbi,
        address: vaultAddress,
        functionName: 'maxWithdraw' as const,
        args: [accountAddress],
      },
    ]),
  });

  const failedResult = results.find(result => result.status !== 'success');

  if (failedResult) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  return vaultAddresses.map((vaultAddress, index) => {
    const maxRedeemResult = results[index * 2];
    const maxWithdrawResult = results[index * 2 + 1];

    if (maxRedeemResult.status !== 'success' || maxWithdrawResult.status !== 'success') {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return {
      vaultAddress,
      maxRedeemAmountMantissa: new BigNumber(maxRedeemResult.result.toString()),
      maxWithdrawAmountMantissa: new BigNumber(maxWithdrawResult.result.toString()),
    };
  });
};
