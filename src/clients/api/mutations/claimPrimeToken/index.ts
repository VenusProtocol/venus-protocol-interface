import { ContractTransaction } from 'ethers';
import { Prime } from 'packages/contracts';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = ContractTransaction;

const claimPrimeToken = async ({
  primeContract,
}: ClaimPrimeTokenInput): Promise<ClaimPrimeTokenOutput> => primeContract.claim();

export default claimPrimeToken;
