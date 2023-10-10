import React from 'react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import vTokens from '__mocks__/models/vTokens';
import { useGetPool, useGetVTokens } from 'clients/api';
import { routes } from 'constants/routing';
import renderComponent from 'testUtils/renderComponent';

import { Breadcrumbs } from '.';

describe('component/Layout/Header/Breadcrumbs', () => {
  beforeEach(() => {
    (useGetVTokens as Vi.Mock).mockImplementation(() => ({
      data: {
        vTokens,
      },
      isLoading: false,
    }));

    (useGetPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    }));
  });

  it.each([
    [routes.dashboard.path, routes.dashboard.path],
    [routes.account.path, routes.account.path],
    [routes.governance.path, routes.governance.path],
    [routes.governanceLeaderBoard.path, routes.governanceLeaderBoard.path],
    [
      routes.governanceProposal.path.replace(':proposalId', 'FAKE-PROPOSAL-ID'),
      routes.governanceProposal.path,
    ],
    [routes.governanceVoter.path.replace(':address', fakeAddress), routes.governanceVoter.path],
    [routes.history.path, routes.history.path],
    [routes.isolatedPools.path, routes.isolatedPools.path],
    [
      routes.isolatedPool.path.replace(':poolComptrollerAddress', fakeAddress),
      routes.isolatedPool.path,
    ],
    [
      routes.isolatedPoolMarket.path
        .replace(':poolComptrollerAddress', fakeAddress)
        .replace(':vTokenAddress', poolData[0].assets[0].vToken.address),
      routes.isolatedPoolMarket.path,
    ],
    [routes.corePool.path, routes.corePool.path],
    [
      routes.corePoolMarket.path.replace(':vTokenAddress', poolData[0].assets[0].vToken.address),
      routes.corePoolMarket.path,
    ],
    [routes.xvs.path, routes.xvs.path],
    [routes.vai.path, routes.vai.path],
    [routes.vaults.path, routes.vaults.path],
    [routes.convertVrt.path, routes.convertVrt.path],
    [routes.swap.path, routes.swap.path],
  ])('outputs the right DOM based on the current path: %s', async (pathname, originalRoute) => {
    const { container } = renderComponent(<Breadcrumbs />, {
      routerOpts: {
        routerInitialEntries: [pathname],
        routePath: originalRoute,
      },
    });

    expect(container.textContent).toMatchSnapshot();
  });
});
