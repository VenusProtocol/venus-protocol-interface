import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useWithdrawFromSpoke } from '..';

const spokePool = spokePools[0];
const { vToken } = spokePool.assets.find(({ isBorrowable }) => !isBorrowable)!;
const fakeInput = {
  vToken,
  poolName: spokePool.name,
  amountMantissa: new BigNumber('10000000'),
  withdrawFullSupply: false,
};

const fakeOptions = {
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useWithdrawFromSpoke', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('redeems the given underlying amount and refreshes the spoke pools', () => {
    renderHook(() => useWithdrawFromSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: vToken.address,
      functionName: 'redeemUnderlying',
      args: [10000000n],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens withdrawn', {
      poolName: spokePool.name,
      tokenSymbol: vToken.underlyingToken.symbol,
      tokenAmountTokens: 10,
      withdrewFullSupply: false,
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_SPOKE_POOLS],
    });
  });

  it('redeems every vToken when withdrawing the full supply', () => {
    renderHook(() => useWithdrawFromSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      fn({
        ...fakeInput,
        withdrawFullSupply: true,
        vTokenBalanceMantissa: new BigNumber('100000000000'),
      }),
    ).toMatchObject({
      functionName: 'redeem',
      args: [100000000000n],
    });
  });

  it('throws when withdrawing the full supply without a vToken balance', () => {
    renderHook(() => useWithdrawFromSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn({ ...fakeInput, withdrawFullSupply: true })).toThrow();
  });
});
