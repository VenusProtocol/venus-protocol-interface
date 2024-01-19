import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { XVSProxyOFTDest, XVSProxyOFTSrc } from 'packages/contracts';
import { ChainId } from 'types';

export interface GetXvsBridgeEstimationInput {
  accountAddress: string;
  destinationChain: ChainId;
  amountMantissa: BigNumber;
  tokenBridgeContract: XVSProxyOFTSrc | XVSProxyOFTDest;
}

export interface GetXvsBridgeEstimationOutput {
  estimationFeeMantissa: BigNumber;
}

const getXvsBridgeFeeEstimation = async ({
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

export default getXvsBridgeFeeEstimation;
