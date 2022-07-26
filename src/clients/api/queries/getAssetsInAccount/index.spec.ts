import fakeAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

import getAssetsInAccount from '.';

describe('api/queries/getAssetsInAccount', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getAssetsIn: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await getAssetsInAccount({ comptrollerContract: fakeContract, accountAddress: fakeAddress });
      throw new Error('getAssetsInAccount should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns addresses of assets in account on success', async () => {
    const fakeTokenAddresses = [TOKENS.aave.address, TOKENS.ada.address];

    const callMock = jest.fn(async () => fakeTokenAddresses);
    const getAssetsInMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getAssetsIn: getAssetsInMock,
      },
    } as unknown as Comptroller;

    const response = await getAssetsInAccount({
      comptrollerContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getAssetsInMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getAssetsInMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      tokenAddresses: fakeTokenAddresses,
    });
  });
});
