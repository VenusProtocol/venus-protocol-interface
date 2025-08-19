export enum Subdirectory {
  ISOLATED_POOLS = 'isolated-pools',
  POOL = 'pool/:poolComptrollerAddress',
  MARKETS = 'markets/:poolComptrollerAddress',
  MARKET = 'market/:vTokenAddress',
  PRIME_CALCULATOR = 'prime-calculator',
  ACCOUNT = 'account',
  PORT = 'port',
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
  BRIDGE = 'bridge',
}

const routeSubdirectories = {
  isolatedPools: [Subdirectory.ISOLATED_POOLS],
  pool: [Subdirectory.POOL],
  market: [Subdirectory.POOL, Subdirectory.MARKET],
  primeCalculator: [Subdirectory.PRIME_CALCULATOR],
  account: [Subdirectory.ACCOUNT],
  port: [Subdirectory.PORT],
  governance: [Subdirectory.GOVERNANCE],
  governanceProposal: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL],
  governanceProposalCreate: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_CREATE],
  governanceProposalInfo: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_INFO],
  governanceProposalDescriptions: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_DESCRIPTIONS],
  governanceProposalActions: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_ACTIONS],
  governanceProposalPreview: [Subdirectory.GOVERNANCE, Subdirectory.PROPOSAL_PREVIEW],
  governanceLeaderBoard: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD],
  governanceVoter: [Subdirectory.GOVERNANCE, Subdirectory.LEADER_BOARD, Subdirectory.VOTER],
  swap: [Subdirectory.SWAP],
  vaults: [Subdirectory.VAULTS],
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
