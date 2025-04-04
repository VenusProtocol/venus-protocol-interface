import type { Erc20, Vai, Vrt, Xvs } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

type RevokeSpendingLimitContracts = Vai | Erc20 | Vrt | Xvs;
export interface RevokeSpendingLimitInput {
  tokenContract: RevokeSpendingLimitContracts;
  spenderAddress: string;
}

export type RevokeSpendingLimitOutput = LooseEthersContractTxData;

const revokeSpendingLimit = ({
  tokenContract,
  spenderAddress,
}: RevokeSpendingLimitInput): RevokeSpendingLimitOutput => ({
  contract: tokenContract,
  methodName: 'approve',
  args: [spenderAddress, 0],
});

export default revokeSpendingLimit;
