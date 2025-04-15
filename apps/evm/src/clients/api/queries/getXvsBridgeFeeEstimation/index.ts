import BigNumber from 'bignumber.js';
import { type Address, type PublicClient, pad } from 'viem';

import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { xVSProxyOFTSrcAbi } from 'libs/contracts';
import type { ChainId } from 'types';

export interface GetXvsBridgeEstimationInput {
  accountAddress: Address;
  destinationChain: ChainId;
  amountMantissa: bigint;
  publicClient: PublicClient;
  tokenBridgeContractAddress: Address;
}

export interface GetXvsBridgeEstimationOutput {
  estimationFeeMantissa: BigNumber;
}

export const getXvsBridgeFeeEstimation = async ({
  accountAddress,
  destinationChain,
  amountMantissa,
  publicClient,
  tokenBridgeContractAddress,
}: GetXvsBridgeEstimationInput): Promise<GetXvsBridgeEstimationOutput> => {
  const layerZeroDestinationChain = LAYER_ZERO_CHAIN_IDS[destinationChain];

  const estimationData = await publicClient.readContract({
    address: tokenBridgeContractAddress,
    // We should normally pass either the SRC or the DEST contract ABI based on the direction of the
    // transfer, but since both use the same definition for the estimateSendFee function it does not
    // matter
    abi: xVSProxyOFTSrcAbi,
    functionName: 'estimateSendFee',
    args: [
      layerZeroDestinationChain,
      pad(accountAddress), // Convert address to bytes32 format
      amountMantissa,
      false,
      DEFAULT_ADAPTER_PARAMS,
    ],
  });

  const nativeFee = estimationData[0];

  return {
    estimationFeeMantissa: new BigNumber(nativeFee.toString()),
  };
};
