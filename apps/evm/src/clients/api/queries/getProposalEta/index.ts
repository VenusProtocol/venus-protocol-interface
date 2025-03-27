import { governorBravoDelegateAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetProposalEtaInput {
  publicClient: PublicClient;
  governorBravoDelegateContractAddress: Address;
  proposalId: number;
}

export type GetProposalEtaOutput = {
  eta: Date;
};

export const getProposalEta = async ({
  publicClient,
  governorBravoDelegateContractAddress,
  proposalId,
}: GetProposalEtaInput): Promise<GetProposalEtaOutput> => {
  const [_id, _proposerAddress, etaSeconds] = await publicClient.readContract({
    address: governorBravoDelegateContractAddress,
    abi: governorBravoDelegateAbi,
    functionName: 'proposals',
    args: [BigInt(proposalId)],
  });

  // Convert ETA expressed in seconds to milliseconds
  const eta = new Date(Number(etaSeconds) * 1000);

  return {
    eta,
  };
};
