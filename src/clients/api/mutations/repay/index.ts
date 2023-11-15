import BigNumber from 'bignumber.js';
import { ContractTransaction, Signer } from 'ethers';
import { Maximillion, VBnb, getVTokenContract } from 'packages/contracts';
import { VToken } from 'types';
import { callOrThrow } from 'utilities';

import MAX_UINT256 from 'constants/maxUint256';

export interface RepayInput {
  signer: Signer;
  vToken: VToken;
  amountMantissa: BigNumber;
  isRepayingFullLoan: boolean;
  maximillionContract?: Maximillion;
}

export type RepayOutput = ContractTransaction;

export const REPAYMENT_BNB_BUFFER_PERCENTAGE = 0.001;

const repayFullBnbLoan = async ({
  vToken,
  amountMantissa,
  signer,
  maximillionContract,
}: {
  vToken: VToken;
  amountMantissa: BigNumber;
  signer: Signer;
  maximillionContract: Maximillion;
}) => {
  const amountWithBufferMantissa = amountMantissa.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);
  const accountAddress = await signer.getAddress();

  return maximillionContract.repayBehalfExplicit(accountAddress, vToken.address, {
    value: amountWithBufferMantissa.toFixed(0),
  });
};

const repay = async ({
  signer,
  vToken,
  amountMantissa,
  maximillionContract,
  isRepayingFullLoan = false,
}: RepayInput): Promise<RepayOutput> => {
  // Handle repaying tokens other than BNB
  if (!vToken.underlyingToken.isNative) {
    const vTokenContract = getVTokenContract({ vToken, signerOrProvider: signer });

    return vTokenContract.repayBorrow(
      isRepayingFullLoan ? MAX_UINT256.toFixed() : amountMantissa.toFixed(),
    );
  }

  // Handle repaying full BNB loan
  if (isRepayingFullLoan) {
    return callOrThrow({ maximillionContract, signer }, params =>
      repayFullBnbLoan({
        amountMantissa,
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
    value: amountMantissa.toFixed(),
  });
};

export default repay;
