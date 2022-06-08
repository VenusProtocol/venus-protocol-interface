import BigNumber from 'bignumber.js';
import { XvsVault } from 'types/contracts';
import getCurrentVotes, { GetCurrentVotesOutput } from './getCurrentVotes';

const fakeAccountAddress = '0x000000000000000000000000000000000AcCoUnt';

describe('api/queries/getCurrentVotes', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getCurrentVotes: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getCurrentVotes({
        xvsVaultContract: fakeContract,
        accountAddress: fakeAccountAddress,
      });

      throw new Error('getVrtBalanceOf should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns current votes on success', async () => {
    const fakeOutput: GetCurrentVotesOutput = new BigNumber('0');

    const callMock = jest.fn(async () => fakeOutput);
    const getCurrentVotesMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getCurrentVotes: getCurrentVotesMock,
      },
    } as unknown as XvsVault;

    const response = await getCurrentVotes({
      xvsVaultContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(getCurrentVotesMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getCurrentVotesMock).toHaveBeenCalledWith(fakeAccountAddress);
    expect(response).toStrictEqual(fakeOutput);
  });
});
