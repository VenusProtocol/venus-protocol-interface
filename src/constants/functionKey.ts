enum FunctionKey {
  // Queries
  GET_VAI_TREASURY_PERCENTAGE = 'GET_VAI_TREASURY_PERCENTAGE',
  GET_MARKETS = 'GET_MARKETS',
  GET_ASSETS_IN_ACCOUNT = 'GET_ASSETS_IN_ACCOUNT',
  GET_VTOKEN_BALANCES_ALL = 'GET_VTOKEN_BALANCES_ALL',
  GET_HYPOTHETICAL_LIQUIDITY = 'GET_HYPOTHETICAL_LIQUIDITY',
  GET_V_TOKEN_BALANCE = 'GET_V_TOKEN_BALANCE',
  GET_VENUS_INITIAL_INDEX = 'GET_VENUS_INITIAL_INDEX',
  GET_XVS_ACCRUED = 'GET_XVS_ACCRUED',
  GET_VAI_STATE = 'GET_VAI_STATE',

  // Mutations
  REQUEST_FAUCET_FUNDS = 'REQUEST_FAUCET_FUNDS',
  MINT_VAI = 'MINT_VAI',
  ENTER_MARKETS = 'ENTER_MARKETS',
  EXIT_MARKET = 'EXIT_MARKET',
  REPAY_VAI = 'REPAY_VAI',
  APPROVE_TOKEN = 'APPROVE_TOKEN',
  SUPPLY = 'SUPPLY',
  SUPPLY_BNB = 'SUPPLY_BNB',
  REDEEM = 'REDEEM',
  REDEEM_UNDERLYING = 'REDEEM_UNDERLYING',
  CLAIM_VENUS = 'CLAIM_VENUS',
}

export default FunctionKey;
