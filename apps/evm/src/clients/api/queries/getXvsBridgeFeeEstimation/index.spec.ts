import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { XVSProxyOFTSrc } from 'libs/contracts';

import fakeAddress from '__mocks__/models/address';

import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { ChainId } from 'types';

import getXvsBridgeFeeEstimation from '.';

const fakeAmountMantissa = new BigNumber('1234000');

const fakeSendEstimateFeeParams = [
  LAYER_ZERO_CHAIN_IDS[ChainId.BSC_TESTNET],
  '0x0000000000000000000000003d759121234cd36F8124C21aFe1c6852d2bEd848',
  fakeAmountMantissa.toFixed(),
  false,
  DEFAULT_ADAPTER_PARAMS,
];

describe('getXvsBridgeFeeEstimation', () => {
  test('returns the estimation on success', async () => {
    const fakeXvsBridgeEstimationMantissa = {
      nativeFee: BN.from('5000'),
      zroFee: BN.from('1000'),
    };

    const estimateSendFeeMock = vi.fn(async () => fakeXvsBridgeEstimationMantissa);

    const fakeContract = {
      estimateSendFee: estimateSendFeeMock,
    } as unknown as XVSProxyOFTSrc;

    const response = await getXvsBridgeFeeEstimation({
      tokenBridgeContract: fakeContract,
      amountMantissa: fakeAmountMantissa,
      destinationChain: ChainId.BSC_TESTNET,
      accountAddress: fakeAddress,
    });

    expect(estimateSendFeeMock).toHaveBeenCalledTimes(1);
    expect(estimateSendFeeMock).toHaveBeenCalledWith(...fakeSendEstimateFeeParams);
    expect(response).toEqual({
      estimationFeeMantissa: new BigNumber('5000'),
    });
  });
});
