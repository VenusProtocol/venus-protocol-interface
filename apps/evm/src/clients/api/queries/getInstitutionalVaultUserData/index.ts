import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { institutionalVaultAbi } from 'libs/contracts/abis/institutionalVaultAbi';
import { VError } from 'libs/errors';

const READS_PER_VAULT = 3;

export interface GetInstitutionalVaultUserDataInput {
  accountAddress: Address;
  vaultAddresses: Address[];
  publicClient: PublicClient;
}

export type InstitutionalVaultUserData = {
  vaultAddress: Address;
  tokensMantissa: BigNumber;
  maxRedeemAmountMantissa: BigNumber;
  maxWithdrawAmountMantissa: BigNumber;
};

export type GetInstitutionalVaultUserDataOutput = InstitutionalVaultUserData[];

export const getInstitutionalVaultUserData = async ({
  publicClient,
  accountAddress,
  vaultAddresses,
}: GetInstitutionalVaultUserDataInput): Promise<GetInstitutionalVaultUserDataOutput> => {
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
        functionName: 'balanceOf' as const,
        args: [accountAddress],
      },
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
    const balanceResult = results[index * READS_PER_VAULT];
    const maxRedeemResult = results[index * READS_PER_VAULT + 1];
    const maxWithdrawResult = results[index * READS_PER_VAULT + 2];

    if (
      balanceResult.status !== 'success' ||
      maxRedeemResult.status !== 'success' ||
      maxWithdrawResult.status !== 'success'
    ) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    return {
      vaultAddress,
      tokensMantissa: new BigNumber(balanceResult.result.toString()),
      maxRedeemAmountMantissa: new BigNumber(maxRedeemResult.result.toString()),
      maxWithdrawAmountMantissa: new BigNumber(maxWithdrawResult.result.toString()),
    };
  });
};
