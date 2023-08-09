import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetProposalThresholdInput {
  governorBravoDelegateContract: ContractTypeByName<'governorBravoDelegate'>;
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
