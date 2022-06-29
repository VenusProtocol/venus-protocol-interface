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

  test('returns object with hasVoted is false and vote undefined when no vote is returned', async () => {
    const fakeOutput = undefined;

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
    expect(res).toStrictEqual(fakeOutput);
  });

  test('returns object with hasVoted is true and vote aginst when [true, "0"]', async () => {
    const fakeOutput = 'AGAINST';

    const governorBravoContract = {
      methods: {
        getReceipt() {
          return {
            call() {
              return [true, '0'];
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
    expect(res).toStrictEqual(fakeOutput);
  });

  test('returns object with hasVoted is true and vote aginst when [true, "1"]', async () => {
    const fakeOutput = 'FOR';

    const governorBravoContract = {
      methods: {
        getReceipt() {
          return {
            call() {
              return [true, '1'];
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
    expect(res).toStrictEqual(fakeOutput);
  });

  test('returns object with hasVoted is true and vote aginst when [true, "2"]', async () => {
    const fakeOutput = 'ABSTAIN';

    const governorBravoContract = {
      methods: {
        getReceipt() {
          return {
            call() {
              return [true, '2'];
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
    expect(res).toStrictEqual(fakeOutput);
  });
});
