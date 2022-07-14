import fakeAddress from '__mocks__/models/address';
import { GovernorBravoDelegate } from 'types/contracts';

import getVoteReceipt from '.';

describe('api/queries/getVoteReceipt', () => {
  test('throws an error when one of GovernorBravoDelegate contract call fails', async () => {
    const governorBravoContract = {
      methods: {
        getReceipt() {
          return {
            call() {
              throw new Error('Fake error message');
            },
          };
        },
      },
    };

    try {
      await getVoteReceipt({
        governorBravoContract: governorBravoContract as unknown as GovernorBravoDelegate,
        proposalId: 1234,
        accountAddress: fakeAddress,
      });

      throw new Error('getVoteReceipt should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns NOT_VOTED when no vote is returned', async () => {
    const governorBravoContract = {
      methods: {
        getReceipt() {
          return {
            call() {
              return [false, undefined];
            },
          };
        },
      },
    };

    const res = await getVoteReceipt({
      governorBravoContract: governorBravoContract as unknown as GovernorBravoDelegate,
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
        methods: {
          getReceipt() {
            return {
              call() {
                return [true, fakeSupport];
              },
            };
          },
        },
      };

      const res = await getVoteReceipt({
        governorBravoContract: governorBravoContract as unknown as GovernorBravoDelegate,
        proposalId: 1234,
        accountAddress: fakeAddress,
      });
      expect(res).toMatchSnapshot();
    },
  );
});
