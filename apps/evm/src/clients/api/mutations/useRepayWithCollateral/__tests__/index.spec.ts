import fakeAccountAddress from '__mocks__/models/address';
import { exactInSwapQuote as fakeSwapQuote } from '__mocks__/models/swap';
import { vLisUSD, vUsdc } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useRepayWithCollateral } from '..';

vi.mock('libs/contracts');

describe('useRepayWithCollateral', () => {
  it('should throw error if LeverageManager contract address is not available', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useRepayWithCollateral());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn()).rejects.toThrow('somethingWentWrong');
  });

  it.each([
    {
      label: 'with swapQuote',
      input: {
        collateralVToken: vUsdc,
        repaidVToken: vLisUSD,
        swapQuote: fakeSwapQuote,
      },
    },
    {
      label: 'with single asset',
      input: {
        vToken: vUsdc,
        amountMantissa: 100000000n,
      },
    },
  ])('calls useSendTransaction with correct parameters $label', async ({ input }) => {
    renderHook(() => useRepayWithCollateral(), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(input)).toMatchSnapshot({
      abi: expect.any(Object),
    });

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });
});
