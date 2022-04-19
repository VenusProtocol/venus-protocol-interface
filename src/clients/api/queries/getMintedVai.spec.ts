import BigNumber from 'bignumber.js';

import { Comptroller } from 'types/contracts';
import getMintedVai from './getMintedVai';

const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';

describe('api/queries/getMintedVai', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        mintedVAIs: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await getMintedVai({
        comptrollerContract: fakeContract,
        accountAddress: fakeFromAccountsAddress,
      });

      throw new Error('getMintedVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the XVS amount accrued in the correct format', async () => {
    const fakeMintedVai = '1000000000000000000000000000';
    const callMock = jest.fn(async () => fakeMintedVai);
    const mintedVAIsMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        mintedVAIs: mintedVAIsMock,
      },
    } as unknown as Comptroller;

    const response = await getMintedVai({
      comptrollerContract: fakeContract,
      accountAddress: fakeFromAccountsAddress,
    });

    expect(mintedVAIsMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(response instanceof BigNumber).toBe(true);
    expect(response.toFixed()).toBe(fakeMintedVai);
  });
});
