import { GovernorBravoDelegate } from 'types/contracts';

export interface IGetLatestProposalIdByProposerInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
}

export type GetLatestProposalIdByProposerOutput = string;

const getLatestProposalIdByProposer = async ({
  governorBravoContract,
  accountAddress,
}: IGetLatestProposalIdByProposerInput): Promise<GetLatestProposalIdByProposerOutput> =>
  governorBravoContract.methods.latestProposalIds(accountAddress).call();

export default getLatestProposalIdByProposer;
