import { Comptroller } from 'types/contracts';
import getVenusInitialIndex from './getVenusInitialIndex';

describe('api/queries/getVenusInitialIndex', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        venusInitialIndex: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await getVenusInitialIndex({ comptrollerContract: fakeContract });

      throw new Error('getVenusInitialIndex should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the initial Venus market index on success', async () => {
    const fakeInitialIndex = '1000000000000000';
    const callMock = jest.fn(async () => fakeInitialIndex);
    const venusInitialIndexMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        venusInitialIndex: venusInitialIndexMock,
      },
    } as unknown as Comptroller;

    const response = await getVenusInitialIndex({ comptrollerContract: fakeContract });

    expect(venusInitialIndexMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toBe(fakeInitialIndex);
  });
});
