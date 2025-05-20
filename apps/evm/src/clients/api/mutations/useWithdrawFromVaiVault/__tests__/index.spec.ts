import fakeAccountAddress, {
  altAddress as vaiVaultContractAddress,
} from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetVaiVaultContractAddress } from 'libs/contracts';
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
    (useGetVaiVaultContractAddress as Mock).mockImplementation(() => vaiVaultContractAddress);
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

    expect(await fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: vaiVaultContractAddress,
      functionName: 'withdraw',
      args: [fakeInput.amountMantissa],
    });

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
    (useGetVaiVaultContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useWithdrawFromVaiVault(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
