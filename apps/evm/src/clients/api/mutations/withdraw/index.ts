import type BigNumber from 'bignumber.js';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ContractTxData } from 'types';

export interface WithdrawInput {
  amountMantissa: BigNumber;
  tokenContract?: VBep20 | VBnb;
  nativeTokenGatewayContract?: NativeTokenGateway;
  withdrawFullSupply?: boolean;
  unwrap?: boolean;
}

export type WithdrawOutput =
  | ContractTxData<VBep20 | VBnb, 'redeem' | 'redeemUnderlying'>
  | ContractTxData<NativeTokenGateway, 'redeemAndUnwrap' | 'redeemUnderlyingAndUnwrap'>;

const withdraw = async ({
  amountMantissa,
  tokenContract,
  nativeTokenGatewayContract,
  withdrawFullSupply = false,
  unwrap = false,
}: WithdrawInput) => {
  // Handle withdraw and unwrap flow
  if (unwrap && !nativeTokenGatewayContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (unwrap && nativeTokenGatewayContract) {
    return withdrawFullSupply
      ? {
          contract: nativeTokenGatewayContract,
          methodName: 'redeemAndUnwrap',
          args: [amountMantissa.toFixed()],
        }
      : {
          contract: nativeTokenGatewayContract,
          methodName: 'redeemUnderlyingAndUnwrap',
          args: [amountMantissa.toFixed()],
        };
  }

  // Handle withdraw flow
  if (!tokenContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  return withdrawFullSupply
    ? { contract: tokenContract, methodName: 'redeem', args: [amountMantissa.toFixed()] }
    : { contract: tokenContract, methodName: 'redeemUnderlying', args: [amountMantissa.toFixed()] };
};

export default withdraw;
