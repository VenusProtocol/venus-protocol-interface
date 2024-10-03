import type BigNumber from 'bignumber.js';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

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

  if (unwrap && nativeTokenGatewayContract) {
    return requestGaslessTransaction(nativeTokenGatewayContract, 'borrowAndUnwrap', [
      amountMantissa.toFixed(),
    ]) as Promise<BorrowOutput>;
  }

  if (!vTokenContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  // Handle borrow flow
  return requestGaslessTransaction(vTokenContract, 'borrow', [amountMantissa.toFixed()]);
};

export default borrow;
