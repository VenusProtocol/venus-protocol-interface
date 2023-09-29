import { ContractReceipt } from 'ethers';
import { GovernorBravoDelegate } from 'packages/contractsNew';

export interface HookParams {
  governorBravoDelegateContract: GovernorBravoDelegate;
}

export interface CastVoteWithReasonInput {
  proposalId: number;
  voteType: 0 | 1 | 2;
  voteReason: string;
}

export type CastVoteWithReasonOutput = ContractReceipt;

const castVoteWithReason = async ({
  governorBravoDelegateContract,
  proposalId,
  voteType,
  voteReason,
}: CastVoteWithReasonInput & HookParams): Promise<CastVoteWithReasonOutput> => {
  const transaction = await governorBravoDelegateContract.castVoteWithReason(
    proposalId,
    voteType,
    voteReason,
  );
  return transaction.wait(1);
};

export default castVoteWithReason;
