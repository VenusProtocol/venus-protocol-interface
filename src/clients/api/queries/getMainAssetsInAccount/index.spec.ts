import { ContractTypeByName } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';
import { bnb, xvs } from '__mocks__/models/tokens';

import getMainAssetsInAccount from '.';

describe('api/queries/getMainAssetsInAccount', () => {
  test('returns addresses of assets in account on success', async () => {
    const fakeTokenAddresses = [bnb.address, xvs.address];

    const getAssetsInMock = vi.fn(async () => fakeTokenAddresses);

    const fakeContract = {
      getAssetsIn: getAssetsInMock,
    } as unknown as ContractTypeByName<'mainPoolComptroller'>;

    const response = await getMainAssetsInAccount({
      mainPoolComptrollerContract: fakeContract,
      accountAddress: fakeAddress,
    });

    expect(getAssetsInMock).toHaveBeenCalledTimes(1);
    expect(getAssetsInMock).toHaveBeenCalledWith(fakeAddress);
    expect(response).toEqual({
      tokenAddresses: fakeTokenAddresses,
    });
  });
});
