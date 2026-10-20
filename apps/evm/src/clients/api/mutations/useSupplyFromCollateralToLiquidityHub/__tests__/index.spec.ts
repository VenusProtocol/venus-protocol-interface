import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import { maxUint256 } from 'viem';
import type { Mock } from 'vitest';
import { useSupplyFromCollateralToLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const vToken = assetData[0].vToken;
const vhMarketVToken = assetData[1].vToken;
const fakeInput = {
  liquidityHub,
  vToken,
  vhMarketVToken,
  vTokenAmountMantissa: new BigNumber('5000000000'),
  underlyingAmountMantissa: new BigNumber('1000000000000000000'),
};

const fakeOptions = {
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useSupplyFromCollateralToLiquidityHub', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('moves the Core supply into the Hub through the collateral gateway', () => {
    renderHook(() => useSupplyFromCollateralToLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: '0xfakeCollateralGatewayContractAddress',
      functionName: 'supplyFromCollateral',
      args: [vToken.address, 5000000000n, vhMarketVToken.address, 0n],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens supplied', {
      poolName: 'liquidity_hub',
      tokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
      tokenAmountTokens: 1,
      fundingSource: 'collateral',
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_POOLS],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_V_TOKEN_BALANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
          vTokenAddress: vToken.address,
        },
      ],
    });
  });

  it('migrates the whole Core supply when requested', () => {
    renderHook(() => useSupplyFromCollateralToLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn({ ...fakeInput, migrateFullSupply: true }).args).toEqual([
      vToken.address,
      maxUint256,
      vhMarketVToken.address,
      0n,
    ]);
  });

  it('throws when no account is connected', () => {
    renderHook(() => useSupplyFromCollateralToLiquidityHub(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
