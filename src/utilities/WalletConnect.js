import Web3 from 'web3'; // eslint-disable-line import/no-unresolved
import WalletConnect from '@walletconnect/client';
import * as constants from 'utilities/constants';

const TOKEN_ABI = {
  sxp: constants.CONTRACT_SXP_TOKEN_ABI,
  usdc: constants.CONTRACT_USDC_TOKEN_ABI,
  usdt: constants.CONTRACT_USDT_TOKEN_ABI,
  busd: constants.CONTRACT_BUSD_TOKEN_ABI,
  xvs: constants.CONTRACT_XVS_TOKEN_ABI,
  btcb: constants.CONTRACT_BTCB_TOKEN_ABI,
  eth: constants.CONTRACT_ETH_TOKEN_ABI,
  ltc: constants.CONTRACT_LTC_TOKEN_ABI,
  xrp: constants.CONTRACT_XRP_TOKEN_ABI,
  bch: constants.CONTRACT_BCH_TOKEN_ABI,
  dot: constants.CONTRACT_DOT_TOKEN_ABI,
  link: constants.CONTRACT_LINK_TOKEN_ABI,
  dai: constants.CONTRACT_DAI_TOKEN_ABI,
  fil: constants.CONTRACT_FIL_TOKEN_ABI,
  beth: constants.CONTRACT_BETH_TOKEN_ABI
};

export default class WalletConnectClass {
  constructor(setConnect, setDisconnect) {
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org'
    });
    this.connector.on('connect', setConnect);
    this.connector.on('session_update', setConnect);
    this.connector.on('disconnect', setDisconnect);

    this.web3 = new Web3(
      new Web3.providers.HttpProvider("https://bsc-dataseed1.defibit.io")
    );
    window.web3 = this.web3;
  }

  static initialize() {
    return new WalletConnectClass();
  }

  async createSession() {
    if (!this.connector.connected) {
      try {
        await this.connector.createSession();
        return true;
      } catch (err) {
        return false;
      }
    } else {
      return true;
    }
  }

  killSession() {
    if (this.connector && this.connector.connected) {
      this.connector.killSession();
      this.connector = null;
    } else {
      this.connector = null;
    }
  }

  async getEthBalance(address) {
    if (this.web3.utils.isAddress(address)) {
      try {
        const weiBalance = await this.web3.eth.getBalance(address);
        const balance = Number(this.web3.utils.fromWei(weiBalance, 'ether'));
        return balance;
      } catch (err) {
        return new Error(err);
      }
    } else {
      return new Error(constants.INVALID_ADDRESS);
    }
  }

  getEthBalanceAsync(address, callback) {
    if (this.web3.utils.isAddress(address)) {
      this.web3.eth
        .getBalance(address)
        .then(weiBalance => {
          const balance = Number(this.web3.utils.fromWei(weiBalance, 'ether'));
          callback(balance, null);
        })
        .catch(err => {
          callback(null, new Error(err));
        });
    } else {
      callback(null, new Error(constants.INVALID_ADDRESS));
    }
  }

  fromWei(weiBalance) {
    return Number(this.web3.utils.fromWei(weiBalance, 'ether'));
  }

  getVaiTokenContract = () => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_VAI_TOKEN_ABI),
      constants.CONTRACT_VAI_TOKEN_ADDRESS
    );
  };

  getVaiControllerContract = () => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_VAI_CONTROLLER_ABI),
      constants.CONTRACT_VAI_UNITROLLER_ADDRESS
    );
  };

  getVaiVaultContract = () => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_VAI_VAULT_ABI),
      constants.CONTRACT_VAI_VAULT_ADDRESS
    );
  };

  getTokenContract = name => {
    return new this.web3.eth.Contract(
      JSON.parse(TOKEN_ABI[name]),
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

  getPriceOracleContract = (
    address = constants.CONTRACT_PRICE_ORACLE_ADDRESS
  ) => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_PRICE_ORACLE_ABI),
      address
    );
  };

  getVoteContract = () => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_VOTE_ABI),
      constants.CONTRACT_VOTE_ADDRESS
    );
  };

  getInterestModelContract = address => {
    return new this.web3.eth.Contract(
      JSON.parse(constants.CONTRACT_INTEREST_MODEL_ABI),
      address
    );
  };

  getTokenBalanceAsync(contractAddress, address, callback) {
    let updatedAddress = address;
    if (address.slice(0, 2) === '0x') {
      updatedAddress = address.substring(2);
    }
    const contractData = `0x70a08231000000000000000000000000${updatedAddress}`;

    if (this.web3.utils.isAddress(address)) {
      this.web3.eth
        .call({ to: contractAddress, data: contractData })
        .then(weiBalance => {
          const balance = Number(this.web3.utils.fromWei(weiBalance, 'ether'));
          callback(balance, null);
        })
        .catch(err => {
          callback(null, new Error(err));
        });
    } else {
      callback(null, new Error(constants.INVALID_ADDRESS));
    }
  }

  // async getNonce(address) {
  //   try {
  //     return await this.web3.eth.getTransactionCount(address);
  //   } catch (err) {
  //     return null;
  //   }
  // }

  // async sendApprove(from, amount) {
  //   try {
  //     const nonce = await this.web3.eth.getTransactionCount(from);
  //     const value = this.web3.utils.toWei(amount, 'ether');

  //     const contract = new this.web3.eth.Contract(
  //       JSON.parse(constants.CONTRACT_TOKEN_ABI),
  //       constants.CONTRACT_TOKEN_ADDRESS
  //     );
  //     const contractData = contract.methods
  //       .approve(constants.CONTRACT_STAKE_ADDRESS, value)
  //       .encodeABI();

  //     const tx = {
  //       from,
  //       to: constants.CONTRACT_TOKEN_ADDRESS,
  //       data: contractData,
  //       nonce
  //     };
  //     // Send transaction
  //     await this.connector
  //       .sendTransaction(tx)
  //       .then(result => {
  //         // Returns transaction id (hash)
  //         console.log(result);
  //         return true;
  //       })
  //       .catch(error => {
  //         // Error returned when rejected
  //         console.error(error);
  //         return false;
  //       });
  //     return false;
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //     return false;
  //   }
  // }

  // async sendSupply(from, amount) {
  //   try {
  //     const nonce = await this.web3.eth.getTransactionCount(from);
  //     const value = this.web3.utils.toWei(amount, 'ether');

  //     const contract = new this.web3.eth.Contract(
  //       JSON.parse(constants.CONTRACT_STAKE_ABI),
  //       constants.CONTRACT_STAKE_ADDRESS
  //     );
  //     const contractData = contract.methods.stake(value).encodeABI();

  //     const tx = {
  //       from,
  //       to: constants.CONTRACT_STAKE_ADDRESS,
  //       data: contractData,
  //       nonce
  //     };
  //     // Send transaction
  //     await this.connector
  //       .sendTransaction(tx)
  //       .then(result => {
  //         // Returns transaction id (hash)
  //         console.log(result);
  //         return true;
  //       })
  //       .catch(error => {
  //         // Error returned when rejected
  //         console.error(error);
  //         return false;
  //       });
  //     return false;
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //     return false;
  //   }
  // }

  // async sendWithdraw(from, amount) {
  //   try {
  //     const nonce = await this.web3.eth.getTransactionCount(from);
  //     const value = this.web3.utils.toWei(amount, 'ether');

  //     const contract = new this.web3.eth.Contract(
  //       JSON.parse(constants.CONTRACT_STAKE_ABI),
  //       constants.CONTRACT_STAKE_ADDRESS
  //     );
  //     const contractData = contract.methods.withdraw(value).encodeABI();

  //     const tx = {
  //       from,
  //       to: constants.CONTRACT_STAKE_ADDRESS,
  //       data: contractData,
  //       nonce
  //     };

  //     // Send transaction
  //     await this.connector
  //       .sendTransaction(tx)
  //       .then(result => {
  //         // Returns transaction id (hash)
  //         console.log(result);
  //         return true;
  //       })
  //       .catch(error => {
  //         // Error returned when rejected
  //         console.error(error);
  //         return false;
  //       });
  //     return false;
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //     return false;
  //   }
  // }
}
