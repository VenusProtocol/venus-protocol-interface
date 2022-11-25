import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import { Token } from 'types';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core/types';

import { getMaximillionContract, getVTokenContract } from 'clients/contracts';
import MAX_UINT256 from 'constants/maxUint256';
import { VBep20, VBnbToken } from 'types/contracts';

export interface RepayInput {
  web3: Web3;
  accountAddress: string;
  vToken: Token;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayOutput = TransactionReceipt;

export const REPAYMENT_BNB_BUFFER_PERCENTAGE = 0.001;

const repay = async ({
  web3,
  accountAddress,
  vToken,
  amountWei,
  isRepayingFullLoan = false,
}: RepayInput): Promise<RepayOutput> => {
  // Handle repaying tokens other than BNB
  if (vToken.symbol !== 'vBNB') {
    const vTokenContract = getVTokenContract(vToken, web3) as VBep20;

    const resp = await vTokenContract.methods
      .repayBorrow(isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed())
      .send({ from: accountAddress });
    return checkForTokenTransactionError(resp);
  }

  // Handle repaying full BNB loan
  if (isRepayingFullLoan) {
    const maximillionContract = getMaximillionContract(web3);
    const amountWithBuffer = amountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);

    const resp = await maximillionContract.methods
      .repayBehalfExplicit(accountAddress, vToken.address)
      .send({
        from: accountAddress,
        value: amountWithBuffer.toFixed(0),
      });
    return checkForTokenTransactionError(resp);
  }

  // Handle repaying partial BNB loan
  const vBnbContract = getVTokenContract(vToken, web3) as VBnbToken;
  const contractData = vBnbContract.methods.repayBorrow().encodeABI();

  const resp = await web3.eth.sendTransaction({
    from: accountAddress,
    to: vToken.address,
    value: amountWei.toFixed(),
    data: contractData,
  });
  return checkForTokenTransactionError(resp);
};

export default repay;
