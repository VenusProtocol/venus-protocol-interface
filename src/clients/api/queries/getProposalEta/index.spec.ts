import governorBravoDelegateResponses from '__mocks__/contracts/governanceBravoDelegate';
import { GovernorBravoDelegate } from 'types/contracts';

import getProposalEta from '.';

const fakeProposalId = 123;

describe('api/queries/getProposalEta', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        proposals: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await getProposalEta({
        governorBravoContract: fakeContract,
        proposalId: fakeProposalId,
      });

      throw new Error('proposals should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns ETA in correct format on success', async () => {
    const callMock = jest.fn(async () => governorBravoDelegateResponses.proposals);
    const proposalsMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        proposals: proposalsMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await getProposalEta({
      governorBravoContract: fakeContract,
      proposalId: fakeProposalId,
    });

    expect(proposalsMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
