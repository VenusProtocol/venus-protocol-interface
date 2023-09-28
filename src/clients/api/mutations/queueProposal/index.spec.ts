import { GovernorBravoDelegate } from 'packages/contractsNew';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import queueProposal from '.';

describe('api/mutation/queueProposal', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const queueProposalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      queue: queueProposalMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = await queueProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(queueProposalMock).toHaveBeenCalledTimes(1);
    expect(queueProposalMock).toHaveBeenCalledWith(fakeProposalId);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
