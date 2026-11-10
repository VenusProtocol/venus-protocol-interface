import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
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
    [routes.markets.path.replace(':poolComptrollerAddress', fakeAddress), routes.markets.path],
    [
      routes.market.path
        .replace(':poolComptrollerAddress', fakeAddress)
        .replace(':vTokenAddress', poolData[0].assets[0].vToken.address),
      routes.market.path,
    ],
    [routes.vai.path, routes.vai.path],
    [routes.vaults.path, routes.vaults.path],
    [routes.primeCalculator.path, routes.primeCalculator.path],
    [routes.liquidityHubs.path, routes.liquidityHubs.path],
    [
      routes.liquidityHub.path.replace(':vhTokenAddress', liquidityHubs[0].vhToken.address),
      routes.liquidityHub.path,
    ],
  ])('outputs the right DOM based on the current path: %s', async (pathname, originalRoute) => {
    const { result } = renderHook(() => usePathNodes(), {
      routerInitialEntries: [pathname],
      routePath: originalRoute,
    });

    expect(result.current).toMatchSnapshot();
  });

  it('links each breadcrumb to its route on the voter page', () => {
    const { result } = renderHook(() => usePathNodes(), {
      routerInitialEntries: [routes.governanceVoter.path.replace(':address', fakeAddress)],
      routePath: routes.governanceVoter.path,
    });

    expect(result.current.map(pathNode => pathNode.href)).toEqual([
      routes.governance.path,
      routes.governanceLeaderBoard.path,
      routes.governanceVoter.path.replace(':address', fakeAddress),
    ]);
  });

  it('links the pool breadcrumb to the pool page on the market page', () => {
    const poolPath = routes.markets.path.replace(':poolComptrollerAddress', fakeAddress);
    const vTokenAddress = poolData[0].assets[0].vToken.address;

    const { result } = renderHook(() => usePathNodes(), {
      routerInitialEntries: [`${poolPath}/${vTokenAddress}`],
      routePath: routes.market.path,
    });

    expect(result.current.map(pathNode => pathNode.href)).toEqual([
      poolPath,
      `${poolPath}/${vTokenAddress}`,
    ]);
  });
});
