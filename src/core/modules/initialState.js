const auth = {
  user: null
};

const account = {
  setting: {
    selectedAddress: null,
    marketType: 'supply',
    borrowMarket: [],
    supplyMarket: [],
    latestBlockNumber: '',
    decimals: {},
    assetList: [],
    totalBorrowBalance: '0',
    totalBorrowLimit: '0',
    pendingInfo: {
      type: '',
      status: false,
      amount: 0,
      symbol: ''
    },
    vaultVaiStaked: null,
    withXVS: true,
    markets: []
  }
};
export const initialState = {
  auth,
  account
};
