import type BigNumber from 'bignumber.js';
import type { ContractTransaction, Signer } from 'ethers';

import { type VBnb, getNativeTokenGatewayContract, getVTokenContract } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { VToken } from 'types';

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
  accountAddress: string;
  poolComptrollerContractAddress: string;
}

export type SupplyInput = SupplyMutationInput | WrapAndSupplyMutationInput;

export type SupplyOutput = ContractTransaction;

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
    return nativeTokenGatewayContract!.wrapAndSupply(input.accountAddress, {
      value: input.amountMantissa.toFixed(),
    });
  }

  // Handle supplying BNB
  if (input.vToken.underlyingToken.isNative) {
    const tokenContract = getVTokenContract({
      vToken: input.vToken,
      signerOrProvider: input.signer,
    }) as VBnb;

    return tokenContract.mint({
      value: input.amountMantissa.toFixed(),
    });
  }

  // Handle supplying tokens other that BNB
  const tokenContract = getVTokenContract({ vToken: input.vToken, signerOrProvider: input.signer });
  return tokenContract.mint(input.amountMantissa.toFixed());
};

export default supply;
