import type { Address, PublicClient } from 'viem';

import type BigNumber from 'bignumber.js';
import { getInstitutionalVaultUserData } from '../getInstitutionalVaultUserData';

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
  const userData = await getInstitutionalVaultUserData({
    publicClient,
    accountAddress,
    vaultAddresses,
  });

  return userData.map(({ vaultAddress, tokensMantissa }) => ({
    vaultAddress,
    tokensMantissa,
  }));
};
