import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';

import getVaiTreasuryPercentage from '.';

describe('api/queries/getVaiTreasuryPercentage', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        treasuryPercent: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiController;

    try {
      await getVaiTreasuryPercentage({ vaiControllerContract: fakeContract });

      throw new Error('getVaiTreasuryPercentage should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI treasury percentage in the correct format', async () => {
    const callMock = jest.fn(async () => new BigNumber('1000000000000000'));
    const treasuryPercentMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        treasuryPercent: treasuryPercentMock,
      },
    } as unknown as VaiController;

    const response = await getVaiTreasuryPercentage({ vaiControllerContract: fakeContract });

    expect(treasuryPercentMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      percentage: 0.1,
    });
  });
});
