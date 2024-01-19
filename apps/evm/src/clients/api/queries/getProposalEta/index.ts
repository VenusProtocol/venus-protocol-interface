import { GovernorBravoDelegate } from 'packages/contracts';

export interface GetProposalEtaInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
  proposalId: number;
}

export type GetProposalEtaOutput = {
  eta: Date;
};

const getProposalEta = async ({
  governorBravoDelegateContract,
  proposalId,
}: GetProposalEtaInput): Promise<GetProposalEtaOutput> => {
  const resp = await governorBravoDelegateContract.proposals(proposalId);

  // Convert ETA expressed in seconds to milliseconds
  const eta = new Date(+resp.eta * 1000);

  return {
    eta,
  };
};

export default getProposalEta;
