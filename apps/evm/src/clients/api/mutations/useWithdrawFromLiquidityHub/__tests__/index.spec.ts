import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useWithdrawFromLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const fakePartialInput = {
  liquidityHub,
  amountMantissa: new BigNumber('1000000000000000000'),
};
const fakeFullInput = {
  ...fakePartialInput,
  withdrawFullSupply: true,
  userVhTokenBalanceMantissa: new BigNumber('39622641509433962264'),
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useWithdrawFromLiquidityHub', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('withdraws underlying tokens for partial withdrawals', () => {
    renderHook(() => useWithdrawFromLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakePartialInput)).toEqual({
      abi: expect.any(Array),
      address: liquidityHub.vhToken.address,
      functionName: 'withdraw',
      args: [1000000000000000000n, fakeAccountAddress, fakeAccountAddress],
    });

    onConfirmed({ input: fakePartialInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens withdrawn', {
      poolName: 'liquidity_hub',
      tokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
      tokenAmountTokens: 1,
      withdrewFullSupply: false,
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_LIQUIDITY_HUB,
        {
          vhTokenAddress: liquidityHub.vhToken.address,
        },
      ],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_LIQUIDITY_HUBS],
    });
  });

  it('redeems shares for full withdrawals', () => {
    renderHook(() => useWithdrawFromLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeFullInput)).toEqual({
      abi: expect.any(Array),
      address: liquidityHub.vhToken.address,
      functionName: 'redeem',
      args: [39622641509433962264n, fakeAccountAddress, fakeAccountAddress],
    });

    onConfirmed({ input: fakeFullInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens withdrawn', {
      poolName: 'liquidity_hub',
      tokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
      tokenAmountTokens: 1,
      withdrewFullSupply: true,
    });
  });

  it('throws when redeeming without a share balance', () => {
    renderHook(() => useWithdrawFromLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() =>
      fn({
        ...fakePartialInput,
        withdrawFullSupply: true,
      }),
    ).toThrow();
  });
});
