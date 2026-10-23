import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useRepayToSpoke } from '..';

const spokePool = spokePools[0];
const { vToken } = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;
const fakeInput = {
  vToken,
  poolName: spokePool.name,
  amountMantissa: new BigNumber('10000000'),
  repayFullLoan: false,
};

const fakeOptions = {
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useRepayToSpoke', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('repays the given amount and refreshes the spoke pools and allowance', () => {
    renderHook(() => useRepayToSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: vToken.address,
      functionName: 'repayBorrow',
      args: [10000000n],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens repaid', {
      poolName: spokePool.name,
      tokenSymbol: vToken.underlyingToken.symbol,
      tokenAmountTokens: 10,
      repaidFullLoan: false,
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
          spenderAddress: vToken.address,
        },
      ],
    });
  });

  it('repays the whole loan with the max amount so no interest is left behind', () => {
    renderHook(() => useRepayToSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn({ ...fakeInput, repayFullLoan: true })).toMatchObject({
      functionName: 'repayBorrow',
      args: [BigInt(MAX_UINT256.toFixed())],
    });
  });

  it('throws when no account is connected', () => {
    renderHook(() => useRepayToSpoke(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
