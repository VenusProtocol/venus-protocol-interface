import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import castVoteWithReason from './castVoteWithReason';

describe('api/mutation/castVoteWithReason', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const castVoteWithReasonMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      castVoteWithReason: castVoteWithReasonMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await castVoteWithReason({
      governorBravoContract: fakeContract,
      proposalId: 1,
      voteType: 1,
      voteReason: 'yes!',
    });

    expect(response).toBe(fakeContractReceipt);
    expect(castVoteWithReasonMock).toHaveBeenCalledTimes(1);
    expect(castVoteWithReasonMock).toHaveBeenCalledWith(1, 1, 'yes!');
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
