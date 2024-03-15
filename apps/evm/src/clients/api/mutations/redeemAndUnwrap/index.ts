import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { NativeTokenGateway } from 'libs/contracts';

export interface RedeemAndUnwrapInput {
  nativeTokenGatewayContract: NativeTokenGateway;
  amountMantissa: BigNumber;
}

export type RedeemAndUnwrapOutput = ContractTransaction;

const redeemAndUnwrap = async ({
  nativeTokenGatewayContract,
  amountMantissa,
}: RedeemAndUnwrapInput) => nativeTokenGatewayContract.redeemAndUnwrap(amountMantissa.toFixed());

export default redeemAndUnwrap;
