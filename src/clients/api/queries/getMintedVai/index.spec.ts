import BigNumber from 'bignumber.js';
import { MainPoolComptroller } from 'packages/contracts';

import address from '__mocks__/models/address';

import getMintedVai from '.';

describe('api/queries/getMintedVai', () => {
  test('returns the XVS amount accrued in the correct format', async () => {
    const fakeMintedVai = '1000000000000000000000000000';
    const mintedVAIsMock = vi.fn(async () => fakeMintedVai);

    const fakeContract = {
      mintedVAIs: mintedVAIsMock,
    } as unknown as MainPoolComptroller;

    const response = await getMintedVai({
      mainPoolComptrollerContract: fakeContract,
      accountAddress: address,
    });

    expect(mintedVAIsMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      mintedVaiMantissa: new BigNumber(fakeMintedVai),
    });
  });
});
