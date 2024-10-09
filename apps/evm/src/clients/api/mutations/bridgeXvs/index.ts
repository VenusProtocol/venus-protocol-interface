import type BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { NULL_ADDRESS } from 'constants/address';
import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import type { XVSProxyOFTDest, XVSProxyOFTSrc } from 'libs/contracts';
import type { ChainId, ContractTxData } from 'types';

type BridgeContracts = XVSProxyOFTSrc | XVSProxyOFTDest;

export interface BridgeXvsInput {
  tokenBridgeContract: BridgeContracts;
  accountAddress: string;
  destinationChainId: ChainId;
  amountMantissa: BigNumber;
  nativeCurrencyFeeMantissa: BigNumber;
}

export type BridgeXvsOutput = ContractTxData<BridgeContracts, 'sendFrom'>;

const bridgeXvs = async ({
  tokenBridgeContract,
  accountAddress,
  destinationChainId,
  amountMantissa,
  nativeCurrencyFeeMantissa,
}: BridgeXvsInput): Promise<BridgeXvsOutput> => {
  const layerZeroDestChain = LAYER_ZERO_CHAIN_IDS[destinationChainId];
  return {
    contract: tokenBridgeContract,
    methodName: 'sendFrom',
    args: [
      accountAddress,
      layerZeroDestChain,
      ethers.utils.hexZeroPad(accountAddress, 32),
      amountMantissa.toFixed(),
      {
        adapterParams: DEFAULT_ADAPTER_PARAMS,
        refundAddress: accountAddress,
        zroPaymentAddress: NULL_ADDRESS,
      },
    ],
    overrides: {
      value: nativeCurrencyFeeMantissa.toFixed(),
    },
  };
};

export default bridgeXvs;
