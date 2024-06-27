import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { renderComponent } from 'testUtils/render';

import useGetLegacyPoolTotalXvsDistributed, {
  type UseGetLegacyPoolTotalXvsDistributedOutput,
} from '.';

describe('api/queries/useGetLegacyPoolTotalXvsDistributed', () => {
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
