import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useGetGovernorBravoDelegateContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useCancelProposal } from '..';

vi.mock('hooks/useSendTransaction');
vi.mock('libs/contracts');

const governorBravoDelegateAddress = '0x123';

const fakeInput = {
  proposalId: 123,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useCancelProposal', () => {
  beforeEach(() => {
    (useGetGovernorBravoDelegateContractAddress as Mock).mockImplementation(
      () => governorBravoDelegateAddress,
    );
  });

  it('calls useSendTransaction with the correct parameters', async () => {
    renderHook(() => useCancelProposal(fakeOptions));

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: governorBravoDelegateAddress,
      functionName: 'cancel',
      args: [BigInt(fakeInput.proposalId)],
    });

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
    (useGetGovernorBravoDelegateContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useCancelProposal(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
