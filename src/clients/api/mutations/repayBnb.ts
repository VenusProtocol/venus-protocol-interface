import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core/types';
import BigNumber from 'bignumber.js';

import { getVTokenContract, getMaximillionContract } from 'clients/contracts';
import { getVBepToken } from 'utilities';
import { checkForTokenTransactionError } from 'errors';

export interface IRepayBnbInput {
  web3: Web3;
  fromAccountAddress: string;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayBnbOutput = TransactionReceipt;

export const REPAYMENT_BNB_BUFFER_PERCENTAGE = 0.001;
const VBNB_ADDRESS = getVBepToken('bnb').address;

const repayBnb = async ({
  web3,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false,
}: IRepayBnbInput): Promise<RepayBnbOutput> => {
  let resp: TransactionReceipt;

  // If we're repaying a full loan, we need to call the Maximillion contract to
  // do so. If we partially repay a loan, we need to send the BNB amount to
  // repay to the vBnB contract
  if (isRepayingFullLoan) {
    const maximillionContract = getMaximillionContract(web3);
    const amountWithBuffer = amountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);

    resp = await maximillionContract.methods
      .repayBehalfExplicit(fromAccountAddress, VBNB_ADDRESS)
      .send({
        from: fromAccountAddress,
        value: amountWithBuffer.toFixed(0),
      });
  } else {
    const vBnbContract = getVTokenContract('bnb', web3);
    const contractData = vBnbContract.methods.repayBorrow().encodeABI();

    resp = await web3.eth.sendTransaction({
      from: fromAccountAddress,
      to: VBNB_ADDRESS,
      value: amountWei.toFixed(),
      data: contractData,
    });
  }

  return checkForTokenTransactionError(resp);
};

export default repayBnb;
