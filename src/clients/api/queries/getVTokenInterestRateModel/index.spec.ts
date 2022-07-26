import { VBep20 } from 'types/contracts';

import getInterestRateModel from '.';

describe('api/queries/getInterestRateModel', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        interestRateModel: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await getInterestRateModel({
        vTokenContract: fakeContract,
      });

      throw new Error('getVTokenCash should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the address of the interest rate model associated to the contract of the V token passed', async () => {
    const fakeContractAddress = '0x0';
    const callMock = jest.fn(async () => fakeContractAddress);
    const interestRateModelMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        interestRateModel: interestRateModelMock,
      },
    } as unknown as VBep20;

    const response = await getInterestRateModel({
      vTokenContract: fakeContract,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(interestRateModelMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      contractAddress: fakeContractAddress,
    });
  });
});
