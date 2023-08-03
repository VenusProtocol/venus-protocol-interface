import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

export interface HookParams {
  governorBravoContract: ContractTypeByName<'governorBravoDelegate'>;
}

export interface CastVoteWithReasonInput {
  proposalId: number;
  voteType: 0 | 1 | 2;
  voteReason: string;
}

export type CastVoteWithReasonOutput = ContractReceipt;

const castVoteWithReason = async ({
  governorBravoContract,
  proposalId,
  voteType,
  voteReason,
}: CastVoteWithReasonInput & HookParams): Promise<CastVoteWithReasonOutput> => {
  const transaction = await governorBravoContract.castVoteWithReason(
    proposalId,
    voteType,
    voteReason,
  );
  return transaction.wait(1);
};

export default castVoteWithReason;
