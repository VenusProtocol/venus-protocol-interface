import { ContractTransaction } from 'ethers';

import { Bep20, Vai, Vrt, Xvs } from 'libs/contracts';

export interface RevokeSpendingLimitInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  spenderAddress: string;
}

export type RevokeSpendingLimitOutput = ContractTransaction;

const revokeSpendingLimit = async ({
  tokenContract,
  spenderAddress,
}: RevokeSpendingLimitInput): Promise<RevokeSpendingLimitOutput> =>
  tokenContract.approve(spenderAddress, 0);

export default revokeSpendingLimit;
