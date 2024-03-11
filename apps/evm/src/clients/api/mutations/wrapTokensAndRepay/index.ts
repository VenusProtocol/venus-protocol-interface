import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { NativeTokenGateway } from 'libs/contracts';

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
