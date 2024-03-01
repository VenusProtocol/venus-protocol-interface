import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { NativeTokenGateway } from 'libs/contracts';

export interface WrapTokensAndSupplyInput {
  nativeTokenGatewayContract: NativeTokenGateway;
  amountMantissa: BigNumber;
  accountAddress: string;
}

export type WrapTokensAndSupplyOutput = ContractTransaction;

const wrapTokensAndSupply = async ({
  nativeTokenGatewayContract,
  accountAddress,
  amountMantissa,
}: WrapTokensAndSupplyInput) =>
  nativeTokenGatewayContract.wrapAndSupply(accountAddress, {
    value: amountMantissa.toFixed(),
  });

export default wrapTokensAndSupply;
