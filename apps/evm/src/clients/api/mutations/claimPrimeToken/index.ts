import type { Prime } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = ContractTxData<Prime, 'claim'>;

const claimPrimeToken = ({ primeContract }: ClaimPrimeTokenInput): ClaimPrimeTokenOutput => ({
  contract: primeContract,
  methodName: 'claim',
  args: [],
});

export default claimPrimeToken;
