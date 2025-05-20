import fakeAccountAddress, {
  altAddress as fakeXvsVaultContractAddress,
} from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useExecuteWithdrawalFromXvsVault } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  poolIndex: 0,
  rewardTokenAddress: '0x123' as const,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useExecuteWithdrawalFromXvsVault', () => {
  beforeEach(() => {
    (useGetXvsVaultContractAddress as Mock).mockReturnValue(fakeXvsVaultContractAddress);
    (useGetToken as Mock).mockReturnValue(xvs);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useExecuteWithdrawalFromXvsVault({ stakedToken: vai }, fakeOptions), {
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
        "address": "0xa258a693A403b7e98fd05EE9e1558C760308cFC7",
        "args": [
          "0x123",
          0n,
        ],
        "functionName": "executeWithdrawal",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith(
      'Token withdrawals executed from XVS vault',
      {
        poolIndex: fakeInput.poolIndex,
        rewardTokenSymbol: 'XVS',
      },
    );

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetXvsVaultContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useExecuteWithdrawalFromXvsVault({ stakedToken: vai }, fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
