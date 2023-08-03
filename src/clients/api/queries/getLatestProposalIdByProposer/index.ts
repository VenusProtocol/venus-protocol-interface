import { ContractTypeByName } from 'packages/contracts';

export interface GetLatestProposalIdByProposerInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
  accountAddress: string;
}

export type GetLatestProposalIdByProposerOutput = {
  proposalId: string;
};

const getLatestProposalIdByProposer = async ({
  governorBravoContract,
  accountAddress,
}: GetLatestProposalIdByProposerInput): Promise<GetLatestProposalIdByProposerOutput> => {
  const res = await governorBravoContract.latestProposalIds(accountAddress);

  return {
    proposalId: res.toString(),
  };
};

export default getLatestProposalIdByProposer;
