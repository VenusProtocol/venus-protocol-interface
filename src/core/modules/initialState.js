const auth = {
  user: null
};

const account = {
  setting: {
    marketType: 'supply',
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
  }
};
export const initialState = {
  auth,
  account
};
