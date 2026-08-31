import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { vBnb } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useMigrateCoreSupplyToLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const corePoolAsset = assetData[0];
const fakeLiquidityHubMigratorContractAddress = '0xfakeLiquidityHubMigratorContractAddress';
const fakeInput = {
  vhToken: liquidityHub.vhToken,
  vToken: corePoolAsset.vToken,
  vTokenAmountMantissa: new BigNumber('12240516899'),
};
const fakeNativeInput = {
  ...fakeInput,
  vToken: vBnb,
  vTokenAmountMantissa: new BigNumber(100000000),
  minSharesMantissa: new BigNumber(123),
};

describe('useMigrateCoreSupplyToLiquidityHub', () => {
  it('calls useSendTransaction with the correct parameters', () => {
    renderHook(() => useMigrateCoreSupplyToLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: fakeLiquidityHubMigratorContractAddress,
      functionName: 'migrateFromCore',
      args: [
        corePoolAsset.vToken.address,
        12240516899n,
        liquidityHub.vhToken.address,
        fakeAccountAddress,
        0n,
      ],
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
      queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_POOLS],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
        },
      ],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_V_TOKEN_BALANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
          vTokenAddress: corePoolAsset.vToken.address,
        },
      ],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          tokenAddress: corePoolAsset.vToken.address,
          accountAddress: fakeAccountAddress,
          spenderAddress: fakeLiquidityHubMigratorContractAddress,
        },
      ],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_BALANCE_OF,
        {
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
          tokenAddress: liquidityHub.vhToken.address,
        },
      ],
    });
  });

  it('calls the native token migration method with the correct parameters', () => {
    renderHook(() => useMigrateCoreSupplyToLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeNativeInput)).toEqual({
      abi: expect.any(Array),
      address: fakeLiquidityHubMigratorContractAddress,
      functionName: 'migrateFromCoreBNB',
      args: [100000000n, liquidityHub.vhToken.address, fakeAccountAddress, 123n],
    });
  });

  it('throws when no account is connected', () => {
    renderHook(() => useMigrateCoreSupplyToLiquidityHub());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });

  it('throws when no migrator contract address is available', () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useMigrateCoreSupplyToLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
