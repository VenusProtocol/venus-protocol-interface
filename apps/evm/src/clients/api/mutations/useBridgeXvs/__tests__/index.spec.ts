import fakeAccountAddress, {
  altAddress as xvsProxyOFTContractAddress,
} from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetXVSProxyOFTSrcContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { Mock } from 'vitest';
import useBridgeXvs from '..';

vi.mock('hooks/useSendTransaction');
vi.mock('libs/analytics');
vi.mock('libs/contracts');
vi.mock('libs/tokens');
vi.mock('libs/wallet');

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
    (useGetXVSProxyOFTSrcContractAddress as Mock).mockImplementation(
      () => xvsProxyOFTContractAddress,
    );
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
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          10102,
          "0x0000000000000000000000003d759121234cd36F8124C21aFe1c6852d2bEd848",
          100000000000000000000n,
          {
            "adapterParams": "0x000100000000000000000000000000000000000000000000000000000000000493E0",
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
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_TOKEN_ALLOWANCE",
              {
                "accountAddress": {
                  "amountMantissa": "100000000000000000000",
                  "destinationChainId": 97,
                  "nativeCurrencyFeeMantissa": "1000000000000000000",
                },
                "chainId": 97,
                "tokenAddress": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_TOKEN_BALANCES",
              {
                "accountAddress": {
                  "amountMantissa": "100000000000000000000",
                  "destinationChainId": 97,
                  "nativeCurrencyFeeMantissa": "1000000000000000000",
                },
                "chainId": 97,
              },
            ],
          },
        ],
      ]
    `);
  });

  it('throws error when XVS Proxy OFT contract address is not found', async () => {
    (useGetXVSProxyOFTSrcContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useBridgeXvs(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
