import { getVBepToken } from 'utilities';

import { getVTokenContract } from 'clients/contracts';

const vBnbAddress = getVBepToken('bnb').address;

// @TODO: remove once new Mint/Repay VAI component is implemented

export const sendSupply = async (
  web3: $TSFixMe,
  from: $TSFixMe,
  amount: $TSFixMe,
  callback: $TSFixMe,
) => {
  try {
    const contract = getVTokenContract('bnb', web3);
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
    const contract = getVTokenContract('bnb', web3);
    const contractData = contract.methods.repayBorrow().encodeABI();

    const tx = {
      from,
      to: getVBepToken('bnb').address,
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
