import Web3 from 'web3';

import { RPC_URL } from 'config';

// @todo: we will get the "No 'Access-Control-Allow-Origin' header is present on the requested resource"
// error on the frontend in testnet when the wallet is unconnected, because the bsc official testnet endpoints
// don't support CORS request right now, and we didn't find any working testnet endpoints for
// HTTPProvider or WebSocketProvider neither.
const getWeb3NoAccount = () => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
    timeout: 10000,
  });
  const web3NoAccount = new Web3(httpProvider);
  return web3NoAccount;
};

export default getWeb3NoAccount;
