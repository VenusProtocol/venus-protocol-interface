export enum Subdirectory {
  DASHBOARD = '/',
  ACCOUNT = '/account',
  XVS = '/xvs',
  CORE_POOL = '/core-pool',
  ISOLATED_POOL = '/pool/:poolComptrollerAddress',
  ISOLATED_POOLS = '/isolated-pools',
  MARKET = '/market/:vTokenAddress',
  MARKETS = '/markets/:poolComptrollerAddress',
  HISTORY = '/history',
  VAULTS = '/vaults',
  GOVERNANCE = '/governance',
  LEADER_BOARD = '/leaderboard',
  PROPOSAL = '/proposal/:proposalId',
  VOTER = '/voter/:address',
  SWAP = '/swap',
  CONVERT_VRT = '/convert-vrt',
  VAI = '/vai',
}

const routeSubdirectories = {
  dashboard: [Subdirectory.DASHBOARD],
  account: [Subdirectory.ACCOUNT],
  xvs: [Subdirectory.XVS],
  isolatedPools: [Subdirectory.ISOLATED_POOLS],
  corePool: [Subdirectory.CORE_POOL],
  corePoolMarket: [Subdirectory.CORE_POOL, Subdirectory.MARKET],
  isolatedPool: [Subdirectory.ISOLATED_POOLS, Subdirectory.ISOLATED_POOL],
  isolatedPoolMarket: [
    Subdirectory.ISOLATED_POOLS,
    Subdirectory.ISOLATED_POOL,
    Subdirectory.MARKET,
  ],
  governance: [Subdirectory.GOVERNANCE],
  governanceProposal: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL],
  governanceLeaderBoard: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD],
  governanceVoter: [Subdirectory.GOVERNANCE, Subdirectory.VOTER],
  history: [Subdirectory.HISTORY],
  swap: [Subdirectory.SWAP],
  convertVrt: [Subdirectory.CONVERT_VRT],
  vaults: [Subdirectory.VAULTS],
  vai: [Subdirectory.VAI],
};

type RouteName = keyof typeof routeSubdirectories;

type Routes = {
  [key in RouteName]: {
    path: string;
    subdirectories: Subdirectory[];
  };
};

export const routes = Object.keys(routeSubdirectories).reduce<Routes>(
  (obj, key) =>
    Object.prototype.hasOwnProperty.call(routeSubdirectories, key)
      ? {
          ...obj,
          [key]: {
            path: routeSubdirectories[key as RouteName].join(''),
            subdirectories: routeSubdirectories[key as RouteName],
          },
        }
      : obj,
  {} as Routes,
);
