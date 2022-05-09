import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import commaNumber from 'comma-number';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { getToken, getVBepToken } from 'utilities';
import { TokenId, VTokenId } from 'types';

export const commaFormat = commaNumber.bindWith(',', '.');

export const encodeParameters = (types: $TSFixMe, values: $TSFixMe) => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export const getArgs = (func: $TSFixMe) => {
  // First match everything inside the function argument parens.
  const args = func.toString().match(/.*?\(([^)]*)\)/)
    ? func.toString().match(/.*?\(([^)]*)\)/)[1]
    : '';
  // Split the arguments string into an array comma delimited.
  return args
    .split(',')

    .map((arg: $TSFixMe) =>
      // Ensure no inline comments are parsed and trim the whitespace.
      arg.replace(/\/\*.*\*\//, '').trim(),
    )

    .filter(
      (arg: $TSFixMe) =>
        // Ensure no undefined values are added.
        arg,
    );
};

export const addToken = async ({
  asset = 'vai',
  decimal,
  type,
}: {
  asset: TokenId;
  decimal: number;
  type: string;
}) => {
  let tokenAddress: string | undefined = '';
  let tokenSymbol = '';
  let tokenDecimals = 18;
  let tokenImage = '';
  if (asset === 'vai') {
    tokenAddress = getToken('vai').address;
    tokenSymbol = 'VAI';
    tokenDecimals = 18;
    tokenImage = `${window.location.origin}/coins/vai.svg`;
  } else {
    tokenAddress =
      type === 'token' ? getToken(asset).address : getVBepToken(asset as VTokenId).address;
    tokenSymbol =
      type === 'token'
        ? getToken(asset).symbol
        : `v${(asset === 'btcb' ? 'btc' : asset).toUpperCase()}`;
    tokenDecimals = decimal || (type === 'token' ? 18 : 8);
    tokenImage = `${window.location.origin}/coins/${
      type === 'token' ? asset : `v${asset === 'btcb' ? 'btc' : asset}`
    }.png`;
  }

  try {
    await window.ethereum?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });
  } catch (error) {
    // TODO: send error to Sentry

    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const getBigNumber = (value?: BigNumber | string | number): BigNumber => {
  if (!value) {
    return new BigNumber(0);
  }
  if (BigNumber.isBigNumber(value)) {
    return value;
  }
  return new BigNumber(value);
};

export const currencyFormatter = (labelValue: $TSFixMe) => {
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
  return `$${commaFormat(new BigNumber(`${abs / unit}`).dp(2, 1).toNumber())}${suffix}`;
};

export const formatCommaThousandsPeriodDecimal = commaNumber.bindWith(',', '.');
export const format = (bigNumber: BigNumber, dp = 2) =>
  formatCommaThousandsPeriodDecimal(bigNumber.dp(dp, 1).toString(10));

export const formatCoinsToReadableValue = ({
  value,
  tokenId,
  shorthand = false,
}: {
  value: BigNumber | undefined;
  tokenId: TokenId;
  shorthand?: boolean;
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  let decimalPlaces;
  if (shorthand) {
    // If value is greater than 1, use 2 decimal places, otherwise use 8
    // see (https://app.clickup.com/24381231/v/dc/q81tf-9288/q81tf-1128)
    decimalPlaces = value.gt(1) ? 2 : 8;
  } else {
    const token = getToken(tokenId);
    decimalPlaces = token.decimals;
  }

  return `${formatCommaThousandsPeriodDecimal(
    value.dp(decimalPlaces).toFixed(),
  )} ${tokenId.toUpperCase()}`;
};

type ConvertWeiToCoinsOutput<T> = T extends true ? string : BigNumber;

export function convertWeiToCoins<T extends boolean | undefined = false>({
  value,
  tokenId,
  returnInReadableFormat = false,
}: {
  value: BigNumber;
  tokenId: TokenId;
  returnInReadableFormat?: T;
}): ConvertWeiToCoinsOutput<T> {
  const tokenDecimals = getToken(tokenId).decimals;
  const valueCoins = value
    .dividedBy(new BigNumber(10).pow(tokenDecimals))
    .decimalPlaces(tokenDecimals);

  return (
    returnInReadableFormat ? formatCoinsToReadableValue({ value: valueCoins, tokenId }) : valueCoins
  ) as ConvertWeiToCoinsOutput<T>;
}

export const convertCoinsToWei = ({ value, tokenId }: { value: BigNumber; tokenId: TokenId }) => {
  const tokenDecimals = getToken(tokenId).decimals;
  return value.multipliedBy(new BigNumber(10).pow(tokenDecimals));
};

export const convertCentsToDollars = (value: number) =>
  new BigNumber(value).dividedBy(100).toFixed(2);

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

export const formatCentsToReadableValue = ({
  value,
  shorthand = false,
}: {
  value: number | BigNumber | undefined;
  shorthand?: boolean;
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  if (!shorthand) {
    return `$${formatCommaThousandsPeriodDecimal(
      convertCentsToDollars(typeof value === 'number' ? value : value.toNumber()),
    )}`;
  }

  // Shorten value
  const wrappedValueDollars = new BigNumber(value).dividedBy(100);
  let shortenedValue = wrappedValueDollars.toFixed(2);
  if (wrappedValueDollars.isGreaterThan(ONE_BILLION)) {
    shortenedValue = `${wrappedValueDollars.dividedBy(ONE_BILLION).dp(2).toFixed()}B`;
  } else if (wrappedValueDollars.isGreaterThan(ONE_MILLION)) {
    shortenedValue = `${wrappedValueDollars.dividedBy(ONE_MILLION).dp(2).toFixed()}M`;
  } else if (wrappedValueDollars.isGreaterThan(ONE_THOUSAND)) {
    shortenedValue = `${wrappedValueDollars.dividedBy(ONE_THOUSAND).dp(2).toFixed()}K`;
  }

  return `$${shortenedValue}`;
};

export const formatToReadablePercentage = (value: number | string | BigNumber | undefined) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  const valueBn = new BigNumber(value);

  if (valueBn.absoluteValue().isGreaterThanOrEqualTo(100000000)) {
    return `${valueBn.toExponential(2)}%`;
  }

  return `${valueBn.dp(2).toFixed()}%`;
};

/**
 * Takes an index function and an array and returns an object with indexFn(item)
 * as keys and array items as values.
 *
 * @param {object => string} indexFn
 * @param {array} arr
 * @returns An object with the keys derived as indexFn(array item)
 */

export const indexBy = <V>(indexFn: (v: V) => string, arr: V[]) =>
  arr.reduce((result: Record<string, V>, item: V) => {
    result[indexFn(item)] = item;
    return result;
  }, {});

export const notNull = <TValue>(value: TValue | null): value is TValue => value !== null;

export const notUndefined = <TValue>(value: TValue | undefined): value is TValue =>
  value !== undefined;
