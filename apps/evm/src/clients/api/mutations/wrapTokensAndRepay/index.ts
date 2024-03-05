import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { NativeTokenGateway } from 'libs/contracts';

export interface WrapTokensAndRepayInput {
  nativeTokenGatewayContract: NativeTokenGateway;
  amountMantissa: BigNumber;
}

export type WrapTokensAndRepayOutput = ContractTransaction;

const wrapTokensAndRepay = async ({
  nativeTokenGatewayContract,
  amountMantissa,
}: WrapTokensAndRepayInput) =>
  nativeTokenGatewayContract.wrapAndRepay({
    value: amountMantissa.toFixed(),
  });

export default wrapTokensAndRepay;
