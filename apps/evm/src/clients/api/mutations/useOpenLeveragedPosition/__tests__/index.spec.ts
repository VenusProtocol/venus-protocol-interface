import { exactInSwapQuote as fakeSwapQuote } from '__mocks__/models/swap';
import { vLisUSD, vUsdc } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useOpenLeveragedPosition } from '..';

vi.mock('libs/contracts');

describe('useOpenLeveragedPosition', () => {
  it.each([
    {
      label: 'with swapQuote',
      input: {
        borrowedVToken: vUsdc,
        suppliedVToken: vLisUSD,
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
    renderHook(() => useOpenLeveragedPosition());

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(input)).toMatchSnapshot({
      abi: expect.any(Array),
    });

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when LeverageManager contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useOpenLeveragedPosition());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () =>
      fn({
        vToken: vUsdc,
        amountMantissa: 100000000n,
      }),
    ).rejects.toThrow('somethingWentWrong');
  });
});
