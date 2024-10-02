import type { Bep20, Vai, Vrt, Xvs } from 'libs/contracts';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface RevokeSpendingLimitInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  spenderAddress: string;
}

export type RevokeSpendingLimitOutput = ContractTransaction;

const revokeSpendingLimit = async ({
  tokenContract,
  spenderAddress,
}: RevokeSpendingLimitInput): Promise<RevokeSpendingLimitOutput> =>
  requestGaslessTransaction(tokenContract, 'approve', spenderAddress, 0);

export default revokeSpendingLimit;
