import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { vBnb, vWeth, vXvs } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useRepay } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeAmountMantissa = new BigNumber('10000000000000000');

const fakeInput = {
  poolName: 'Fake Pool',
  vToken: vXvs,
  amountMantissa: fakeAmountMantissa,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useRepay', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters for repaying non-BNB token', async () => {
    renderHook(() => useRepay(fakeOptions), {
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
        "address": "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
        "args": [
          10000000000000000n,
        ],
        "functionName": "repayBorrow",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for repaying full BNB loan', async () => {
    renderHook(() => useRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const repayFullLoanInput = {
      ...fakeInput,
      vToken: vBnb,
      repayFullLoan: true,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(repayFullLoanInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      }, `
      {
        "abi": Any<Array>,
        "address": "0xfakeMaximillionContractAddress",
        "args": [
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
        ],
        "functionName": "repayBehalfExplicit",
        "value": 10010000000000000n,
      }
    `);

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens repaid",
        {
          "poolName": "Fake Pool",
          "repaidFullLoan": false,
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for repaying partial BNB loan', async () => {
    renderHook(() => useRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const repayPartialInput = {
      ...fakeInput,
      vToken: vBnb,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(repayPartialInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
        "functionName": "repayBorrow",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens repaid",
        {
          "poolName": "Fake Pool",
          "repaidFullLoan": false,
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for wrapping and repaying', async () => {
    renderHook(() => useRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const wrapAndRepayInput = {
      ...fakeInput,
      vToken: vWeth,
      wrap: true,
      poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(wrapAndRepayInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      }, `
      {
        "abi": Any<Array>,
        "address": "0xfakeNativeTokenGatewayContractAddress",
        "functionName": "wrapAndRepay",
        "value": 10000000000000000n,
      }
    `);

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens repaid",
        {
          "poolName": "Fake Pool",
          "repaidFullLoan": false,
          "tokenAmountTokens": 0.01,
          "tokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when account address is not available', async () => {
    renderHook(() => useRepay(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when repaying full BNB loan but maximillion contract address is not available', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const repayFullLoanInput = {
      ...fakeInput,
      vToken: vBnb,
      repayFullLoan: true,
    };

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(repayFullLoanInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when wrapping and repaying but native token gateway contract address is not available', async () => {
    (getContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const wrapAndRepayInput = {
      ...fakeInput,
      wrap: true,
      poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
    };

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(wrapAndRepayInput)).rejects.toThrow('somethingWentWrong');
  });
});
