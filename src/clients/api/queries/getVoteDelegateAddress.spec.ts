import fakeAddress from '__mocks__/models/address';
import { NULL_ADDRESS } from 'constants/address';
import { XvsVault } from 'types/contracts';
import getVoteDelegateAddress from './getVoteDelegateAddress';

describe('api/queries/getVoteDelegateAddress', () => {
  test('throws an error when an XvsVault contract call fails', async () => {
    const xvsVaultContract = {
      methods: {
        delegates() {
          return {
            call() {
              throw new Error('Fake error message');
            },
          };
        },
      },
    };

    try {
      await getVoteDelegateAddress({
        xvsVaultContract: xvsVaultContract as unknown as XvsVault,
        accountAddress: fakeAddress,
      });

      throw new Error('getVoteDelegateAddress should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when address is null', async () => {
    const xvsVaultContract = {
      methods: {
        delegates() {
          return {
            call() {
              return NULL_ADDRESS;
            },
          };
        },
      },
    };

    const res = await getVoteDelegateAddress({
      xvsVaultContract: xvsVaultContract as unknown as XvsVault,
      accountAddress: fakeAddress,
    });
    expect(res).toStrictEqual(undefined);
  });

  test('returns address when not null address is returned', async () => {
    const xvsVaultContract = {
      methods: {
        delegates() {
          return {
            call() {
              return fakeAddress;
            },
          };
        },
      },
    };

    const res = await getVoteDelegateAddress({
      xvsVaultContract: xvsVaultContract as unknown as XvsVault,
      accountAddress: fakeAddress,
    });
    expect(res).toStrictEqual(fakeAddress);
  });
});
