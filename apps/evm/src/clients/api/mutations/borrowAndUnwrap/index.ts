import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { NativeTokenGateway } from 'libs/contracts';

export interface BorrowAndUnwrapInput {
  nativeTokenGatewayContract: NativeTokenGateway;
  amountMantissa: BigNumber;
}

export type BorrowAndUnwrapOutput = ContractTransaction;

const borrowAndUnwrap = async ({
  nativeTokenGatewayContract,
  amountMantissa,
}: BorrowAndUnwrapInput) => nativeTokenGatewayContract.borrowAndUnwrap(amountMantissa.toFixed());

export default borrowAndUnwrap;
