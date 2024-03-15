import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { NativeTokenGateway } from 'libs/contracts';

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
