import BigNumber from 'bignumber.js';

import type { GovernorBravoDelegate } from 'libs/contracts';

export interface GetProposalThresholdInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
}

export type GetProposalThresholdOutput = {
  thresholdMantissa: BigNumber;
};

const getProposalThreshold = async ({
  governorBravoDelegateContract,
}: GetProposalThresholdInput): Promise<GetProposalThresholdOutput> => {
  const resp = await governorBravoDelegateContract.proposalThreshold();

  return {
    thresholdMantissa: new BigNumber(resp.toString()),
  };
};

export default getProposalThreshold;
