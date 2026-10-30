import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { usePublicClient } from 'libs/wallet';
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
const mockReadContract = vi.fn();

const mockContractReads = (values: Record<string, bigint>) =>
  mockReadContract.mockImplementation(
    async ({ functionName }: { functionName: string }) => values[functionName],
  );

describe('useWithdrawPositionFromLiquidityHub', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    mockReadContract.mockReset();
    mockContractReads({ previewRedeem: 2000000000000000000n, treasuryPercent: 0n });
    (usePublicClient as Mock).mockReturnValue({
      publicClient: { readContract: mockReadContract },
    });
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('withdraws the position through the collateral gateway', async () => {
    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: collateralGatewayAddress,
      functionName: 'withdrawPosition',
      args: [vhMarketVToken.address, 1000000000000000000000000n, 1990000000000000000n],
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

  it('withdraws the whole position when requested', async () => {
    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect((await fn({ ...fakeInput, withdrawFullPosition: true })).args).toEqual([
      vhMarketVToken.address,
      maxUint256,
      1990000000000000000n,
    ]);
  });

  it('throws when no account is connected', async () => {
    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(fn(fakeInput)).rejects.toThrow();
  });

  it('sets the payout floor from the Hub preview, the Core redeem fee and the slippage tolerance', async () => {
    mockContractReads({
      previewRedeem: 2000000000000000000n,
      treasuryPercent: 100000000000000000n,
    });

    renderHook(() => useWithdrawPositionFromLiquidityHub(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect((await fn(fakeInput)).args[2]).toBe(1791000000000000000n);
    expect(mockReadContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: liquidityHub.vhToken.address,
        functionName: 'previewRedeem',
        args: [1000000000000000000000000n],
      }),
    );
  });
});
