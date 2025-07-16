export enum Subdirectory {
  DASHBOARD = '',
  ACCOUNT = 'account',
  IMPORT = 'import',
  XVS = 'xvs',
  POOLS = 'pools',
  POOL = 'pool/:poolComptrollerAddress',
  MARKET = 'market/:vTokenAddress',
  MARKETS = 'markets/:poolComptrollerAddress',
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
  VAI = 'vai',
  PRIME_CALCULATOR = 'prime-calculator',
  BRIDGE = 'bridge',
}

const routeSubdirectories = {
  dashboard: [Subdirectory.DASHBOARD],
  dashboardPrimeCalculator: [Subdirectory.DASHBOARD, Subdirectory.PRIME_CALCULATOR],
  account: [Subdirectory.ACCOUNT],
  import: [Subdirectory.IMPORT],
  accountPrimeCalculator: [Subdirectory.ACCOUNT, Subdirectory.PRIME_CALCULATOR],
  xvs: [Subdirectory.XVS],
  pools: [Subdirectory.POOLS],
  pool: [Subdirectory.POOLS, Subdirectory.POOL],
  market: [Subdirectory.POOLS, Subdirectory.POOL, Subdirectory.MARKET],
  governance: [Subdirectory.GOVERNANCE],
  governanceProposal: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL],
  governanceProposalCreate: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_CREATE],
  governanceProposalInfo: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_INFO],
  governanceProposalDescriptions: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_DESCRIPTIONS],
  governanceProposalActions: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_ACTIONS],
  governanceProposalPreview: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_PREVIEW],
  governanceLeaderBoard: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD],
  governanceVoter: [Subdirectory.GOVERNANCE, Subdirectory.VOTER],
  swap: [Subdirectory.SWAP],
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
