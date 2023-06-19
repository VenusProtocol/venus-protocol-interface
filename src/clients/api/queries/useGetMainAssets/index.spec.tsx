import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { assetsInAccount } from '__mocks__/models/assetsInAccount';
import { markets } from '__mocks__/models/markets';
import { vTokenBalanceTreasury } from '__mocks__/models/vTokenBalanceTreasury';
import { vTokenBalancesAccount } from '__mocks__/models/vTokenBalancesAccount';
import {
  getMainAssetsInAccount,
  getMainMarkets,
  getVaiRepayAmountWithInterests,
  useGetVTokenBalancesAll,
} from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import useGetMainAssets, { UseGetMainAssetsOutput } from '.';

vi.mock('clients/api');

const fakeUserVaiRepayAmountWithInterestsWei = new BigNumber('10000000000000000');

describe('api/queries/useGetMainAssets', () => {
  beforeEach(() => {
    (getMainMarkets as Vi.Mock).mockImplementation(() => ({ markets }));
    (getMainAssetsInAccount as Vi.Mock).mockImplementation(() => ({
      tokenAddresses: assetsInAccount,
    }));
    (getVaiRepayAmountWithInterests as Vi.Mock).mockImplementation(() => ({
      vaiRepayAmountWithInterests: fakeUserVaiRepayAmountWithInterestsWei,
    }));

    (useGetVTokenBalancesAll as Vi.Mock).mockImplementation(({ account }) => {
      if (account === fakeAddress) {
        return { data: { balances: vTokenBalancesAccount } };
      }
      return { data: { balances: vTokenBalanceTreasury } };
    });
  });

  it('calculates totals correctly', async () => {
    let data: UseGetMainAssetsOutput['data'] = {
      assets: [],
      userTotalBorrowBalanceCents: new BigNumber(0),
      userTotalBorrowLimitCents: new BigNumber(0),
      userTotalSupplyBalanceCents: new BigNumber(0),
    };

    const CallMarketContext = () => {
      ({ data } = useGetMainAssets({ accountAddress: fakeAddress }));
      return <div />;
    };

    renderComponent(<CallMarketContext />, {
      authContextValue: { accountAddress: fakeAddress },
    });

    await waitFor(() => expect(!!data?.assets).toBe(true));
    expect(data).toMatchSnapshot();
  });
});
