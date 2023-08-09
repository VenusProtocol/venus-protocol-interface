import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import castVote from './castVote';

describe('api/mutation/castVote', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const castVoteMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      castVote: castVoteMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await castVote({
      governorBravoDelegateContract: fakeContract,
      proposalId: 1,
      voteType: 1,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(castVoteMock).toHaveBeenCalledTimes(1);
    expect(castVoteMock).toHaveBeenCalledWith(1, 1);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
