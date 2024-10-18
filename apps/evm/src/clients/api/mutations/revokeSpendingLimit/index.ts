import type { Bep20, Vai, Vrt, Xvs } from 'libs/contracts';
import type { ContractTxData } from 'types';

type RevokeSpendingLimitContracts = Vai | Bep20 | Vrt | Xvs;
export interface RevokeSpendingLimitInput {
  tokenContract: RevokeSpendingLimitContracts;
  spenderAddress: string;
}

export type RevokeSpendingLimitOutput = ContractTxData<RevokeSpendingLimitContracts, 'approve'>;

const revokeSpendingLimit = ({
  tokenContract,
  spenderAddress,
}: RevokeSpendingLimitInput): RevokeSpendingLimitOutput => ({
  contract: tokenContract,
  methodName: 'approve',
  args: [spenderAddress, 0],
});

export default revokeSpendingLimit;
