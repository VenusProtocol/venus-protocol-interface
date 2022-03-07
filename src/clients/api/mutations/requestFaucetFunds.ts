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

export interface IRequestFaucetFundsInput {
  address: string;
  asset: AssetTicker;
  amountType: 'low' | 'medium' | 'high';
}

export type IRequestFaucetFundsOutput = void;

const stakeCoins = async (params: IRequestFaucetFundsInput): Promise<IRequestFaucetFundsOutput> => {
  const response = await restService({ api: '/faucet', method: 'POST', params });

  if ('data' in response && response.data.status === false) {
    throw new Error(response.data.message);
  }
};

export default stakeCoins;
