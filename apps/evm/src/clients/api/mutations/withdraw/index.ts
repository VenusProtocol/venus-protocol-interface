import type BigNumber from 'bignumber.js';

import type { NativeTokenGateway, VBep20, VBnb } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { LooseEthersContractTxData, VToken } from 'types';
import type { AccessList, Address, PublicClient } from 'viem';

export interface WithdrawInput {
  vToken: VToken;
  publicClient: PublicClient;
  amountMantissa: BigNumber;
  tokenContract?: VBep20 | VBnb;
  nativeTokenGatewayContract?: NativeTokenGateway;
  withdrawFullSupply?: boolean;
  unwrap?: boolean;
}

export type WithdrawOutput = LooseEthersContractTxData;

const withdraw = async ({
  vToken,
  publicClient,
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

  // Add access list if underlying token is native. This is a workaround for the "transfer" and
  // "send" actions being limited to 2300 gas, which is insufficient post-Berlin fork (EIP-2929).
  // Adding an access list pays the gas ahead, reducing the runtime cost to 100 gas.
  let accessList: AccessList | undefined;

  if (vToken.underlyingToken.isNative) {
    const accountAddress = (await tokenContract.signer.getAddress()) as Address;
    const { accessList: tmpAccessList } = await publicClient.createAccessList({
      data: '0x',
      value: 1n,
      to: accountAddress,
    });

    accessList = tmpAccessList;
  }

  const overrides = accessList ? { accessList } : undefined;

  return withdrawFullSupply
    ? { contract: tokenContract, methodName: 'redeem', args: [amountMantissa.toFixed()], overrides }
    : {
        contract: tokenContract,
        methodName: 'redeemUnderlying',
        args: [amountMantissa.toFixed()],
        overrides,
      };
};

export default withdraw;
