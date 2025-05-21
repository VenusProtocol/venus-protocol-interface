import fakeAccountAddress from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSetVoteDelegate } from '..';

vi.mock('libs/contracts');

const fakeInput = {
  delegateAddress: '0x123' as const,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useSetVoteDelegate', () => {
  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useSetVoteDelegate(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeXvsVaultContractAddress",
        "args": [
          "0x123",
        ],
        "functionName": "delegate",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useSetVoteDelegate(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
