import { ContractTransaction } from 'ethers';

import { Prime } from 'libs/contracts';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = ContractTransaction;

const claimPrimeToken = async ({
  primeContract,
}: ClaimPrimeTokenInput): Promise<ClaimPrimeTokenOutput> => primeContract.claim();

export default claimPrimeToken;
