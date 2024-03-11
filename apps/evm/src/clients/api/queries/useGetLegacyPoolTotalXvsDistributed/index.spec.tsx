import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type Vi from 'vitest';

import { markets } from '__mocks__/models/markets';
import { renderComponent } from 'testUtils/render';

import { getLegacyPoolMarkets } from 'clients/api';

import useGetLegacyPoolTotalXvsDistributed, {
  type UseGetLegacyPoolTotalXvsDistributedOutput,
} from '.';

describe('api/queries/useGetLegacyPoolTotalXvsDistributed', () => {
  beforeEach(() => {
    (getLegacyPoolMarkets as Vi.Mock).mockImplementation(() => ({ markets }));
  });

  it('returns data in the correct format', async () => {
    let data: UseGetLegacyPoolTotalXvsDistributedOutput['data'] = {
      totalXvsDistributedMantissa: new BigNumber(0),
    };

    const CallMarketContext = () => {
      ({ data } = useGetLegacyPoolTotalXvsDistributed());
      return <div />;
    };

    renderComponent(<CallMarketContext />);

    await waitFor(() => expect(data && data.totalXvsDistributedMantissa.toNumber() > 0).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
