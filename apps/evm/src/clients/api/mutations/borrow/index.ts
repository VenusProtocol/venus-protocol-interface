import type BigNumber from 'bignumber.js';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ContractTxData } from 'types';

export interface BorrowInput {
  amountMantissa: BigNumber;
  unwrap?: boolean;
  vTokenContract?: VBep20 | VBnb;
  nativeTokenGatewayContract?: NativeTokenGateway;
}

type BorrowAndUnwrapTxOuput = ContractTxData<NativeTokenGateway, 'borrowAndUnwrap'>;

type BorrowTxOutput = ContractTxData<VBep20 | VBnb, 'borrow'>;

export type BorrowOutput = BorrowAndUnwrapTxOuput | BorrowTxOutput;

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
    return {
      contract: nativeTokenGatewayContract,
      methodName: 'borrowAndUnwrap',
      args: [amountMantissa.toFixed()],
    };
  }

  if (!vTokenContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  // Handle borrow flow
  return {
    contract: vTokenContract,
    methodName: 'borrow',
    args: [amountMantissa.toFixed()],
  };
};

export default borrow;
