import BigNumber from 'bignumber.js';

import { GovernorBravoDelegate } from 'types/contracts';

export interface GetProposalThresholdInput {
  governorBravoContract: GovernorBravoDelegate;
}

export type GetProposalThresholdOutput = {
  thresholdWei: BigNumber;
};

const getProposalThreshold = async ({
  governorBravoContract,
}: GetProposalThresholdInput): Promise<GetProposalThresholdOutput> => {
  const resp = await governorBravoContract.proposalThreshold();

  return {
    thresholdWei: new BigNumber(resp.toString()),
  };
};

export default getProposalThreshold;
