import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { GovernorBravoDelegate } from 'libs/contracts';

import executeProposal from '.';

describe('executeProposal', () => {
  test('returns contract transaction when request succeeds', async () => {
    const executeMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      execute: executeMock,
    } as unknown as GovernorBravoDelegate;

    const fakeProposalId = 3816;

    const response = executeProposal({
      contract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toStrictEqual({
      contract: fakeContract,
      args: [fakeProposalId],
      methodName: 'execute',
    });
  });
});
