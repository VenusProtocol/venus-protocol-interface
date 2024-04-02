export enum Subdirectory {
  DASHBOARD = '',
  ACCOUNT = 'account',
  XVS = 'xvs',
  CORE_POOL = 'core-pool',
  ISOLATED_POOL = 'pool/:poolComptrollerAddress',
  ISOLATED_POOLS = 'isolated-pools',
  MARKET = 'market/:vTokenAddress',
  MARKETS = 'markets/:poolComptrollerAddress',
  HISTORY = 'history',
  VAULTS = 'vaults',
  GOVERNANCE = 'governance',
  PROPOSAL = 'proposal/:proposalId',
  PROPOSAL_CREATE = 'proposal-create',
  PROPOSAL_INFO = 'proposal-info',
  PROPOSAL_DESCRIPTIONS = 'proposal-descriptions',
  PROPOSAL_ACTIONS = 'proposal-actions',
  PROPOSAL_PREVIEW = 'proposal-preview',
  LEADER_BOARD = 'leaderboard',
  VOTER = 'voter/:address',
  SWAP = 'swap',
  CONVERT_VRT = 'convert-vrt',
  VAI = 'vai',
  PRIME_CALCULATOR = 'prime-calculator',
  BRIDGE = 'bridge',
}

const routeSubdirectories = {
  dashboard: [Subdirectory.DASHBOARD],
  dashboardPrimeCalculator: [Subdirectory.DASHBOARD, Subdirectory.PRIME_CALCULATOR],
  account: [Subdirectory.ACCOUNT],
  accountPrimeCalculator: [Subdirectory.ACCOUNT, Subdirectory.PRIME_CALCULATOR],
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
  governanceProposalCreate: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_CREATE],
  governanceProposalInfo: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_INFO],
  governanceProposalDescriptions: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_DESCRIPTIONS],
  governanceProposalActions: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_ACTIONS],
  governanceProposalPreview: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_PREVIEW],
  governanceLeaderBoard: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD],
  governanceVoter: [Subdirectory.GOVERNANCE, Subdirectory.VOTER],
  history: [Subdirectory.HISTORY],
  swap: [Subdirectory.SWAP],
  convertVrt: [Subdirectory.CONVERT_VRT],
  vaults: [Subdirectory.VAULTS],
  vaultsPrimeCalculator: [Subdirectory.VAULTS, Subdirectory.PRIME_CALCULATOR],
  vai: [Subdirectory.VAI],
  bridge: [Subdirectory.BRIDGE],
};

export type RouteName = keyof typeof routeSubdirectories;

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
            path: `/${routeSubdirectories[key as RouteName].filter(sub => !!sub).join('/')}`,
            subdirectories: routeSubdirectories[key as RouteName],
          },
        }
      : obj,
  {} as Routes,
);
