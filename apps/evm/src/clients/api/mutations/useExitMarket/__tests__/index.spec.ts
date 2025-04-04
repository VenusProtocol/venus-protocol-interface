import fakeAccountAddress from '__mocks__/models/address';
import { vXvs } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api';

import { renderHook } from 'testUtils/render';

import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import type { Mock } from 'vitest';
import { useExitMarket } from '..';

vi.mock('hooks/useSendTransaction');
vi.mock('libs/analytics');

const fakeInput = {
  vToken: vXvs,
  comptrollerContractAddress: '0x123',
  userSupplyBalanceTokens: 1000n,
  poolName: 'Pool 1',
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useExitMarket', () => {
  it('calls useSendTransaction with the correct parameters', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useExitMarket(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: fakeInput.comptrollerContractAddress,
      functionName: 'exitMarket',
      args: [fakeInput.vToken.address],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens decollateralized', {
      poolName: fakeInput.poolName,
      tokenSymbol: fakeInput.vToken.symbol,
      userSupplyBalanceTokens: Number(fakeInput.userSupplyBalanceTokens),
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_POOLS],
    });
  });
});
