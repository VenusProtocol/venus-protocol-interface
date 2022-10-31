import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { VTokenContract } from 'clients/contracts/types';
import MAX_UINT256 from 'constants/maxUint256';

export interface RepayNonBnbVTokenInput {
  vTokenContract: VTokenContract<Exclude<string, 'bnb'>>;
  fromAccountAddress: string;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayNonBnbVTokenOutput = TransactionReceipt;

const repayNonBnbVToken = async ({
  vTokenContract,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false,
}: RepayNonBnbVTokenInput): Promise<RepayNonBnbVTokenOutput> => {
  const resp = await vTokenContract.methods
    .repayBorrow(isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTokenTransactionError(resp);
};

export default repayNonBnbVToken;
