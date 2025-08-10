import { waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { vaults } from '__mocks__/models/vaults';
import { useGetPools, useGetVaults } from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import Account from '.';

describe('Account', () => {
  it('renders without crashing', () => {
    renderComponent(<Account />);
  });

  it('displays AccountPlaceholder when there are no positions', async () => {
    (useGetVaults as Mock).mockImplementation(() => ({
      isLoading: false,
      data: vaults.map(({ userStakedMantissa: _, ...vault }) => vault),
    }));

    (useGetPools as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pools: poolData.map(pool => ({
          ...pool,
          userBorrowLimitCents: new BigNumber(0),
          userBorrowBalanceCents: new BigNumber(0),
          userSupplyBalanceCents: new BigNumber(0),
          assets: pool.assets.map(asset => ({
            ...asset,
            userBorrowBalanceCents: new BigNumber(0),
            userBorrowBalanceTokens: new BigNumber(0),
            userSupplyBalanceCents: new BigNumber(0),
            userSupplyBalanceTokens: new BigNumber(0),
            userWalletBalanceCents: new BigNumber(0),
            userWalletBalanceTokens: new BigNumber(0),
            isCollateralOfUser: false,
          })),
        })),
      },
    }));

    const { getByText } = renderComponent(<Account />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByText(en.accountPlaceholder.assetsWillAppearHere)).toBeInTheDocument(),
    );
  });

  it('displays page when there are positions', async () => {
    const { container } = renderComponent(<Account />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(container.textContent).toBeTruthy());

    expect(container.textContent).toMatchSnapshot();
  });
});
