import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSupplyToSpoke } from '..';

const spokePool = spokePools[0];
const { vToken } = spokePool.assets.find(({ isBorrowable }) => !isBorrowable)!;
const fakeInput = {
  vToken,
  poolName: spokePool.name,
  amountMantissa: new BigNumber('10000000'),
};

const fakeOptions = {
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useSupplyToSpoke', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('supplies and enters the market through the collateral gateway in one call', () => {
    renderHook(() => useSupplyToSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: '0xfakeCollateralGatewayContractAddress',
      functionName: 'supplyAndEnterSpokeMarkets',
      args: [[vToken.address], [10000000n]],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens supplied', {
      poolName: spokePool.name,
      tokenSymbol: vToken.underlyingToken.symbol,
      tokenAmountTokens: 10,
      fundingSource: 'wallet',
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_SPOKE_POOLS],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_ALLOWANCE,
        {
          chainId: ChainId.BSC_TESTNET,
          tokenAddress: vToken.underlyingToken.address,
          accountAddress: fakeAccountAddress,
          spenderAddress: '0xfakeCollateralGatewayContractAddress',
        },
      ],
    });
  });

  it('throws when no account is connected', () => {
    renderHook(() => useSupplyToSpoke(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
