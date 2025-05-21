import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useCancelProposal } from '..';

vi.mock('libs/contracts');

const fakeInput = {
  proposalId: 123,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useCancelProposal', () => {
  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useCancelProposal(fakeOptions));

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toMatchInlineSnapshot({
      abi: expect.any(Array),
    }, `
      {
        "abi": Any<Array>,
        "address": "0xfakeGovernorBravoDelegateContractAddress",
        "args": [
          123n,
        ],
        "functionName": "cancel",
      }
    `);

    onConfirmed({ input: fakeInput });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_PROPOSALS],
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_PROPOSAL,
        {
          id: fakeInput.proposalId,
        },
      ],
    });
  });

  it('throws error when Governor Bravo Delegate contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useCancelProposal(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
