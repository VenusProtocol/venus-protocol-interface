import type BigNumber from 'bignumber.js';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ContractTxData, VToken } from 'types';
import type { AccessList, Address, PublicClient } from 'viem';

export interface BorrowInput {
  vToken: VToken;
  publicClient: PublicClient;
  amountMantissa: BigNumber;
  unwrap?: boolean;
  vTokenContract?: VBep20 | VBnb;
  nativeTokenGatewayContract?: NativeTokenGateway;
}

type BorrowAndUnwrapTxOuput = ContractTxData<NativeTokenGateway, 'borrowAndUnwrap'>;

type BorrowTxOutput = ContractTxData<VBep20 | VBnb, 'borrow'>;

export type BorrowOutput = Promise<BorrowAndUnwrapTxOuput | BorrowTxOutput>;

const borrow = async ({
  vToken,
  publicClient,
  vTokenContract,
  nativeTokenGatewayContract,
  unwrap = false,
  amountMantissa,
}: BorrowInput): BorrowOutput => {
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

  // Add access list if underlying token is native. This is a workaround for the "transfer" and
  // "send" actions being limited to 2300 gas, which is insufficient post-Berlin fork (EIP-2929).
  // Adding an access list pays the gas ahead, reducing the runtime cost to 100 gas.
  let accessList: AccessList | undefined;

  if (vToken.underlyingToken.isNative) {
    const accountAddress = (await vTokenContract.signer.getAddress()) as Address;
    const { accessList: tmpAccessList } = await publicClient.createAccessList({
      data: '0x',
      value: 1n,
      to: accountAddress,
    });

    accessList = tmpAccessList;
  }

  const overrides = accessList ? { accessList } : undefined;

  // Handle borrow flow
  return {
    contract: vTokenContract,
    methodName: 'borrow',
    args: [amountMantissa.toFixed()],
    overrides,
  };
};

export default borrow;
