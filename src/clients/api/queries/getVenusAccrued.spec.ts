import BigNumber from 'bignumber.js';

import address from '__mocks__/models/address';
import { Comptroller } from 'types/contracts';
import getVenusAccrued from './getVenusAccrued';

describe('api/queries/getVenusAccrued', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        venusAccrued: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await getVenusAccrued({
        comptrollerContract: fakeContract,
        accountAddress: address,
      });

      throw new Error('getVenusAccrued should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the XVS amount accrued in the correct format', async () => {
    const fakeXvsAccrued = '1000000000000000000000000000';
    const callMock = jest.fn(async () => fakeXvsAccrued);
    const venusAccruedMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        venusAccrued: venusAccruedMock,
      },
    } as unknown as Comptroller;

    const response = await getVenusAccrued({
      comptrollerContract: fakeContract,
      accountAddress: address,
    });

    expect(venusAccruedMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response instanceof BigNumber).toBe(true);
    expect(response.toFixed()).toBe(fakeXvsAccrued);
  });
});
