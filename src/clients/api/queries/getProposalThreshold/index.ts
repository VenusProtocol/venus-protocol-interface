import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetProposalThresholdInput {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
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
