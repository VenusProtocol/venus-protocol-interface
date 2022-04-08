import { restService } from 'utilities';

export type AssetTicker =
  | 'usdc'
  | 'usdt'
  | 'busd'
  | 'bnb'
  | 'sxp'
  | 'xvs'
  | 'btcb'
  | 'eth'
  | 'ltc'
  | 'xrp';

export type RequestFaucetFundsInput = {
  address: string;
  asset: AssetTicker;
  amountType: 'low' | 'medium' | 'high';
};

export type RequestFaucetFundsOutput = void;

const stakeCoins = async (params: RequestFaucetFundsInput): Promise<RequestFaucetFundsOutput> => {
  const response = await restService({ api: '/faucet', method: 'POST', params });

  if ('data' in response && response.data.status === false) {
    throw new Error(response.data.message);
  }
};

export default stakeCoins;
