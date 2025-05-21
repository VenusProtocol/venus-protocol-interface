import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useQueueProposal } from '..';

vi.mock('libs/contracts');

const fakeInput = {
  proposalId: 123,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useQueueProposal', () => {
  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useQueueProposal(fakeOptions));

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      }, `
      {
        "abi": Any<Array>,
        "address": "0xfakeGovernorBravoDelegateContractAddress",
        "args": [
          123n,
        ],
        "functionName": "queue",
      }
    `);

    onConfirmed({ input: fakeInput });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useQueueProposal(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
