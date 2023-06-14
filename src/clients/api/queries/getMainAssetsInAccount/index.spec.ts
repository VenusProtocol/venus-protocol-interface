import fakeAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';
import { Comptroller } from 'types/contracts';

import getMainAssetsInAccount from '.';

describe('api/queries/getMainAssetsInAccount', () => {
  test('returns addresses of assets in account on success', async () => {
    const fakeTokenAddresses = [TOKENS.aave.address, TOKENS.ada.address];

    const getAssetsInMock = vi.fn(async () => fakeTokenAddresses);

    const fakeContract = {
      getAssetsIn: getAssetsInMock,
    } as unknown as Comptroller;

    const response = await getMainAssetsInAccount({
      comptrollerContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getAssetsInMock).toHaveBeenCalledTimes(1);
    expect(getAssetsInMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      tokenAddresses: fakeTokenAddresses,
    });
  });
});
