import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { institutionalVaultAbi } from 'libs/contracts';

export interface GetFixedRatedVaultUserStakedTokensInput {
  accountAddress: Address;
  vaultAddresses: Address[];
  publicClient: PublicClient;
}

export type FixedRatedVaultUserStakedAmount = {
  vaultAddress: Address;
  tokensMantissa: BigNumber | undefined;
};

export type GetFixedRatedVaultUserStakedTokensOutput = FixedRatedVaultUserStakedAmount[];

export const getFixedRatedVaultUserStakedTokens = async ({
  publicClient,
  accountAddress,
  vaultAddresses,
}: GetFixedRatedVaultUserStakedTokensInput): Promise<GetFixedRatedVaultUserStakedTokensOutput> => {
  const results = await publicClient.multicall({
    contracts: vaultAddresses.map(vaultAddress => ({
      abi: institutionalVaultAbi,
      address: vaultAddress,
      functionName: 'balanceOf' as const,
      args: [accountAddress],
    })),
  });

  const userStakedTokens = results.map((result, index) => ({
    vaultAddress: vaultAddresses[index],
    tokensMantissa:
      result.status === 'success' ? new BigNumber(result.result.toString()) : undefined,
  }));

  return userStakedTokens;
};
