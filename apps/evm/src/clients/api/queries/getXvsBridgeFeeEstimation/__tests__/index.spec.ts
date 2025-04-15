import BigNumber from 'bignumber.js';
import { type Hex, type PublicClient, pad } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { xVSProxyOFTSrcAbi } from 'libs/contracts'; // Using src chain ABI
import { ChainId } from 'types';

import { getXvsBridgeFeeEstimation } from '..';

// Use bigint instead of BigNumber for amountMantissa
const fakeAmountMantissa = 1234000n;
const fakeTokenBridgeContractAddress = '0xbridgeContractAddress';

// Use viem's pad function in the actual code
const fakeAccountAddressBytes32 = pad(fakeAddress);

const fakeExpectedArgs = [
  LAYER_ZERO_CHAIN_IDS[ChainId.BSC_TESTNET],
  fakeAccountAddressBytes32,
  fakeAmountMantissa,
  false,
  DEFAULT_ADAPTER_PARAMS as Hex,
];

describe('getXvsBridgeFeeEstimation', () => {
  test('returns the estimation on success', async () => {
    const fakeNativeFeeMantissa = 5000n;
    const fakeZroFeeMantissa = 1000n;

    const readContractMock = vi.fn().mockResolvedValue([fakeNativeFeeMantissa, fakeZroFeeMantissa]);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsBridgeFeeEstimation({
      publicClient: fakePublicClient,
      tokenBridgeContractAddress: fakeTokenBridgeContractAddress,
      amountMantissa: fakeAmountMantissa,
      destinationChain: ChainId.BSC_TESTNET,
      accountAddress: fakeAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeTokenBridgeContractAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'estimateSendFee',
      args: fakeExpectedArgs,
    });
    expect(response).toEqual({
      estimationFeeMantissa: new BigNumber(fakeNativeFeeMantissa.toString()),
    });
  });
});
