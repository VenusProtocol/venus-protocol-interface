import * as constants from 'utilities/constants';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/vbnb.json'. Con... Remove this comment to see the full error message
import vbnbAbi from '../config/abis/vbnb.json';

export const sendSupply = async (
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  web3: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  from: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  amount: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  callback: $TSFixMe
) => {
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

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
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
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  web3: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  from: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  amount: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  callback: $TSFixMe
) => {
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
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
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
