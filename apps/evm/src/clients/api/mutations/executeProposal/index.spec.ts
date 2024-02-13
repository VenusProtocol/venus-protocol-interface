import { GovernorBravoDelegate } from 'libs/contracts';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import executeProposal from '.';

describe('executeProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const executeProposalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      execute: executeProposalMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = await executeProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toBe(fakeContractTransaction);
    expect(executeProposalMock).toHaveBeenCalledTimes(1);
    expect(executeProposalMock).toHaveBeenCalledWith(fakeProposalId);
  });
});
