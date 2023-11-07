import { GovernorBravoDelegate } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import executeProposal from '.';

describe('api/mutation/executeProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const executeProposalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      execute: executeProposalMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = await executeProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(executeProposalMock).toHaveBeenCalledTimes(1);
    expect(executeProposalMock).toHaveBeenCalledWith(fakeProposalId);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
