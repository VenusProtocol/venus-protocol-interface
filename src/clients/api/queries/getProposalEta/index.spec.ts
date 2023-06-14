import governorBravoDelegateResponses from '__mocks__/contracts/governanceBravoDelegate';
import { GovernorBravoDelegate } from 'types/contracts';

import getProposalEta from '.';

const fakeProposalId = 123;

describe('api/queries/getProposalEta', () => {
  test('returns ETA in correct format on success', async () => {
    const proposalsMock = vi.fn(async () => governorBravoDelegateResponses.proposals);

    const fakeContract = {
      proposals: proposalsMock,
    } as unknown as GovernorBravoDelegate;

    const response = await getProposalEta({
      governorBravoContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(proposalsMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
