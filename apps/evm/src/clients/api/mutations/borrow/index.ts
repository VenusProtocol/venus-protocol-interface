import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';

export interface BorrowInput {
  amountMantissa: BigNumber;
  unwrap?: boolean;
  vTokenContract?: VBep20 | VBnb;
  nativeTokenGatewayContract?: NativeTokenGateway;
}

export type BorrowOutput = ContractTransaction;

const borrow = async ({
  vTokenContract,
  nativeTokenGatewayContract,
  unwrap = false,
  amountMantissa,
}: BorrowInput): Promise<BorrowOutput> => {
  // Handle borrow and unwrap flow
  if (unwrap && !nativeTokenGatewayContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (unwrap) {
    return nativeTokenGatewayContract!.borrowAndUnwrap(amountMantissa.toFixed());
  }

  if (!vTokenContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  // Handle borrow flow
  return vTokenContract.borrow(amountMantissa.toFixed());
};

export default borrow;
