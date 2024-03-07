import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { NativeTokenGateway } from 'libs/contracts';

export interface RedeemAndUnwrapInput {
  nativeTokenGatewayContract: NativeTokenGateway;
  amountMantissa: BigNumber;
}

export type RedeemAndUnwrapOutput = ContractTransaction;

const redeemAndUnwrap = async ({
  nativeTokenGatewayContract,
  amountMantissa,
}: RedeemAndUnwrapInput) =>
  nativeTokenGatewayContract.redeemUnderlyingAndUnwrap(amountMantissa.toFixed());

export default redeemAndUnwrap;
