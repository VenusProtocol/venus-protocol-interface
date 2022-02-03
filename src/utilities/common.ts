import * as constants from 'utilities/constants';
import BigNumber from 'bignumber.js';
import { getVaiTokenAddress } from './addressHelpers';

const ethers = require('ethers');
const commaNumber = require('comma-number');

const format = commaNumber.bindWith(',', '.');

export const encodeParameters = (types, values) => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export const getArgs = func => {
  // First match everything inside the function argument parens.
  const args = func.toString().match(/.*?\(([^)]*)\)/)
    ? func.toString().match(/.*?\(([^)]*)\)/)[1]
    : '';
  // Split the arguments string into an array comma delimited.
  return args
    .split(',')
    .map(arg => {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter(arg => {
      // Ensure no undefined values are added.
      return arg;
    });
};

export const addToken = async (asset = 'vai', decimal, type) => {
  let tokenAddress = '';
  let tokenSymbol = '';
  let tokenDecimals = 18;
  let tokenImage = '';
  if (asset === 'vai') {
    tokenAddress = getVaiTokenAddress();
    tokenSymbol = 'VAI';
    tokenDecimals = 18;
    tokenImage = `${window.location.origin}/coins/vai.svg`;
  } else {
    tokenAddress =
      type === 'token'
        ? constants.CONTRACT_TOKEN_ADDRESS[asset].address
        : constants.CONTRACT_VBEP_ADDRESS[asset].address;
    tokenSymbol =
      type === 'token'
        ? constants.CONTRACT_TOKEN_ADDRESS[asset].symbol
        : `v${(asset === 'btcb' ? 'btc' : asset).toUpperCase()}`;
    tokenDecimals = decimal || (type === 'token' ? 18 : 8);
    tokenImage = `${window.location.origin}/coins/${
      type === 'token' ? asset : `v${asset === 'btcb' ? 'btc' : asset}`
    }.png`;
  }

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage // A string url of the token logo
        }
      }
    });

    if (wasAdded) {
      // eslint-disable-next-line no-console
      console.log('Thanks for your interest!');
    } else {
      // eslint-disable-next-line no-console
      console.log('Your loss!');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getBigNumber = value => {
  if (!value) {
    return new BigNumber(0);
  }
  if (BigNumber.isBigNumber(value)) {
    return value;
  }
  return new BigNumber(value);
};

export const currencyFormatter = labelValue => {
  let suffix = '';
  let unit = 1;
  const abs = Math.abs(Number(labelValue));
  if (abs >= 1.0e9) {
    // Nine Zeroes for Billions
    suffix = 'B';
    unit = 1.0e9;
  } else if (abs >= 1.0e6) {
    // Six Zeroes for Millions
    suffix = 'M';
    unit = 1.0e6;
  } else if (abs >= 1.0e3) {
    // Three Zeroes for Thousands
    suffix = 'K';
    unit = 1.0e3;
  }
  return `$${format(new BigNumber(`${abs / unit}`).dp(2, 1))}${suffix}`;
};

export const formatApy = apy => {
  let apyBN = getBigNumber(apy);
  if (apyBN.absoluteValue().isLessThan(100000000)) {
    return `${apyBN.dp(2, 1).toString(10)}%`;
  } else {
    return 'Infinity';
  }
};

/**
 * Takes an index function and an array and returns an object with indexFn(item)
 * as keys and array items as values.
 *
 * @param {object => string} indexFn
 * @param {array} arr
 * @returns An object with the keys derived as indexFn(array item)
 */
export const indexBy = (indexFn, arr) => {
  return arr.reduce((result, item) => {
    result[indexFn(item)] = item;
    return result;
  }, {});
};
