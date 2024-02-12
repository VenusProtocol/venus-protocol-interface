import BigNumber from 'bignumber.js';

import address from '__mocks__/models/address';

import { LegacyPoolComptroller } from 'packages/contracts';

import getMintedVai from '.';

describe('api/queries/getMintedVai', () => {
  test('returns the XVS amount accrued in the correct format', async () => {
    const fakeMintedVai = '1000000000000000000000000000';
    const mintedVAIsMock = vi.fn(async () => fakeMintedVai);

    const fakeContract = {
      mintedVAIs: mintedVAIsMock,
    } as unknown as LegacyPoolComptroller;

    const response = await getMintedVai({
      legacyPoolComptrollerContract: fakeContract,
      accountAddress: address,
    });

    expect(mintedVAIsMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      mintedVaiMantissa: new BigNumber(fakeMintedVai),
    });
  });
});
