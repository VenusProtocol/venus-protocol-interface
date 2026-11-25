import { ChainId } from 'types';
import { restService } from 'utilities';
import type { Mock } from 'vitest';

import { getAddressDomainName } from '..';

vi.mock('utilities/restService');

describe('getAddressDomainName', () => {
  it('requests at most 100 addresses at once', async () => {
    (restService as Mock).mockImplementation(async () => ({ status: 200, data: {} }));

    const addresses = Array.from(
      { length: 150 },
      (_, index) => `0x${(index + 1).toString(16).padStart(40, '0')}` as const,
    );

    await Promise.all(
      addresses.map(accountAddress =>
        getAddressDomainName({ accountAddress, chainId: ChainId.BSC_MAINNET }),
      ),
    );

    const requestedAddressCounts = (restService as Mock).mock.calls.map(
      ([{ params }]) => JSON.parse(params.addresses).length,
    );

    expect(requestedAddressCounts).toEqual([100, 50]);
  });
});
