import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { GovernorBravoDelegate } from 'packages/contracts';

import cancelProposal from '.';

describe('cancelProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const cancelProposalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      cancel: cancelProposalMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = await cancelProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(cancelProposalMock).toHaveBeenCalledTimes(1);
    expect(cancelProposalMock).toHaveBeenCalledWith(fakeProposalId);
  });
});
