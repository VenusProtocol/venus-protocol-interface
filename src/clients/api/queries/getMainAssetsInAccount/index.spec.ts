import { ContractTypeByName } from 'packages/contracts';

import fakeAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';

import getMainAssetsInAccount from '.';

describe('api/queries/getMainAssetsInAccount', () => {
  test('returns addresses of assets in account on success', async () => {
    const fakeTokenAddresses = [TOKENS.aave.address, TOKENS.ada.address];

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
