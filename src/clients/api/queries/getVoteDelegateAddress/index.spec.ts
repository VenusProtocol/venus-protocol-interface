import fakeAddress from '__mocks__/models/address';

import { NULL_ADDRESS } from 'constants/address';
import { XvsVault } from 'packages/contracts';

import getVoteDelegateAddress from '.';

describe('api/queries/getVoteDelegateAddress', () => {
  test('returns undefined when address is null', async () => {
    const xvsVaultContract = {
      delegates: async () => NULL_ADDRESS,
    } as unknown as XvsVault;

    const res = await getVoteDelegateAddress({
      xvsVaultContract,
      accountAddress: fakeAddress,
    });

    expect(res).toStrictEqual({
      delegateAddress: undefined,
    });
  });

  test('returns address when not null address is returned', async () => {
    const xvsVaultContract = {
      delegates: async () => fakeAddress,
    } as unknown as XvsVault;

    const res = await getVoteDelegateAddress({
      xvsVaultContract,
      accountAddress: fakeAddress,
    });
    expect(res).toStrictEqual({
      delegateAddress: fakeAddress,
    });
  });
});
