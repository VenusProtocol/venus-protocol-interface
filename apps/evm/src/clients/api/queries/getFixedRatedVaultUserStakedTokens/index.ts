import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { institutionalVaultAbi } from 'libs/contracts/abis/institutionalVaultAbi';
import { VError } from 'libs/errors';

export interface GetFixedRatedVaultUserStakedTokensInput {
  accountAddress: Address;
  vaultAddresses: Address[];
  publicClient: PublicClient;
}

export type FixedRatedVaultUserStakedAmount = {
  vaultAddress: Address;
  tokensMantissa: BigNumber;
};

export type GetFixedRatedVaultUserStakedTokensOutput = FixedRatedVaultUserStakedAmount[];

export const getFixedRatedVaultUserStakedTokens = async ({
  publicClient,
  accountAddress,
  vaultAddresses,
}: GetFixedRatedVaultUserStakedTokensInput): Promise<GetFixedRatedVaultUserStakedTokensOutput> => {
  if (!accountAddress) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: 'accountAddress is required' },
    });
  }

  const results = await publicClient.multicall({
    contracts: vaultAddresses.map(vaultAddress => ({
      abi: institutionalVaultAbi,
      address: vaultAddress,
      functionName: 'balanceOf',
      args: [accountAddress],
    })),
  });

  const failedResult = results.find(result => result.status !== 'success');

  if (failedResult) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  return results.reduce<GetFixedRatedVaultUserStakedTokensOutput>((acc, result, index) => {
    if (result.status !== 'success') {
      return acc;
    }

    const { result: balanceMantissa } = result as { result: bigint };

    acc.push({
      vaultAddress: vaultAddresses[index],
      tokensMantissa: new BigNumber(balanceMantissa.toString()),
    });

    return acc;
  }, []);
};
