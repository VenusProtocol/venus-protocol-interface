import BigNumber from 'bignumber.js';
import { TokenId } from 'types';
import { getToken } from './getToken';
import { formatCoinsToReadableValue } from './formatCoinsToReadableValue';

export interface IConvertWeiToCoinsInput<T extends boolean | undefined = false> {
  valueWei: BigNumber;
  tokenId: TokenId;
  returnInReadableFormat?: T;
  minimizeDecimals?: boolean;
  addSymbol?: boolean;
  shortenLargeValue?: boolean;
}

export type ConvertWeiToCoinsOutput<T> = T extends true ? string : BigNumber;

export function convertWeiToCoins<T extends boolean | undefined = false>({
  valueWei,
  tokenId,
  returnInReadableFormat = false,
  minimizeDecimals = false,
  addSymbol = true,
  shortenLargeValue = false,
}: IConvertWeiToCoinsInput<T>): ConvertWeiToCoinsOutput<T> {
  const tokenDecimals = getToken(tokenId).decimals;
  const valueCoins = valueWei
    .dividedBy(new BigNumber(10).pow(tokenDecimals))
    .decimalPlaces(tokenDecimals);

  return (
    returnInReadableFormat
      ? formatCoinsToReadableValue({
          value: valueCoins,
          tokenId,
          minimizeDecimals,
          addSymbol,
          shortenLargeValue,
        })
      : valueCoins
  ) as ConvertWeiToCoinsOutput<T>;
}

export default convertWeiToCoins;
