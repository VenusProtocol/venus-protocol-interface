import BigNumber from 'bignumber.js';
import { xvsVaultAbi } from 'libs/contracts';

import type { Address, PublicClient } from 'viem';

export interface GetCurrentVotesInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: Address;
  accountAddress: Address;
}

export type GetCurrentVotesOutput = {
  votesMantissa: BigNumber;
};

export const getCurrentVotes = async ({
  publicClient,
  xvsVaultContractAddress,
  accountAddress,
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const votesMantissa = await publicClient.readContract({
    address: xvsVaultContractAddress,
    abi: xvsVaultAbi,
    functionName: 'getCurrentVotes',
    args: [accountAddress],
  });

  return {
    votesMantissa: new BigNumber(votesMantissa.toString()),
  };
};
