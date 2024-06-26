import type BigNumber from 'bignumber.js';

import type { ResilientOracle } from 'libs/contracts';
import type { Token } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export interface GetTokenUsdPriceInput {
  token: Token;
  resilientOracleContract: ResilientOracle;
}

export interface GetTokenUsdPriceOutput {
  tokenPriceUsd: BigNumber;
}

const getTokenUsdPrice = async ({
  token,
  resilientOracleContract,
}: GetTokenUsdPriceInput): Promise<GetTokenUsdPriceOutput> => {
  const priceMantissa = (await resilientOracleContract.getPrice(token.address)).toString();
  const tokenPriceUsd = convertPriceMantissaToDollars({ priceMantissa, decimals: token.decimals });
  return { tokenPriceUsd };
};

export default getTokenUsdPrice;
