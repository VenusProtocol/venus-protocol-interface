import { ContractTypeByName } from 'packages/contracts';

export interface GetProposalEtaInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
  proposalId: number;
}

export type GetProposalEtaOutput = {
  eta: Date;
};

const getProposalEta = async ({
  governorBravoContract,
  proposalId,
}: GetProposalEtaInput): Promise<GetProposalEtaOutput> => {
  const resp = await governorBravoContract.proposals(proposalId);

  // Convert ETA expressed in seconds to milliseconds
  const eta = new Date(+resp.eta * 1000);

  return {
    eta,
  };
};

export default getProposalEta;
