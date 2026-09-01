import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSupplyToLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const fakeInput = {
  liquidityHub,
  amountMantissa: new BigNumber('1000000000000000000'),
};

const fakeOptions = {
  waitForConfirmation: true,
};

describe('useSupplyToLiquidityHub', () => {
  it('calls useSendTransaction with the correct parameters', () => {
    renderHook(() => useSupplyToLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: liquidityHub.vhToken.address,
      functionName: 'deposit',
      args: [1000000000000000000n, fakeAccountAddress],
    });

    onConfirmed({ input: fakeInput });

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
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          tokenAddress: liquidityHub.vhToken.underlyingToken.address,
          accountAddress: fakeAccountAddress,
          spenderAddress: liquidityHub.vhToken.address,
        },
      ],
    });
  });

  it('throws when no account is connected', () => {
    renderHook(() => useSupplyToLiquidityHub(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
