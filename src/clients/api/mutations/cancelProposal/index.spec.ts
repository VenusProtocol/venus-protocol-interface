import { ContractTypeByName } from 'packages/contracts';

import fakeContractReceipt from '__mocks__/models/contractReceipt';

import cancelProposal from '.';

describe('api/mutation/cancelProposal', () => {
  test('returns contract receipt when request succeeds', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const cancelProposalMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      cancel: cancelProposalMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const fakeProposalId = 3816;

    const response = await cancelProposal({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(cancelProposalMock).toHaveBeenCalledTimes(1);
    expect(cancelProposalMock).toHaveBeenCalledWith(fakeProposalId);
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
