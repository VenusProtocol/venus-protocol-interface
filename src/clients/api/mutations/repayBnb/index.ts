import BigNumber from 'bignumber.js';
import { checkForTokenTransactionError } from 'errors';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core/types';

import { getMaximillionContract, getVTokenContract } from 'clients/contracts';
import { VBEP_TOKENS } from 'constants/tokens';

export interface RepayBnbInput {
  web3: Web3;
  fromAccountAddress: string;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayBnbOutput = TransactionReceipt;

export const REPAYMENT_BNB_BUFFER_PERCENTAGE = 0.001;

const repayBnb = async ({
  web3,
  fromAccountAddress,
  amountWei,
  isRepayingFullLoan = false,
}: RepayBnbInput): Promise<RepayBnbOutput> => {
  let resp: TransactionReceipt;

  // If we're repaying a full loan, we need to call the Maximillion contract to
  // do so. If we partially repay a loan, we need to send the BNB amount to
  // repay to the vBnB contract
  if (isRepayingFullLoan) {
    const maximillionContract = getMaximillionContract(web3);
    const amountWithBuffer = amountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);

    resp = await maximillionContract.methods
      .repayBehalfExplicit(fromAccountAddress, VBEP_TOKENS.bnb.address)
      .send({
        from: fromAccountAddress,
        value: amountWithBuffer.toFixed(0),
      });
  } else {
    const vBnbContract = getVTokenContract('bnb', web3);
    const contractData = vBnbContract.methods.repayBorrow().encodeABI();

    resp = await web3.eth.sendTransaction({
      from: fromAccountAddress,
      to: VBEP_TOKENS.bnb.address,
      value: amountWei.toFixed(),
      data: contractData,
    });
  }

  return checkForTokenTransactionError(resp);
};

export default repayBnb;
