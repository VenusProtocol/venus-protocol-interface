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
import type { Mock } from 'vitest';
import { useSupplyFromWalletToLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const vhMarketVToken = {
  ...assetData[0].vToken,
  underlyingToken: liquidityHub.vhToken,
};
const fakeInput = {
  liquidityHub,
  vhMarketVToken,
  amountMantissa: new BigNumber('1000000000000000000'),
};

const fakeOptions = {
  waitForConfirmation: true,
};

const collateralGatewayAddress = '0xfakeCollateralGatewayContractAddress';
const mockCaptureAnalyticEvent = vi.fn();

describe('useSupplyFromWalletToLiquidityHub', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('supplies to the Hub and its Core market through the collateral gateway', () => {
    renderHook(() => useSupplyFromWalletToLiquidityHub(fakeOptions), {
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
      address: collateralGatewayAddress,
      functionName: 'supplyFromWallet',
      args: [1000000000000000000n, vhMarketVToken.address, 0n],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens supplied', {
      poolName: 'liquidity_hub',
      tokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
      tokenAmountTokens: 1,
      fundingSource: 'wallet',
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_LIQUIDITY_HUBS],
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
          vTokenAddress: vhMarketVToken.address,
        },
      ],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          tokenAddress: liquidityHub.vhToken.underlyingToken.address,
          accountAddress: fakeAccountAddress,
          spenderAddress: collateralGatewayAddress,
        },
      ],
    });
  });

  it('throws when no account is connected', () => {
    renderHook(() => useSupplyFromWalletToLiquidityHub(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
