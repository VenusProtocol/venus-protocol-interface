import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getNativeTokenGatewayContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSupply } from '..';

import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { vBnb, vXvs } from '__mocks__/models/vTokens';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeAmountMantissa = new BigNumber('10000000000000000');

const fakeInput = {
  poolName: 'Fake Pool',
  vToken: vBnb,
  amountMantissa: fakeAmountMantissa,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useSupply', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    (getNativeTokenGatewayContractAddress as Mock).mockImplementation(
      () => 'fakeNativeTokenGatewayContractAddress',
    );
  });

  it('calls useSendTransaction with the correct parameters for supplying native currency', async () => {
    renderHook(() => useSupply(fakeOptions), {
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
        "address": "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
        "functionName": "mint",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens supplied",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "BNB",
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(6);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for supplying non-native tokens', async () => {
    renderHook(() => useSupply(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const customFakeInput = {
      poolName: 'Fake Pool',
      vToken: vXvs,
      amountMantissa: fakeAmountMantissa,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(customFakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
        "args": [
          10000000000000000n,
        ],
        "functionName": "mint",
      }
    `,
    );

    onConfirmed({ input: customFakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens supplied",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "XVS",
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(6);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for wrap and supply flow', async () => {
    renderHook(() => useSupply(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const customFakeInput = {
      poolName: 'Fake Pool',
      vToken: vBnb,
      amountMantissa: fakeAmountMantissa,
      wrap: true,
      poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
    } as const;

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(customFakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "fakeNativeTokenGatewayContractAddress",
        "args": [
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
        ],
        "functionName": "wrapAndSupply",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: customFakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens supplied",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "BNB",
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(7);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when account address is not available', async () => {
    renderHook(() => useSupply(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when wrap is true but NativeTokenGateway contract address is not available', async () => {
    (getNativeTokenGatewayContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useSupply(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const customFakeInput = {
      poolName: 'Fake Pool',
      vToken: vBnb,
      amountMantissa: fakeAmountMantissa,
      wrap: true,
      poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
    } as const;

    await expect(async () => fn(customFakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
