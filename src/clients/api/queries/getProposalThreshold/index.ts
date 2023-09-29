import BigNumber from 'bignumber.js';
import { GovernorBravoDelegate } from 'packages/contractsNew';

export interface GetProposalThresholdInput {
  governorBravoDelegateContract: GovernorBravoDelegate;
}

export type GetProposalThresholdOutput = {
  thresholdWei: BigNumber;
};

const getProposalThreshold = async ({
  governorBravoDelegateContract,
}: GetProposalThresholdInput): Promise<GetProposalThresholdOutput> => {
  const resp = await governorBravoDelegateContract.proposalThreshold();

  return {
    thresholdWei: new BigNumber(resp.toString()),
  };
};

export default getProposalThreshold;
