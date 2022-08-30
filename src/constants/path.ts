enum Path {
  ROOT = '/',
  XVS = '/xvs',
  MARKETS = '/markets',
  MARKET = '/market/:marketId',
  ASSET = '/market/:marketId/asset/:vTokenId',
  HISTORY = '/history',
  VAULTS = '/vaults',
  GOVERNANCE = '/governance',
  GOVERNANCE_LEADER_BOARD = '/governance/leaderboard',
  GOVERNANCE_PROPOSAL_DETAILS = '/governance/proposal/:id',
  GOVERNANCE_ADDRESS = '/governance/address/:address',
  CONVERT_VRT = '/convert-vrt',
}

export default Path;
