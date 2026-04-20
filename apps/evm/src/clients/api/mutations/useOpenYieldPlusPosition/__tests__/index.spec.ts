import { exactInSwapQuote as fakeSwapQuote } from '__mocks__/models/swap';
import { vLisUSD, vUsdc } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api/queryClient';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useOpenYieldPlusPosition } from '..';

vi.mock('libs/contracts');

describe('useOpenYieldPlusPosition', () => {
  const fakeInput = {
    longVTokenAddress: vLisUSD.address,
    shortVTokenAddress: vUsdc.address,
    dsaIndex: 1,
    initialPrincipalMantissa: 100000000n,
    leverageFactor: 2,
    swapQuote: fakeSwapQuote,
  } as const;

  it('calls useSendTransaction with correct parameters', async () => {
    renderHook(() => useOpenYieldPlusPosition());

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchSnapshot({
      abi: expect.any(Array),
    });

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws error when RelativePositionManager contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useOpenYieldPlusPosition());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
