import { BigNumber as BN } from 'ethers';

import fakeAddress from '__mocks__/models/address';

import { GovernorBravoDelegate } from 'packages/contracts';

import getLatestProposalIdByProposer from '.';

describe('api/queries/getLatestProposalIdByProposer', () => {
  test('with account return latest proposalId', async () => {
    const fakeContract = {
      latestProposalIds: async () => BN.from('1'),
    } as unknown as GovernorBravoDelegate;

    const response = await getLatestProposalIdByProposer({
      governorBravoDelegateContract: fakeContract,
      accountAddress: fakeAddress,
    });
    expect(response).toStrictEqual({
      proposalId: '1',
    });
  });
});
