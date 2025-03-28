import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import type { XVSProxyOFTDest, XVSProxyOFTSrc } from 'libs/contracts';
import type { ChainId } from 'types';

export interface GetXvsBridgeEstimationInput {
  accountAddress: string;
  destinationChain: ChainId;
  amountMantissa: BigNumber;
  tokenBridgeContract: XVSProxyOFTSrc | XVSProxyOFTDest;
}

export interface GetXvsBridgeEstimationOutput {
  estimationFeeMantissa: BigNumber;
}

export const getXvsBridgeFeeEstimation = async ({
  accountAddress,
  destinationChain,
  amountMantissa,
  tokenBridgeContract,
}: GetXvsBridgeEstimationInput): Promise<GetXvsBridgeEstimationOutput> => {
  const layerZeroDestinationChain = LAYER_ZERO_CHAIN_IDS[destinationChain];
  const estimationData = await tokenBridgeContract.estimateSendFee(
    layerZeroDestinationChain,
    ethers.utils.hexZeroPad(accountAddress, 32),
    amountMantissa.toFixed(),
    false,
    DEFAULT_ADAPTER_PARAMS,
  );

  return {
    estimationFeeMantissa: new BigNumber(estimationData.nativeFee.toString()),
  };
};
