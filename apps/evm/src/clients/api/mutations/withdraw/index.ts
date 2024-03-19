import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';

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

  if (unwrap) {
    return withdrawFullSupply
      ? nativeTokenGatewayContract!.redeemUnderlyingAndUnwrap(amountMantissa.toFixed())
      : nativeTokenGatewayContract!.redeemAndUnwrap(amountMantissa.toFixed());
  }

  // Handle withdraw flow
  if (!tokenContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  return withdrawFullSupply
    ? tokenContract.redeemUnderlying(amountMantissa.toFixed())
    : tokenContract.redeem(amountMantissa.toFixed());
};

export default withdraw;
