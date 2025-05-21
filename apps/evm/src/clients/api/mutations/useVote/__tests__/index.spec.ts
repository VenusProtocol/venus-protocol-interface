import fakeAccountAddress from '__mocks__/models/address';
import { queryClient } from 'clients/api';
import indexedVotingSupportNames from 'constants/indexedVotingSupportNames';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useVote } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  proposalId: 123,
  voteType: 1,
  voteReason: 'Test reason',
};

const fakeInputWithoutReason = {
  proposalId: 123,
  voteType: 1,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useVote', () => {
  it('calls useSendTransaction with the correct parameters when vote reason is provided', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useVote(fakeOptions), { accountAddress: fakeAccountAddress });

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
        "address": "0xfakeGovernorBravoDelegateContractAddress",
        "args": [
          123n,
          1,
          "Test reason",
        ],
        "functionName": "castVoteWithReason",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Vote cast', {
      proposalId: fakeInput.proposalId,
      voteType: indexedVotingSupportNames[fakeInput.voteType],
    });

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when vote reason is not provided', async () => {
    renderHook(() => useVote(fakeOptions), { accountAddress: fakeAccountAddress });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInputWithoutReason)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeGovernorBravoDelegateContractAddress",
        "args": [
          123n,
          1,
        ],
        "functionName": "castVote",
      }
    `,
    );
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useVote(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
