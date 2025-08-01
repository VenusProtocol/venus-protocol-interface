import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { vBnb, vUsdt, vWeth } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useWithdraw } from '..';

vi.mock('libs/contracts');

const fakeAmountMantissa = new BigNumber('10000000000000000');

const fakeInput = {
  vToken: vUsdt,
  amountMantissa: fakeAmountMantissa,
  poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
  poolName: 'Fake Pool',
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useWithdraw', () => {
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

  it('calls useSendTransaction with the correct parameters when withdrawing tokens', async () => {
    renderHook(() => useWithdraw(fakeOptions), {
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
        "address": "0xb7526572FFE56AB9D7489838Bf2E18e3323b441A",
        "args": [
          10000000000000000n,
        ],
        "functionName": "redeemUnderlying",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens withdrawn",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 10000000000,
          "tokenSymbol": "USDT",
          "withdrewFullSupply": false,
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when withdrawing full supply', async () => {
    renderHook(() => useWithdraw(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const withdrawFullSupplyInput = {
      ...fakeInput,
      withdrawFullSupply: true,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(withdrawFullSupplyInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "accessList": undefined,
        "address": "0xb7526572FFE56AB9D7489838Bf2E18e3323b441A",
        "args": [
          10000000000000000n,
        ],
        "functionName": "redeem",
      }
    `,
    );

    onConfirmed({ input: withdrawFullSupplyInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens withdrawn",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 10000000000,
          "tokenSymbol": "USDT",
          "withdrewFullSupply": false,
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when withdrawing and unwrapping tokens', async () => {
    renderHook(() => useWithdraw(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const withdrawAndUnwrapInput = {
      ...fakeInput,
      vToken: vWeth,
      unwrap: true,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(withdrawAndUnwrapInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeNativeTokenGatewayContractAddress",
        "args": [
          10000000000000000n,
        ],
        "functionName": "redeemUnderlyingAndUnwrap",
      }
    `,
    );

    onConfirmed({ input: withdrawAndUnwrapInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens withdrawn",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "WETH",
          "withdrewFullSupply": false,
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when withdrawing full supply and unwrapping', async () => {
    renderHook(() => useWithdraw(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const withdrawFullSupplyAndUnwrapInput = {
      ...fakeInput,
      vToken: vBnb,
      withdrawFullSupply: true,
      unwrap: true,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(withdrawFullSupplyAndUnwrapInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeNativeTokenGatewayContractAddress",
        "args": [
          10000000000000000n,
        ],
        "functionName": "redeemAndUnwrap",
      }
    `,
    );

    onConfirmed({ input: withdrawFullSupplyAndUnwrapInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens withdrawn",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "BNB",
          "withdrewFullSupply": false,
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when withdrawing native token', async () => {
    renderHook(() => useWithdraw(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const withdrawNativeInput = {
      ...fakeInput,
      vToken: vBnb,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(withdrawNativeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "accessList": "fake-access-list",
        "address": "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
        "args": [
          10000000000000000n,
        ],
        "functionName": "redeemUnderlying",
      }
    `,
    );

    onConfirmed({ input: withdrawNativeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens withdrawn",
        {
          "poolName": "Fake Pool",
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "BNB",
          "withdrewFullSupply": false,
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when account address is not available', async () => {
    renderHook(() => useWithdraw(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when native token gateway contract address is not available for unwrap', async () => {
    (getContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useWithdraw(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const withdrawAndUnwrapInput = {
      ...fakeInput,
      vToken: vWeth,
      unwrap: true,
    };

    expect(async () => fn(withdrawAndUnwrapInput)).rejects.toThrow('somethingWentWrong');
  });
});
