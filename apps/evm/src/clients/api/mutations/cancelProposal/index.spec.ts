import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { GovernorBravoDelegate } from 'libs/contracts';

import cancelProposal from '.';

describe('cancelProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const cancelProposalMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      cancel: cancelProposalMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = cancelProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeProposalId],
      methodName: 'cancel',
    });
  });
});
