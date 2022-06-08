enum FunctionKey {
  // Queries
  GET_VAI_TREASURY_PERCENTAGE = 'GET_VAI_TREASURY_PERCENTAGE',
  GET_MARKETS = 'GET_MARKETS',
  GET_MARKET_HISTORY = 'GET_MARKET_HISTORY',
  GET_ASSETS_IN_ACCOUNT = 'GET_ASSETS_IN_ACCOUNT',
  GET_VENUS_ACCRUED = 'GET_VENUS_ACCRUED',
  GET_VENUS_VAI_STATE = 'GET_VENUS_VAI_STATE',
  GET_MINTED_VAI = 'GET_MINTED_VAI',
  GET_XVS_REWARD = 'GET_XVS_REWARD',
  GET_TOKEN_ALLOWANCE = 'GET_TOKEN_ALLOWANCE',
  GET_BALANCE_OF = 'GET_BALANCE_OF',
  GET_VRT_CONVERSION_END_TIME = 'GET_VRT_CONVERSION_END_TIME',
  GET_VRT_CONVERSION_RATIO = 'GET_VRT_CONVERSION_RATIO',
  GET_XVS_WITHDRAWABLE_AMOUNT = 'GET_XVS_WITHDRAWABLE_AMOUNT',
  GET_VENUS_VAI_VAULT_DAILY_RATE_WEI = 'GET_VENUS_VAI_VAULT_DAILY_RATE_WEI',
  GET_VENUS_VAI_VAULT_RATE = 'GET_VENUS_VAI_VAULT_RATE',
  GET_V_TOKEN_CASH = 'GET_V_TOKEN_CASH',
  GET_V_TOKEN_BORROW_BALANCE = 'GET_V_TOKEN_BORROW_BALANCE',
  GET_V_TOKEN_BALANCE = 'GET_V_TOKEN_BALANCE',
  GET_V_TOKEN_BALANCES_ALL = 'GET_V_TOKEN_BALANCES_ALL',
  GET_V_TOKEN_DAILY_XVS = 'GET_V_TOKEN_DAILY_XVS',
  GET_V_TOKEN_INTEREST_RATE_MODEL = 'GET_V_TOKEN_INTEREST_RATE_MODEL',
  GET_V_TOKEN_APY_SIMULATIONS = 'GET_V_TOKEN_APY_SIMULATIONS',
  GET_TRANSACTIONS = 'GET_TRANSACTIONS',
  GET_XVS_VAULT_REWARD_WEI_PER_BLOCK = 'GET_XVS_VAULT_REWARD_WEI_PER_BLOCK',
  GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS = 'GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS',
  GET_XVS_VAULT_POOL_INFOS = 'GET_XVS_VAULT_POOL_INFOS',
  GET_XVS_VAULT_PENDING_REWARD_WEI = 'GET_XVS_VAULT_PENDING_REWARD_WEI',
  GET_XVS_VAULT_USER_INFO = 'GET_XVS_VAULT_USER_INFO',
  GET_XVS_VAULT_POOLS_COUNT = 'GET_XVS_VAULT_POOLS_COUNT',
  GET_CURRENT_VOTES = 'GET_CURRENT_VOTES',
  GET_PENDING_XVS = 'GET_PENDING_XVS',
  GET_PROPOSALS = 'GET_PROPOSALS',
  GET_VOTE_RECEIPT = 'GET_VOTE_RECEIPT',
  GET_VAI_VAULT_USER_INFO = 'GET_VAI_VAULT_USER_INFO',
  GET_VAI_VAULT_PENDING_XVS = 'GET_VAI_VAULT_PENDING_XVS',
  GET_VOTE_DELEGATE_ADDRESS = 'GET_VOTE_DELEGATE_ADDRESS',
  SET_VOTE_DELEGATE = 'SET_VOTE_DELEGATE',

  // Mutations
  REQUEST_FAUCET_FUNDS = 'REQUEST_FAUCET_FUNDS',
  MINT_VAI = 'MINT_VAI',
  ENTER_MARKETS = 'ENTER_MARKETS',
  EXIT_MARKET = 'EXIT_MARKET',
  REPAY_VAI = 'REPAY_VAI',
  APPROVE_TOKEN = 'APPROVE_TOKEN',
  APPROVE_VRT = 'APPROVE_VRT',
  CONVERT_VRT = 'CONVERT_VRT',
  SUPPLY = 'SUPPLY',
  SUPPLY_BNB = 'SUPPLY_BNB',
  REDEEM = 'REDEEM',
  REDEEM_UNDERLYING = 'REDEEM_UNDERLYING',
  CLAIM_XVS_REWARD = 'CLAIM_XVS_REWARD',
  REPAY_NON_BNB_V_TOKEN = 'REPAY_NON_BNB_V_TOKEN',
  REPAY_BNB = 'REPAY_BNB',
  BORROW_V_TOKEN = 'BORROW_V_TOKEN',
  WITHDRAW_XVS = 'WITHDRAW_XVS',
}

export default FunctionKey;
