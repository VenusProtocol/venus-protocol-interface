import address from '__mocks__/models/address';
import { VaiUnitroller } from 'types/contracts';
import getVenusVaiMinterIndex from './getVenusVaiMinterIndex';

describe('api/queries/getVenusVaiMinterIndex', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        venusVAIMinterIndex: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiUnitroller;

    try {
      await getVenusVaiMinterIndex({
        vaiUnitrollerContract: fakeContract,
        accountAddress: address,
      });

      throw new Error('getVenusVaiMinterIndex should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI treasury percentage in the correct format', async () => {
    const fakeInitialIndex = '1000000';
    const callMock = jest.fn(async () => fakeInitialIndex);
    const venusVAIMinterIndexMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        venusVAIMinterIndex: venusVAIMinterIndexMock,
      },
    } as unknown as VaiUnitroller;

    const response = await getVenusVaiMinterIndex({
      vaiUnitrollerContract: fakeContract,
      accountAddress: address,
    });

    expect(venusVAIMinterIndexMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toBe(fakeInitialIndex);
  });
});
