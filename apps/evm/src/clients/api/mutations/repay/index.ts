import type BigNumber from 'bignumber.js';
import type { Signer } from 'ethers';

import MAX_UINT256 from 'constants/maxUint256';
import {
  type Maximillion,
  type NativeTokenGateway,
  type VBnb,
  getVTokenContract,
} from 'libs/contracts';
import { VError } from 'libs/errors';
import type { LooseEthersContractTxData, VToken } from 'types';
import { callOrThrow } from 'utilities';

export interface RepayInput {
  signer: Signer;
  vToken: VToken;
  amountMantissa: BigNumber;
  repayFullLoan?: boolean;
  wrap?: boolean;
  maximillionContract?: Maximillion;
  nativeTokenGatewayContract?: NativeTokenGateway;
}

export type RepayOutput = LooseEthersContractTxData;

const repay = async ({
  signer,
  vToken,
  amountMantissa,
  maximillionContract,
  nativeTokenGatewayContract,
  wrap = false,
  repayFullLoan = false,
}: RepayInput): Promise<RepayOutput> => {
  // Handle repaying full BNB loan.  Note that we only check for the isNative prop; that's because
  // at the moment BNB is the only native market we have
  if (vToken.underlyingToken.isNative && repayFullLoan) {
    return callOrThrow({ maximillionContract, signer }, async ({ maximillionContract }) => {
      const accountAddress = await signer.getAddress();

      return {
        contract: maximillionContract,
        methodName: 'repayBehalfExplicit',
        args: [accountAddress, vToken.address],
        overrides: {
          value: amountMantissa.toFixed(),
        },
      };
    });
  }

  // Handle repaying partial BNB loan
  if (vToken.underlyingToken.isNative) {
    const vBnbContract = getVTokenContract({
      vToken,
      signerOrProvider: signer,
    }) as VBnb;

    return {
      contract: vBnbContract,
      methodName: 'repayBorrow',
      args: [],
      overrides: {
        value: amountMantissa.toFixed(),
      },
    };
  }

  // Handle repaying native loan by first wrapping tokens
  if (wrap && (!nativeTokenGatewayContract || !vToken.underlyingToken.tokenWrapped)) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if (wrap && nativeTokenGatewayContract) {
    return {
      contract: nativeTokenGatewayContract,
      methodName: 'wrapAndRepay',
      args: [],
      overrides: {
        value: amountMantissa.toFixed(),
      },
    };
  }

  // Handle repaying tokens other than native
  const vTokenContract = getVTokenContract({ vToken, signerOrProvider: signer });

  return {
    contract: vTokenContract,
    methodName: 'repayBorrow',
    args: [repayFullLoan ? MAX_UINT256.toFixed() : amountMantissa.toFixed()],
  };
};

export default repay;
