import { VaiUnitroller } from 'types/contracts';
import getVenusVaiState, { IGetVenusVaiStateOutput } from './getVenusVaiState';

describe('api/queries/getVenusVaiState', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        venusVAIState: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VaiUnitroller;

    try {
      await getVenusVaiState({
        vaiUnitrollerContract: fakeContract,
      });

      throw new Error('getVenusVaiState should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI state on success', async () => {
    const fakeOutput: IGetVenusVaiStateOutput = {
      index: '0',
      block: '0',
    };

    const callMock = jest.fn(async () => fakeOutput);
    const venusVAIStateMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        venusVAIState: venusVAIStateMock,
      },
    } as unknown as VaiUnitroller;

    const response = await getVenusVaiState({
      vaiUnitrollerContract: fakeContract,
    });

    expect(venusVAIStateMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response).toBe(fakeOutput);
  });
});
