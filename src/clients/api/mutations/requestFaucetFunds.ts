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

const requestFaucetFundsInput = async (
  params: RequestFaucetFundsInput,
): Promise<RequestFaucetFundsOutput> => {
  const response = await restService<RequestFaucetFundsOutput>({
    endpoint: '/faucet',
    method: 'POST',
    params,
  });

  if ('result' in response && response.result === 'error') {
    throw new Error(response.message);
  }
};

export default requestFaucetFundsInput;
