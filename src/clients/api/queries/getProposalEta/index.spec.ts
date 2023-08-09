import { ContractTypeByName } from 'packages/contracts';

import governorBravoDelegateResponses from '__mocks__/contracts/governanceBravoDelegate';

import getProposalEta from '.';

const fakeProposalId = 123;

describe('api/queries/getProposalEta', () => {
  test('returns ETA in correct format on success', async () => {
    const proposalsMock = vi.fn(async () => governorBravoDelegateResponses.proposals);

    const fakeContract = {
      proposals: proposalsMock,
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await getProposalEta({
      governorBravoDelegateContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(proposalsMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
