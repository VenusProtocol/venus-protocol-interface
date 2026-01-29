import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { renderHook } from 'testUtils/render';

import { useGetPool } from 'clients/api';
import { routes } from 'constants/routing';

import { usePathNodes } from '..';

describe('usePathNodes', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockImplementation(() => ({
      data: {
        pool: poolData[0],
      },
      isLoading: false,
    }));
  });

  it.each([
    [routes.dashboard.path, routes.dashboard.path],
    [routes.governance.path, routes.governance.path],
    [routes.governanceLeaderBoard.path, routes.governanceLeaderBoard.path],
    [
      routes.governanceProposal.path.replace(':proposalId', 'FAKE-PROPOSAL-ID'),
      routes.governanceProposal.path,
    ],
    [routes.governanceProposal.path.replace(':proposalId', '1'), routes.governanceProposal.path],
    [routes.governanceVoter.path.replace(':address', fakeAddress), routes.governanceVoter.path],
    [routes.isolatedPools.path, routes.isolatedPools.path],
    [routes.markets.path.replace(':poolComptrollerAddress', fakeAddress), routes.markets.path],
    [
      routes.market.path
        .replace(':poolComptrollerAddress', fakeAddress)
        .replace(':vTokenAddress', poolData[0].assets[0].vToken.address),
      routes.market.path,
    ],
    [routes.vai.path, routes.vai.path],
    [routes.staking.path, routes.staking.path],
    [routes.swap.path, routes.swap.path],
    [routes.primeCalculator.path, routes.primeCalculator.path],
  ])('outputs the right DOM based on the current path: %s', async (pathname, originalRoute) => {
    const { result } = renderHook(() => usePathNodes(), {
      routerInitialEntries: [pathname],
      routePath: originalRoute,
    });

    expect(result.current).toMatchSnapshot();
  });
});
