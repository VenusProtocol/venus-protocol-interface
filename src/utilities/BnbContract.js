import * as constants from 'utilities/constants';
import vbnbAbi from '../config/abis/vbnb.json';

export const sendSupply = async (web3, from, amount, callback) => {
  try {
    const contract = new web3.eth.Contract(
      vbnbAbi,
      constants.CONTRACT_VBEP_ADDRESS.bnb.address
    );
    const contractData = contract.methods.mint().encodeABI();

    const tx = {
      from,
      to: constants.CONTRACT_VBEP_ADDRESS.bnb.address,
      value: amount,
      data: contractData
    };

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

export const sendRepay = async (web3, from, amount, callback) => {
  try {
    const contract = new web3.eth.Contract(
      vbnbAbi,
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
