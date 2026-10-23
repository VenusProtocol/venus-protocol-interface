import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useBorrowFromSpoke } from '..';

const spokePool = spokePools[0];
const { vToken } = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;
const fakeInput = {
  vToken,
  poolName: spokePool.name,
  amountMantissa: new BigNumber('10000000'),
};

const fakeOptions = {
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useBorrowFromSpoke', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();
    (useAnalytics as Mock).mockReturnValue({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    });
  });

  it('borrows from the spoke market and refreshes the spoke pools', () => {
    renderHook(() => useBorrowFromSpoke(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: vToken.address,
      functionName: 'borrow',
      args: [10000000n],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens borrowed', {
      poolName: spokePool.name,
      tokenSymbol: vToken.underlyingToken.symbol,
      tokenAmountTokens: 10,
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_SPOKE_POOLS],
    });
  });

  it('throws when no account is connected', () => {
    renderHook(() => useBorrowFromSpoke(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow();
  });
});
