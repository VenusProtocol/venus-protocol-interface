import BigNumber from 'bignumber.js';
import { ContractTransaction, Signer } from 'ethers';
import { Maximillion, VBnb, getVTokenContract } from 'packages/contracts';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import MAX_UINT256 from 'constants/maxUint256';

export interface RepayInput {
  signer: Signer;
  vToken: VToken;
  amountWei: BigNumber;
  isRepayingFullLoan: boolean;
  maximillionContract?: Maximillion;
}

export type RepayOutput = ContractTransaction;

export const REPAYMENT_BNB_BUFFER_PERCENTAGE = 0.001;

const repayFullBnbLoan = async ({
  vToken,
  amountWei,
  signer,
  maximillionContract,
}: {
  vToken: VToken;
  amountWei: BigNumber;
  signer: Signer;
  maximillionContract: Maximillion;
}) => {
  const amountWithBufferWei = amountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);
  const accountAddress = await signer.getAddress();

  return maximillionContract.repayBehalfExplicit(accountAddress, vToken.address, {
    value: amountWithBufferWei.toFixed(0),
  });
};

const repay = async ({
  signer,
  vToken,
  amountWei,
  maximillionContract,
  isRepayingFullLoan = false,
}: RepayInput): Promise<RepayOutput> => {
  // Handle repaying tokens other than BNB
  if (!vToken.underlyingToken.isNative) {
    const vTokenContract = getVTokenContract({ vToken, signerOrProvider: signer });

    return vTokenContract.repayBorrow(
      isRepayingFullLoan ? MAX_UINT256.toFixed() : amountWei.toFixed(),
    );
  }

  // Handle repaying full BNB loan
  if (isRepayingFullLoan) {
    return callOrThrow({ maximillionContract, signer }, params =>
      repayFullBnbLoan({
        amountWei,
        vToken,
        ...params,
      }),
    );
  }

  // Handle repaying partial BNB loan
  const vBnbContract = getVTokenContract({
    vToken,
    signerOrProvider: signer,
  }) as VBnb;

  return vBnbContract.repayBorrow({
    value: amountWei.toFixed(),
  });
};

export default repay;
