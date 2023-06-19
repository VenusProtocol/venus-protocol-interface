import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { routes } from 'constants/routing';
import renderComponent from 'testUtils/renderComponent';

import Breadcrumbs from '.';

vi.mock('clients/api');

describe('component/Layout/Header/Breadcrumbs', () => {
  beforeEach(() => {
    (useGetPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    }));
  });

  it.each([
    routes.dashboard.path,
    routes.account.path,
    routes.governance.path,
    routes.governanceLeaderBoard.path,
    routes.governanceProposal.path.replace(':proposalId', 'FAKE-PROPOSAL-ID'),
    routes.governanceVoter.path.replace(':address', fakeAddress),
    routes.history.path,
    routes.pools.path,
    routes.pool.path.replace(':poolComptrollerAddress', fakeAddress),
    routes.market.path
      .replace(':poolComptrollerAddress', fakeAddress)
      .replace(':vTokenAddress', poolData[0].assets[0].vToken.address),
    routes.xvs.path,
    routes.vai.path,
    routes.vaults.path,
    routes.convertVrt.path,
    routes.swap.path,
  ])('outputs the right DOM based on the current path: %s', async pathname => {
    const { container } = renderComponent(
      <MemoryRouter initialEntries={[pathname]}>
        <Breadcrumbs />
      </MemoryRouter>,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
