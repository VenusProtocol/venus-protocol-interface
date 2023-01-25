import fakeAddress from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import getVoteReceipt from '.';

describe('api/queries/getVoteReceipt', () => {
  test('returns NOT_VOTED when no vote is returned', async () => {
    const governorBravoContract = {
      getReceipt: async () => [false, undefined],
    } as unknown as GovernorBravoDelegate;

    const res = await getVoteReceipt({
      governorBravoContract,
      proposalId: 1234,
      accountAddress: fakeAddress,
    });
    expect(res).toStrictEqual({
      voteSupport: 'NOT_VOTED',
    });
  });

  test.each([0, 1, 2])(
    'returns the correct string depending on what the contract call returns',
    async fakeSupport => {
      const governorBravoContract = {
        getReceipt: async () => [true, fakeSupport],
      } as unknown as GovernorBravoDelegate;

      const res = await getVoteReceipt({
        governorBravoContract,
        proposalId: 1234,
        accountAddress: fakeAddress,
      });
      expect(res).toMatchSnapshot();
    },
  );
});
