import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { xvs } from '__mocks__/models/tokens';
import { vaults } from '__mocks__/models/vaults';
import { useGetPool, useGetVaults } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import type { Pool, Vault } from 'types';
import { Guide } from '..';

describe('Guide', () => {
  it('renders nothing if user has already completed all the steps', () => {
    const customFakePool: Pool = {
      ...poolData[0],
      userSupplyBalanceCents: new BigNumber(2000),
      userBorrowBalanceCents: new BigNumber(1000),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    const customFakeVault: Vault = {
      ...vaults[0],
      stakedToken: xvs,
      userStakedMantissa: new BigNumber('1000000000000000000'),
    };

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [customFakeVault],
      isLoading: false,
    }));

    const { container } = renderComponent(<Guide />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders UI if user is not connected', () => {
    const { container } = renderComponent(<Guide />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders UI if user has some steps left to complete', () => {
    const customFakePool: Pool = {
      ...poolData[0],
      userSupplyBalanceCents: new BigNumber(100),
      userBorrowBalanceCents: new BigNumber(0),
    };

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: customFakePool,
      },
    }));

    const customFakeVault: Vault = {
      ...vaults[0],
      stakedToken: xvs,
      userStakedMantissa: new BigNumber(0),
    };

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [customFakeVault],
      isLoading: false,
    }));

    const { container } = renderComponent(<Guide />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.textContent).toMatchSnapshot();
  });
});
