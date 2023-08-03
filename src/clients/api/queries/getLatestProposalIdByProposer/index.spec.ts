import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';

import getLatestProposalIdByProposer from '.';

describe('api/queries/getLatestProposalIdByProposer', () => {
  test('with account return latest proposalId', async () => {
    const fakeContract = {
      latestProposalIds: async () => BN.from('1'),
    } as unknown as ContractTypeByName<'governorBravoDelegate'>;

    const response = await getLatestProposalIdByProposer({
      governorBravoContract: fakeContract,
      accountAddress: fakeAddress,
    });
    expect(response).toStrictEqual({
      proposalId: '1',
    });
  });
});
