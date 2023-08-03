import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import executeProposal from '.';

describe('api/mutation/executeProposal', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const executeProposalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      execute: executeProposalMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const fakeProposalId = 3816;

    const response = await executeProposal({
      governorBravoContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(executeProposalMock).toHaveBeenCalledTimes(1);
    expect(executeProposalMock).toHaveBeenCalledWith(fakeProposalId);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
