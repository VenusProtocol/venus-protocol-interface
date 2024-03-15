import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { NativeTokenGateway } from 'libs/contracts';

export interface RedeemUnderlyingAndUnwrapInput {
  nativeTokenGatewayContract: NativeTokenGateway;
  amountMantissa: BigNumber;
}

export type RedeemUnderlyingAndUnwrapOutput = ContractTransaction;

const redeemUnderlyingAndUnwrap = async ({
  nativeTokenGatewayContract,
  amountMantissa,
}: RedeemUnderlyingAndUnwrapInput) =>
  nativeTokenGatewayContract.redeemUnderlyingAndUnwrap(amountMantissa.toFixed());

export default redeemUnderlyingAndUnwrap;
