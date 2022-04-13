import * as constants from 'constants/contracts';
import vbnbAbi from 'constants/contractAbis/vbnb.json';

// @TODO: remove in favor or contracts client

export const sendSupply = async (
  web3: $TSFixMe,

  from: $TSFixMe,

  amount: $TSFixMe,

  callback: $TSFixMe,
) => {
  try {
    // TODO: use contracts client
    const contract = new web3.eth.Contract(vbnbAbi, constants.VBEP_TOKENS.bnb.address);
    const contractData = contract.methods.mint().encodeABI();

    const tx = {
      from,
      to: constants.VBEP_TOKENS.bnb.address,
      value: amount,
      data: contractData,
    };

    await web3.eth.sendTransaction(tx, (err: $TSFixMe) => {
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

export const sendRepay = async (
  web3: $TSFixMe,

  from: $TSFixMe,

  amount: $TSFixMe,

  callback: $TSFixMe,
) => {
  try {
    // TODO: use contracts client
    const contract = new web3.eth.Contract(vbnbAbi, constants.VBEP_TOKENS.bnb.address);
    const contractData = contract.methods.repayBorrow().encodeABI();

    const tx = {
      from,
      to: constants.VBEP_TOKENS.bnb.address,
      value: amount,
      data: contractData,
    };
    // Send transaction

    await web3.eth.sendTransaction(tx, (err: $TSFixMe) => {
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
