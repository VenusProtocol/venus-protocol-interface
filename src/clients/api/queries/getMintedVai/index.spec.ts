import BigNumber from 'bignumber.js';

import address from '__mocks__/models/address';
import { Comptroller } from 'types/contracts';

import getMintedVai from '.';

describe('api/queries/getMintedVai', () => {
  test('returns the XVS amount accrued in the correct format', async () => {
    const fakeMintedVai = '1000000000000000000000000000';
    const mintedVAIsMock = jest.fn(async () => fakeMintedVai);

    const fakeContract = {
      mintedVAIs: mintedVAIsMock,
    } as unknown as Comptroller;

    const response = await getMintedVai({
      comptrollerContract: fakeContract,
      accountAddress: address,
    });

    expect(mintedVAIsMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      mintedVaiWei: new BigNumber(fakeMintedVai),
    });
  });
});
