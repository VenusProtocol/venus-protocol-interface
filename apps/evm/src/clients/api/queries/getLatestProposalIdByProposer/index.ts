import { GovernorBravoDelegate } from 'packages/contracts';

export interface GetLatestProposalIdByProposerInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  accountAddress: string;
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
