enum Path {
  ROOT = '/',
  ACCOUNT = '/account',
  XVS = '/xvs',
  MARKETS = '/markets',
  MARKET = '/markets/:marketId',
  MARKET_ASSET = '/markets/:marketId/:vTokenId',
  HISTORY = '/history',
  VAULTS = '/vaults',
  GOVERNANCE = '/governance',
  GOVERNANCE_LEADER_BOARD = '/governance/leaderboard',
  GOVERNANCE_PROPOSAL_DETAILS = '/governance/proposal/:id',
  GOVERNANCE_ADDRESS = '/governance/address/:address',
  CONVERT_VRT = '/convert-vrt',
}

export default Path;
