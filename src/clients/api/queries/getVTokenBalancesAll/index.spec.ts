import fakeAddress from '__mocks__/models/address';
import { VenusLens } from 'types/contracts';

import getVTokenBalancesAll from '.';

describe('api/queries/getVTokenBalancesAll', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        vTokenBalancesAll: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VenusLens;

    try {
      await getVTokenBalancesAll({
        venusLensContract: fakeContract,
        vTokenAddresses: [''],
        account: fakeAddress,
      });

      throw new Error('getVTokenBalancesAll should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the APY simulations in the correct format on success', async () => {
    const vTokenBalancesAllCallMock = jest.fn(async () => [
      {
        balanceOf: '10000',
        balanceOfUnderlying: '20000',
        borrowBalanceCurrent: '300',
        tokenAllowance: '40000000000000000',
        tokenBalance: '5000',
        vToken: fakeAddress,
      },
    ]);

    const fakeContract = {
      methods: {
        vTokenBalancesAll: () => ({
          call: vTokenBalancesAllCallMock,
        }),
      },
    } as unknown as VenusLens;

    const response = await getVTokenBalancesAll({
      venusLensContract: fakeContract,
      vTokenAddresses: [''],
      account: fakeAddress,
    });

    expect(vTokenBalancesAllCallMock).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
