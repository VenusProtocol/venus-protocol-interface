import fakeAccountAddress, { altAddress as fakeMigratorAddress } from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useMigrateCoreSupplyToLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const corePoolAsset = assetData[0];
const fakeInput = {
  vhToken: liquidityHub.vhToken,
  hubAddress: liquidityHub.vhToken.address,
  vToken: corePoolAsset.vToken,
  exchangeRateVTokens: corePoolAsset.exchangeRateVTokens,
  amountMantissa: new BigNumber('1000000000000000000'),
  liquidityHubMigratorContractAddress: fakeMigratorAddress,
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
      address: fakeMigratorAddress,
      functionName: 'migrateFromCore',
      args: [
        corePoolAsset.vToken.address,
        4958918123n,
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
  });

  it('throws when no account is connected', () => {
    renderHook(() => useMigrateCoreSupplyToLiquidityHub());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });

  it('throws when no migrator address is available', () => {
    renderHook(() => useMigrateCoreSupplyToLiquidityHub(), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() =>
      fn({
        ...fakeInput,
        liquidityHubMigratorContractAddress: undefined,
      }),
    ).toThrow();
  });
});
