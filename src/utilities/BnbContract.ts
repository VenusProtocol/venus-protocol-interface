import { getVBepToken } from 'utilities';
import vbnbAbi from 'constants/contracts/abis/vbnb.json';

const vBnbAddress = getVBepToken('bnb').address;

// @TODO: remove once new Mint/Repay VAI component is implemented

export const sendSupply = async (
  web3: $TSFixMe,

  from: $TSFixMe,

  amount: $TSFixMe,

  callback: $TSFixMe,
) => {
  try {
    // TODO: use contracts client
    const contract = new web3.eth.Contract(vbnbAbi, vBnbAddress);
    const contractData = contract.methods.mint().encodeABI();

    const tx = {
      from,
      to: vBnbAddress,
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
    const contract = new web3.eth.Contract(vbnbAbi, vBnbAddress);
    const contractData = contract.methods.repayBorrow().encodeABI();

    const tx = {
      from,
      to: getVBepToken('bnb'),
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
