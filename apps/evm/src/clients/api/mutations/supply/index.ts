import type BigNumber from 'bignumber.js';
import type { Signer } from 'ethers';

import {
  type NativeTokenGateway,
  type VBep20,
  type VBnb,
  getNativeTokenGatewayContract,
  getVTokenContract,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import type { ContractTxData, VToken } from 'types';
import type { Address } from 'viem';

interface SharedInput {
  amountMantissa: BigNumber;
  signer: Signer;
}

export interface SupplyMutationInput extends SharedInput {
  vToken: VToken;
  wrap?: false;
}

export interface WrapAndSupplyMutationInput extends SharedInput {
  wrap: true;
  accountAddress: Address;
  poolComptrollerContractAddress: Address;
}

export type SupplyInput = SupplyMutationInput | WrapAndSupplyMutationInput;

export type SupplyOutput =
  | ContractTxData<VBep20 | VBnb, 'mint'>
  | ContractTxData<NativeTokenGateway, 'wrapAndSupply'>;

const supply = async (input: SupplyInput): Promise<SupplyOutput> => {
  // Handle wrap and supply flow
  const nativeTokenGatewayContract = input.wrap
    ? getNativeTokenGatewayContract({
        signerOrProvider: input.signer,
        chainId: await input.signer.getChainId(),
        comptrollerContractAddress: input.poolComptrollerContractAddress,
      })
    : undefined;

  if (input.wrap && !nativeTokenGatewayContract) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (input.wrap) {
    return {
      contract: nativeTokenGatewayContract!,
      methodName: 'wrapAndSupply',
      args: [input.accountAddress],
      overrides: {
        value: input.amountMantissa.toFixed(),
      },
    };
  }

  // Handle supplying BNB
  if (input.vToken.underlyingToken.isNative) {
    const tokenContract = getVTokenContract({
      vToken: input.vToken,
      signerOrProvider: input.signer,
    }) as VBnb;

    return {
      contract: tokenContract,
      methodName: 'mint',
      args: [],
      overrides: {
        value: input.amountMantissa.toFixed(),
      },
    };
  }

  // Handle supplying tokens other that BNB
  const tokenContract = getVTokenContract({ vToken: input.vToken, signerOrProvider: input.signer });
  return { contract: tokenContract, methodName: 'mint', args: [input.amountMantissa.toFixed()] };
};

export default supply;
