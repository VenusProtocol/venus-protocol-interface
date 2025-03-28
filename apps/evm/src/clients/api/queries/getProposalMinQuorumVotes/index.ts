import BigNumber from 'bignumber.js';
import { governorBravoDelegateAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetProposalMinQuorumVotesInput {
  publicClient: PublicClient;
  governorBravoDelegateContractAddress: Address;
}

export interface GetProposalMinQuorumVotesOutput {
  proposalMinQuorumVotesMantissa: BigNumber;
}

export const getProposalMinQuorumVotes = async ({
  publicClient,
  governorBravoDelegateContractAddress,
}: GetProposalMinQuorumVotesInput): Promise<GetProposalMinQuorumVotesOutput> => {
  const res = await publicClient.readContract({
    address: governorBravoDelegateContractAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'quorumVotes',
  });

  return {
    proposalMinQuorumVotesMantissa: new BigNumber(res.toString()),
  };
};
