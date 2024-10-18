import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { GovernorBravoDelegate } from 'libs/contracts';

import queueProposal from '.';

describe('queueProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const queueProposalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      queue: queueProposalMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = queueProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeProposalId],
      methodName: 'queue',
    });
  });
});
