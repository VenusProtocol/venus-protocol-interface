import type { GovernorBravoDelegate } from 'libs/contracts';
import type { Address } from 'viem';

export interface GetLatestProposalIdByProposerInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  accountAddress: Address;
}

export type GetLatestProposalIdByProposerOutput = {
  proposalId: string;
};

const getLatestProposalIdByProposer = async ({
  governorBravoDelegateContract,
  accountAddress,
}: GetLatestProposalIdByProposerInput): Promise<GetLatestProposalIdByProposerOutput> => {
  const res = await governorBravoDelegateContract.latestProposalIds(accountAddress);

  return {
    proposalId: res.toString(),
  };
};

export default getLatestProposalIdByProposer;
