import Web3 from 'web3'; // eslint-disable-line import/no-unresolved
import * as constants from 'utilities/constants';

export const sendSupply = async (from, amount, callback) => {
  const web3 = new Web3(window.web3.currentProvider);
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.CONTRACT_VBNB_ABI),
      constants.CONTRACT_VBEP_ADDRESS.bnb.address
    );
    const contractData = contract.methods.mint().encodeABI();

    const tx = {
      from,
      to: constants.CONTRACT_VBEP_ADDRESS.bnb.address,
      value: amount,
      data: contractData
    };
    // // Send transaction
    await web3.eth.sendTransaction(tx, err => {
      if (!err) {
        callback(true);
      }
      callback(false);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    callback(false);
  }
};

export const sendRepay = async (from, amount, callback) => {
  const web3 = new Web3(window.web3.currentProvider);
  try {
    const contract = new web3.eth.Contract(
      JSON.parse(constants.CONTRACT_VBNB_ABI),
      constants.CONTRACT_VBEP_ADDRESS.bnb.address
    );
    const contractData = contract.methods.repayBorrow().encodeABI();

    const tx = {
      from,
      to: constants.CONTRACT_VBEP_ADDRESS.bnb.address,
      value: amount,
      data: contractData
    };
    // Send transaction
    await web3.eth.sendTransaction(tx, err => {
      if (!err) {
        callback(true);
      }
      callback(false);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    callback(false);
  }
};
