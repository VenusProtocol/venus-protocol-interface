import type { Prime } from 'libs/contracts';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = ContractTransaction;

const claimPrimeToken = async ({
  primeContract,
}: ClaimPrimeTokenInput): Promise<ClaimPrimeTokenOutput> =>
  requestGaslessTransaction(primeContract, 'claim');

export default claimPrimeToken;
