import { waitFor } from '@testing-library/dom';
import { BigNumber } from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { vaults } from '__mocks__/models/vaults';
import { useGetVaults } from 'clients/api';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { Staking } from '..';

describe('Staking', () => {
  it('displays content correctly', async () => {
    (useGetVaults as Mock).mockImplementation(() => ({
      data: vaults.map(vault => ({
        ...vault,
        userStakedMantissa: new BigNumber(0),
      })),
      isLoading: false,
    }));

    const { container, queryAllByText } = renderComponent(<Staking />);

    await waitFor(() => expect(queryAllByText(en.vault.totalStaked).length).not.toBe(0));

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays content correctly when user is connected', async () => {
    const { container, queryAllByText } = renderComponent(<Staking />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => expect(queryAllByText(en.vault.dailyEmission).length).not.toBe(0));

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays placeholder when user has no vault positions', async () => {
    (useGetVaults as Mock).mockImplementation(() => ({
      data: vaults.map(vault => ({
        ...vault,
        userStakedMantissa: new BigNumber(0),
      })),
      isLoading: false,
    }));

    const { container } = renderComponent(<Staking />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.textContent).toMatchSnapshot();
  });
});
