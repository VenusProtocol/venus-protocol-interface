import BigNumber from 'bignumber.js';

import { GovernorBravoDelegate } from 'types/contracts';

import getProposalThreshold from '.';

describe('api/queries/getProposalThreshold', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        proposalThreshold: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as GovernorBravoDelegate;

    try {
      await getProposalThreshold({
        governorBravoContract: fakeContract,
      });

      throw new Error('proposalThreshold should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns proposal threshold on success', async () => {
    const fakeOutput = '1000';

    const callMock = jest.fn(async () => fakeOutput);
    const proposalThresholdMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        proposalThreshold: proposalThresholdMock,
      },
    } as unknown as GovernorBravoDelegate;

    const response = await getProposalThreshold({
      governorBravoContract: fakeContract,
    });

    expect(proposalThresholdMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      thresholdWei: new BigNumber(fakeOutput),
    });
  });
});
