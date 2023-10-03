import { ContractReceipt } from 'ethers';
import { Bep20, Vai, Vrt, Xvs } from 'packages/contracts';

export interface RevokeSpendingLimitInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  spenderAddress: string;
}

export type RevokeSpendingLimitOutput = ContractReceipt;

const revokeSpendingLimit = async ({
  tokenContract,
  spenderAddress,
}: RevokeSpendingLimitInput): Promise<RevokeSpendingLimitOutput> => {
  const transaction = await tokenContract.approve(spenderAddress, 0);
  return transaction.wait(1);
};

export default revokeSpendingLimit;
