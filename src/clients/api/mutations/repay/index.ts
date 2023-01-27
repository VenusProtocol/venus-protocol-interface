import BigNumber from 'bignumber.js';
import { VError, checkForTokenTransactionError } from 'errors';
import { ContractReceipt, Signer } from 'ethers';
import { VToken } from 'types';

import { getMaximillionContract, getVTokenContract } from 'clients/contracts';
import MAX_UINT256 from 'constants/maxUint256';
import { VBep20, VBnbToken } from 'types/contracts';

export interface RepayInput {
  signer?: Signer;
  vToken: VToken;
  amountWei: BigNumber;
  isRepayingFullLoan?: boolean;
}

export type RepayOutput = ContractReceipt;

export const REPAYMENT_BNB_BUFFER_PERCENTAGE = 0.001;

const repay = async ({
  signer,
  vToken,
  amountWei,
  isRepayingFullLoan = false,
}: RepayInput): Promise<RepayOutput> => {
  // Handle repaying tokens other than BNB
  if (!vToken.underlyingToken.isNative) {
    const vTokenContract = getVTokenContract(vToken, signer) as VBep20;

    const transaction = await vTokenContract.repayBorrow(
      isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed(),
    );
    const receipt = await transaction.wait(1);
    return checkForTokenTransactionError(receipt);
  }

  if (isRepayingFullLoan && !signer) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  // Handle repaying full BNB loan
  if (isRepayingFullLoan) {
    const maximillionContract = getMaximillionContract(signer);
    const amountWithBufferWei = amountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);
    const accountAddress = await signer!.getAddress();

    const transaction = await maximillionContract.repayBehalfExplicit(
      accountAddress,
      vToken.address,
      {
        value: amountWithBufferWei.toFixed(0),
      },
    );
    return transaction.wait(1);
  }

  // Handle repaying partial BNB loan
  const vBnbContract = getVTokenContract(vToken, signer) as VBnbToken;
  const transaction = await vBnbContract.repayBorrow({
    value: amountWei.toFixed(),
  });
  return transaction.wait(1);
};

export default repay;
