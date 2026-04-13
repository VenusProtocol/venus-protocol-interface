import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useDepositToInstitutionalVault } from '..';

vi.mock('libs/contracts');

const fakeVaultAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;

const fakeInput = {
  amountMantissa: new BigNumber('1000000000000000000'),
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useDepositToInstitutionalVault', () => {
  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(
      () => useDepositToInstitutionalVault({ vaultAddress: fakeVaultAddress }, fakeOptions),
      { accountAddress: fakeAccountAddress },
    );

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
        "address": "0x1234567890abcdef1234567890abcdef12345678",
        "args": [
          1000000000000000000n,
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
        ],
        "functionName": "deposit",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Institutional vault deposit', {
      vaultAddress: fakeVaultAddress,
    });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when account address is not available', async () => {
    renderHook(() =>
      useDepositToInstitutionalVault({ vaultAddress: fakeVaultAddress }, fakeOptions),
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
