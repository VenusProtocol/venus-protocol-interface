import fakeAccountAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useWithdrawFromVaiVault } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  amountMantissa: 1000n,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useWithdrawFromVaiVault', () => {
  beforeEach(() => {
    (useGetToken as Mock).mockImplementation(() => vai);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useWithdrawFromVaiVault(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot({
      abi: expect.any(Array),
    }, `
      {
        "abi": Any<Array>,
        "address": "0xfakeVaiVaultContractAddress",
        "args": [
          1000n,
        ],
        "functionName": "withdraw",
      }
    `);

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens withdrawn from VAI vault",
        {
          "tokenAmountTokens": 1e-15,
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(5);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when VAI Vault contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useWithdrawFromVaiVault(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
