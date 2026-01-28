import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { Mock } from 'vitest';
import useBridgeXvs from '..';

vi.mock('libs/contracts');

const fakeInput = {
  destinationChainId: ChainId.BSC_TESTNET,
  amountMantissa: new BigNumber('100000000000000000000'),
  nativeCurrencyFeeMantissa: new BigNumber('1000000000000000000'),
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useBridgeXvs', () => {
  beforeEach(() => {
    (useGetToken as Mock).mockImplementation(() => xvs);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useBridgeXvs(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      transactionType: 'layerZero',
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      },
      `
      {
        "abi": Any<Object>,
        "address": "0xfakeXVSProxyOFTSrcContractAddress",
        "args": [
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          10102,
          "0x0000000000000000000000003d759121234cd36F8124C21aFe1c6852d2bEd848",
          100000000000000000000n,
          {
            "adapterParams": "0x00010000000000000000000000000000000000000000000000000000000000061A80",
            "refundAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
            "zroPaymentAddress": "0x0000000000000000000000000000000000000000",
          },
        ],
        "functionName": "sendFrom",
        "value": 1000000000000000000n,
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when XVS Proxy OFT contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useBridgeXvs(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
