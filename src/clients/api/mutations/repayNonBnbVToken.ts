import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import MAX_UINT256 from 'constants/maxUint256';
import { VTokenId } from 'types';
import { VTokenContract } from 'clients/contracts/types';
import { checkForTokenTransactionError } from 'errors';

export interface IRepayNonBnbVTokenInput {
  vTokenContract: VTokenContract<Exclude<VTokenId, 'bnb'>>;
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
}: IRepayNonBnbVTokenInput): Promise<RepayNonBnbVTokenOutput> => {
  const resp = await vTokenContract.methods
    .repayBorrow(isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForTokenTransactionError(resp);
};

export default repayNonBnbVToken;
