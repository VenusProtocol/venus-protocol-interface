import type { TransactionReceipt } from 'web3-core';
import { GovernorBravoDelegate } from 'types/contracts';

export interface ICreateProposalInput {
  governorBravoContract: GovernorBravoDelegate;
  accountAddress: string;
  targets: string[];
  values: (number | string)[];
  signatures: string[];
  callDatas: (string | number[])[];
  description: string;
}

export type CreateProposalOutput = TransactionReceipt;

const createProposal = async ({
  governorBravoContract,
  accountAddress,
  targets,
  values,
  signatures,
  callDatas,
  description,
}: ICreateProposalInput): Promise<CreateProposalOutput> => {
  const resp = await governorBravoContract.methods
    .propose(targets, values, signatures, callDatas, description)
    .send({ from: accountAddress });
  return resp;
};

export default createProposal;
