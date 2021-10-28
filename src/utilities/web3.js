import Web3 from 'web3';
import getNodeUrl from './getRpcUrl';

const RPC_URL = getNodeUrl();

const getWeb3NoAccount = () => {
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
    timeout: 10000
  });
  const web3NoAccount = new Web3(httpProvider);
  return web3NoAccount;
};

export { getWeb3NoAccount };
