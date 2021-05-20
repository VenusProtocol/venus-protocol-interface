import Web3 from 'web3'; // eslint-disable-line import/no-unresolved

import * as constants from 'utilities/constants';

export default class BinanceWalletConnectClass {
  constructor(setConnect, setDisconnect, onChangeAccount) {
    this.connector = window.BinanceChain;
    this.connector.on('connect', setConnect);
    this.connector.on('accountsChanged', onChangeAccount);
    this.connector.on('disconnect', setDisconnect);
    this.web3 = new Web3(
      process.env.REACT_APP_ENV === 'dev'
        ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
        : 'https://bsc-dataseed.binance.org'
    );
    this.TOKEN_ABI = {
      sxp: constants.CONTRACT_SXP_TOKEN_ABI,
      usdc: constants.CONTRACT_USDC_TOKEN_ABI,
      usdt: constants.CONTRACT_USDT_TOKEN_ABI,
      busd: constants.CONTRACT_BUSD_TOKEN_ABI,
      xvs: constants.CONTRACT_XVS_TOKEN_ABI
    };
  }

  static initialize() {
    return new BinanceWalletConnectClass();
  }

  getTokenContract = name => {
    return new this.web3.eth.Contract(
      JSON.parse(this.TOKEN_ABI[name]),
      constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc']
        ? constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'].address
        : constants.CONTRACT_TOKEN_ADDRESS.usdc.address
    );
  };

  getVbepContract = name => {
    return new this.web3.eth.Contract(
      JSON.parse(
        name !== 'bnb'
          ? constants.CONTRACT_VBEP_ABI
          : constants.CONTRACT_VBNB_ABI
      ),
      constants.CONTRACT_VBEP_ADDRESS[name || 'usdc']
        ? constants.CONTRACT_VBEP_ADDRESS[name || 'usdc'].address
        : constants.CONTRACT_VBEP_ADDRESS.usdc.address
    );
  };

  getComptrollerContract = () => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_COMPTROLLER_ABI),
      constants.CONTRACT_COMPTROLLER_ADDRESS
    );
  };

  async sendEnterMarkets(from, vtokens, callback) {
    try {
      const contract = this.getComptrollerContract();
      const contractData = contract.methods.enterMarkets(vtokens).encodeABI();

      const tx = {
        from,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendExitMarket(from, vtoken, callback) {
    try {
      const contract = this.getComptrollerContract();
      const contractData = contract.methods.exitMarket(vtoken).encodeABI();

      const tx = {
        from,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendApprove(assetName, from, vtokenAddress, amount, callback) {
    try {
      const contract = this.getTokenContract(assetName);
      const contractData = contract.methods
        .approve(vtokenAddress, amount)
        .encodeABI();

      const tx = {
        from,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendSupply(assetName, from, amount, callback) {
    try {
      const contract = this.getVbepContract(assetName);
      const contractData = contract.methods.mint().encodeABI();

      const tx = {
        from,
        value: amount,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendRedeem(assetName, from, amount, callback) {
    try {
      const contract = this.getVbepContract(assetName);
      const contractData = contract.methods.redeem(amount).encodeABI();

      const tx = {
        from,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendRedeemUnderlying(assetName, from, amount, callback) {
    try {
      const contract = this.getVbepContract(assetName);
      const contractData = contract.methods
        .redeemUnderlying(amount)
        .encodeABI();

      const tx = {
        from,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendBorrow(assetName, from, amount, callback) {
    try {
      const contract = this.getVbepContract(assetName);
      const contractData = contract.methods.borrow().encodeABI();

      const tx = {
        from,
        value: amount,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }

  async sendRepay(assetName, from, amount, callback) {
    try {
      const contract = this.getVbepContract(assetName);
      const contractData = contract.methods.repayBorrow(amount).encodeABI();

      const tx = {
        from,
        data: contractData
      };
      await window.BinanceChain.request({
        method: 'eth_sendTransaction',
        tx
      })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error);
        });
    } catch (err) {
      // eslint-disable-next-line no-console
      callback(false);
    }
  }
}
