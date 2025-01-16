import BigNumber from 'bignumber.js';
import { XvsVaultAbi } from 'libs/contracts';

import type { Address, PublicClient } from 'viem';

export interface GetCurrentVotesInput {
  publicClient: PublicClient;
  xvsVaultContractAddress: string;
  accountAddress: string;
}

export type GetCurrentVotesOutput = {
  votesMantissa: BigNumber;
};

const getCurrentVotes = async ({
  publicClient,
  xvsVaultContractAddress,
  accountAddress,
}: GetCurrentVotesInput): Promise<GetCurrentVotesOutput> => {
  const votesMantissa = await publicClient.readContract({
    address: xvsVaultContractAddress as Address,
    abi: XvsVaultAbi,
    functionName: 'getCurrentVotes',
    args: [accountAddress as Address],
  });

  return {
    votesMantissa: new BigNumber(votesMantissa.toString()),
  };
};

export default getCurrentVotes;
