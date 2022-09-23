export enum Subdirectory {
  DASHBOARD = '/',
  ACCOUNT = '/account',
  XVS = '/xvs',
  MARKETS = '/markets',
  MARKET = '/market/:marketId',
  ASSET = '/asset/:vTokenId',
  HISTORY = '/history',
  VAULTS = '/vaults',
  GOVERNANCE = '/governance',
  LEADER_BOARD = '/leaderboard',
  PROPOSAL = '/proposal/:id',
  VOTER = '/voter/:address',
  CONVERT_VRT = '/convert-vrt',
  VAI = '/vai',
}

export const routeSubdirectories = {
  dashboard: [Subdirectory.DASHBOARD],
  account: [Subdirectory.ACCOUNT],
  xvs: [Subdirectory.XVS],
  markets: [Subdirectory.MARKETS],
  market: [Subdirectory.MARKETS, Subdirectory.MARKET],
  marketAsset: [Subdirectory.MARKETS, Subdirectory.MARKET, Subdirectory.ASSET],
  governance: [Subdirectory.GOVERNANCE],
  governanceProposal: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL],
  governanceLeaderBoard: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD],
  governanceVoter: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD, Subdirectory.VOTER],
  history: [Subdirectory.HISTORY],
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
