import { ContractReceipt } from 'ethers';

import { Bep20, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export interface RevokeSpendingLimitInput {
  tokenContract: Bep20 | VaiToken | VrtToken | XvsToken;
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
