import { ContractReceipt } from 'ethers';
import { Prime } from 'packages/contracts';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = ContractReceipt;

const claimPrimeToken = async ({
  primeContract,
}: ClaimPrimeTokenInput): Promise<ClaimPrimeTokenOutput> => {
  const transaction = await primeContract.claim();
  return transaction.wait(1);
};

export default claimPrimeToken;
