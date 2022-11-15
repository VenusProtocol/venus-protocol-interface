export enum Subdirectory {
  DASHBOARD = '/',
  ACCOUNT = '/account',
  XVS = '/xvs',
  POOLS = '/pools',
  POOL = '/pool/:poolId',
  MARKET = '/market/:vTokenId',
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
  pools: [Subdirectory.POOLS],
  pool: [Subdirectory.POOLS, Subdirectory.POOL],
  market: [Subdirectory.POOLS, Subdirectory.POOL, Subdirectory.MARKET],
  governance: [Subdirectory.GOVERNANCE],
  governanceProposal: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL],
  governanceLeaderBoard: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD],
  governanceVoter: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD, Subdirectory.VOTER],
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
