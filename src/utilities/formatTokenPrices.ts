import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { convertPriceMantissaToDollars, getTokenByAddress } from 'utilities';

import { logError } from 'context/ErrorLogger';

const formatTokenPrices = (resilientOracleResult: ContractCallReturnContext) =>
  resilientOracleResult.callsReturnContext.reduce<{
    [tokenAddress: string]: BigNumber;
  }>((acc, callResult) => {
    const tokenAddress = (callResult.methodParameters[0] as string).toLowerCase();
    const token = getTokenByAddress(tokenAddress);

    if (!token) {
      logError(`Record missing for token: ${tokenAddress}`);
      return acc;
    }

    const priceRecord = callResult.returnValues[0];

    if (!priceRecord) {
      logError(`Price could not be fetched for token: ${token.symbol} ${tokenAddress}`);
      return acc;
    }

    const tokenPriceDollars = convertPriceMantissaToDollars({
      priceMantissa: new BigNumber(priceRecord.hex),
      token,
    });

    return {
      ...acc,
      [tokenAddress]: tokenPriceDollars,
    };
  }, {});

export default formatTokenPrices;
