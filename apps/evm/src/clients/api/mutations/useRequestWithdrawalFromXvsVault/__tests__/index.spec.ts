import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import type { Mock } from 'vitest';
import { useRequestWithdrawalFromXvsVault } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  rewardTokenAddress: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47' as Address,
  poolIndex: 4n,
  amountMantissa: 1000000000000n,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useRequestWithdrawalFromXvsVault', () => {
  beforeEach(() => {
    (useGetToken as Mock).mockImplementation(() => xvs);
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useRequestWithdrawalFromXvsVault(fakeOptions), {
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
        "address": "0xfakeXvsVaultContractAddress",
        "args": [
          "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
          4n,
          1000000000000n,
        ],
        "functionName": "requestWithdrawal",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Token withdrawal requested from XVS vault",
        {
          "poolIndex": 4,
          "rewardTokenSymbol": "XVS",
          "tokenAmountTokens": 0.000001,
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when XVS Vault contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useRequestWithdrawalFromXvsVault(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
