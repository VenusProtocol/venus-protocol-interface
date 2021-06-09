import Web3 from 'web3'; // eslint-disable-line import/no-unresolved

import * as constants from './constants';

export default class MetaMask {
  static async initialize(
    { maxListeners } = { maxListeners: 300 },
    walletType
  ) {
    const instance = await MetaMask.getWeb3(walletType);
    const provider = instance.currentProvider;
    provider.setMaxListeners(maxListeners);
    return new MetaMask(provider);
  }

  static hasWeb3() {
    return typeof window !== 'undefined' && Boolean(window.ethereum);
  }

  static async getWeb3(walletType) {
    if (window.ethereum && walletType !== 'binance') {
      // Modern dapp browsers

      window.web3 = new Web3(window.ethereum);
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      await window.ethereum.enable();
      return window.web3;
    }
    if (window.BinanceChain && walletType === 'binance') {
      window.web3 = new Web3(
        process.env.REACT_APP_ENV === 'dev'
          ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
          : 'https://bsc-dataseed.binance.org'
      );
      return window.web3;
    }
    throw new Error(constants.NOT_INSTALLED);
  }

  constructor(provider) {
    if (!provider) {
      throw new Error(constants.MISSING_PROVIDER);
    }
    this.web3 = new Web3(provider);
  }

  async getWeb3() {
    return this.web3;
  }

  async getAccounts(walletType) {
    return new Promise((resolve, reject) => {
      if (walletType !== 'binance') {
        this.web3.eth.getAccounts((err, accounts) => {
          if (err !== null) {
            reject(err);
          } else if (accounts.length === 0) {
            reject(new Error(constants.LOCKED));
          } else {
            resolve(accounts);
          }
        });
      } else {
        window.BinanceChain.request({ method: 'eth_requestAccounts' })
          .then(accounts => {
            if (accounts.length === 0) {
              reject(new Error(constants.LOCKED));
            } else {
              resolve(accounts);
            }
          })
          .catch(err => {
            reject(err);
            if (err.code === 4001) {
              // EIP-1193 userRejectedRequest error
              // If this happens, the user rejected the connection request.
              console.log('Please connect to MetaMask.');
            } else {
              console.error(err);
            }
          });
      }
    });
  }

  async getLatestBlockNumber() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBlockNumber((err, blockNumber) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(blockNumber);
        }
      });
    });
  }
}
