import { GovernorBravoDelegate } from 'types/contracts';

export interface GetLatestProposalIdByProposerInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
}

export type GetLatestProposalIdByProposerOutput = string;

const getLatestProposalIdByProposer = async ({
  governorBravoContract,
  accountAddress,
}: GetLatestProposalIdByProposerInput): Promise<GetLatestProposalIdByProposerOutput> =>
  governorBravoContract.methods.latestProposalIds(accountAddress).call();

export default getLatestProposalIdByProposer;
