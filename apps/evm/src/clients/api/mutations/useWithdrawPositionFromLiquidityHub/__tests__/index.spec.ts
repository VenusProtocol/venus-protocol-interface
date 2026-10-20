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
import { useWithdrawPositionFromLiquidityHub } from '..';

const liquidityHub = liquidityHubs[0];
const vhMarketVToken = assetData[0].vToken;
const fakeInput = {
  liquidityHub,
  vhMarketVToken,
  amountMantissa: new BigNumber('2000000000000000000'),
  sharesMantissa: new BigNumber('1000000000000000000000000'),
};

const fakeOptions = {
  waitForConfirmation: true,
};

const collateralGatewayAddress = '0xfakeCollateralGatewayContractAddress';
const mockCaptureAnalyticEvent = vi.fn();

describe('useWithdrawPositionFromLiquidityHub', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('withdraws the position through the collateral gateway', () => {
    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: collateralGatewayAddress,
      functionName: 'withdrawPosition',
      args: [vhMarketVToken.address, 1000000000000000000000000n, 0n],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens withdrawn', {
      poolName: 'liquidity_hub',
      tokenSymbol: liquidityHub.vhToken.underlyingToken.symbol,
      tokenAmountTokens: 2,
      withdrewFullSupply: false,
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_POOLS],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          tokenAddress: liquidityHub.vhToken.address,
          accountAddress: fakeAccountAddress,
          spenderAddress: collateralGatewayAddress,
        },
      ],
    });
  });

  it('withdraws the whole position when requested', () => {
    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn({ ...fakeInput, withdrawFullPosition: true }).args).toEqual([
      vhMarketVToken.address,
      maxUint256,
      0n,
    ]);
  });

  it('throws when no account is connected', () => {
    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
