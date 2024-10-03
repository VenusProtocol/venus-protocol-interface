import type BigNumber from 'bignumber.js';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ContractTransaction } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface WithdrawInput {
  amountMantissa: BigNumber;
  tokenContract?: VBep20 | VBnb;
  nativeTokenGatewayContract?: NativeTokenGateway;
  withdrawFullSupply?: boolean;
  unwrap?: boolean;
}

export type WithdrawOutput = ContractTransaction;

const withdraw = async ({
  amountMantissa,
  tokenContract,
  nativeTokenGatewayContract,
  withdrawFullSupply = false,
  unwrap = false,
}: WithdrawInput): Promise<WithdrawOutput> => {
  // Handle withdraw and unwrap flow
  if (unwrap && !nativeTokenGatewayContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (unwrap && nativeTokenGatewayContract) {
    return withdrawFullSupply
      ? requestGaslessTransaction(nativeTokenGatewayContract, 'redeemAndUnwrap', [
          amountMantissa.toFixed(),
        ])
      : requestGaslessTransaction(nativeTokenGatewayContract, 'redeemUnderlyingAndUnwrap', [
          amountMantissa.toFixed(),
        ]);
  }

  // Handle withdraw flow
  if (!tokenContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  return withdrawFullSupply
    ? requestGaslessTransaction(tokenContract, 'redeem', [amountMantissa.toFixed()])
    : requestGaslessTransaction(tokenContract, 'redeemUnderlying', [amountMantissa.toFixed()]);
};

export default withdraw;
