import type { ContractTransaction } from 'ethers';

import type { Prime } from 'libs/contracts';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = ContractTransaction;

const claimPrimeToken = async ({
  primeContract,
}: ClaimPrimeTokenInput): Promise<ClaimPrimeTokenOutput> => primeContract.claim();

export default claimPrimeToken;
