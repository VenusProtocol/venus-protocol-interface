import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
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

describe('useWithdrawFromLiquidityHub', () => {
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

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeFullInput)).toEqual({
      abi: expect.any(Array),
      address: liquidityHub.vhToken.address,
      functionName: 'redeem',
      args: [39622641509433962264n, fakeAccountAddress, fakeAccountAddress],
    });
  });

  it('redeems shares for full withdrawals when the hub allows redeeming the entire balance', () => {
    renderHook(() => useWithdrawFromLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      fn({
        ...fakeFullInput,
        liquidityHub: {
          ...liquidityHub,
          userVhTokenBalanceTokens: new BigNumber('39.62264150943396226415'),
          userVhTokenMaxRedeemTokens: new BigNumber('39.62264150943396226415'),
        },
      }),
    ).toEqual({
      abi: expect.any(Array),
      address: liquidityHub.vhToken.address,
      functionName: 'redeem',
      args: [39622641509433962264n, fakeAccountAddress, fakeAccountAddress],
    });
  });

  it('withdraws the requested amount when maxRedeem is lower than the share balance', () => {
    renderHook(() => useWithdrawFromLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      fn({
        ...fakeFullInput,
        liquidityHub: {
          ...liquidityHub,
          userVhTokenBalanceTokens: new BigNumber('39.62264150943396226415'),
          userVhTokenMaxRedeemTokens: new BigNumber('1'),
        },
      }),
    ).toEqual({
      abi: expect.any(Array),
      address: liquidityHub.vhToken.address,
      functionName: 'withdraw',
      args: [1000000000000000000n, fakeAccountAddress, fakeAccountAddress],
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
