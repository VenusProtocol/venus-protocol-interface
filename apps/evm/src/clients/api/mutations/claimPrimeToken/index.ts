import type { Prime } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface ClaimPrimeTokenInput {
  primeContract: Prime;
}

export type ClaimPrimeTokenOutput = LooseEthersContractTxData;

const claimPrimeToken = ({ primeContract }: ClaimPrimeTokenInput): ClaimPrimeTokenOutput => ({
  contract: primeContract,
  methodName: 'claim',
  args: [],
});

export default claimPrimeToken;
