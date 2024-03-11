import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { NULL_ADDRESS } from 'constants/address';
import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import type { XVSProxyOFTSrc } from 'libs/contracts';
import { ChainId } from 'types';

import bridgeXvs from '.';

const fakeXvsAmount = new BigNumber('100000000000000000000');
const fakeNativeCurrencyFeeMantissa = new BigNumber('1000000000000000000');

const fakeSendFromParams = [
  fakeAddress,
  LAYER_ZERO_CHAIN_IDS[ChainId.BSC_TESTNET],
  '0x0000000000000000000000003d759121234cd36F8124C21aFe1c6852d2bEd848',
  fakeXvsAmount.toFixed(),
  {
    adapterParams: DEFAULT_ADAPTER_PARAMS,
    refundAddress: fakeAddress,
    zroPaymentAddress: NULL_ADDRESS,
  },
  {
    value: fakeNativeCurrencyFeeMantissa.toFixed(),
  },
];

describe('bridgeXvs', () => {
  test('returns contract transaction when request succeeds', async () => {
    const sendFromMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      sendFrom: sendFromMock,
    } as unknown as XVSProxyOFTSrc;

    const response = await bridgeXvs({
      tokenBridgeContract: fakeContract,
      accountAddress: fakeAddress,
      destinationChainId: ChainId.BSC_TESTNET,
      amountMantissa: fakeXvsAmount,
      nativeCurrencyFeeMantissa: fakeNativeCurrencyFeeMantissa,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(sendFromMock).toHaveBeenCalledTimes(1);
    expect(sendFromMock).toHaveBeenCalledWith(...fakeSendFromParams);
  });
});
