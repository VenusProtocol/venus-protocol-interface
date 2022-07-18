import BigNumber from 'bignumber.js';

import { GovernorBravoDelegate } from 'types/contracts';

export interface IGetProposalThresholdInput {
  governorBravoContract: GovernorBravoDelegate;
}

export type GetProposalThresholdOutput = BigNumber;

const getProposalThreshold = async ({
  governorBravoContract,
}: IGetProposalThresholdInput): Promise<GetProposalThresholdOutput> => {
  const resp = await governorBravoContract.methods.proposalThreshold().call();
  return new BigNumber(resp);
};

export default getProposalThreshold;
