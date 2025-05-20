import fakeAccountAddress from '__mocks__/models/address';
import { vWeth, vXvs } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getNativeTokenGatewayContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useBorrow } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  vToken: vXvs,
  poolName: 'Pool 1',
  poolComptrollerAddress: '0x456',
  amountMantissa: 1000n,
  unwrap: false,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useBorrow', () => {
  beforeEach(() => {
    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: {
        createAccessList: vi.fn(() => ({
          accessList: 'fake-access-list',
        })),
      },
    }));

    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters for regular borrow', async () => {
    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "accessList": undefined,
        "address": "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
        "args": [
          1000n,
        ],
        "functionName": "borrow",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens borrowed",
        {
          "poolName": "Pool 1",
          "tokenAmountTokens": 1e-15,
          "tokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for borrow and unwrap', async () => {
    const nativeTokenGatewayAddress = '0x789';
    (getNativeTokenGatewayContractAddress as Mock).mockReturnValue(nativeTokenGatewayAddress);

    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    const borrowAndUnwrapInput = {
      ...fakeInput,
      vToken: vWeth,
      unwrap: true,
    };

    expect(await fn(borrowAndUnwrapInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0x789",
        "args": [
          1000n,
        ],
        "functionName": "borrowAndUnwrap",
      }
    `,
    );

    onConfirmed({ input: borrowAndUnwrapInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens borrowed",
        {
          "poolName": "Pool 1",
          "tokenAmountTokens": 1e-15,
          "tokenSymbol": "WETH",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for native token borrow', async () => {
    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    const nativeTokenInput = {
      ...fakeInput,
      vToken: {
        ...vXvs,
        underlyingToken: {
          ...vXvs.underlyingToken,
          isNative: true,
        },
      },
    };

    expect(await fn(nativeTokenInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "accessList": "fake-access-list",
        "address": "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
        "args": [
          1000n,
        ],
        "functionName": "borrow",
      }
    `,
    );

    onConfirmed({ input: nativeTokenInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens borrowed",
        {
          "poolName": "Pool 1",
          "tokenAmountTokens": 1e-15,
          "tokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when native token gateway contract address is not available for unwrap', async () => {
    (getNativeTokenGatewayContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const borrowAndUnwrapInput = {
      ...fakeInput,
      vToken: vWeth,
      unwrap: true,
    };

    expect(async () => fn(borrowAndUnwrapInput)).rejects.toThrow('somethingWentWrong');
  });
});
