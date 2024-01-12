import BigNumber from 'bignumber.js';

import { LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { USD_PRICE_TOKEN } from 'constants/usdPriceToken';
import { XVSProxyOFTDest, XVSProxyOFTSrc } from 'packages/contracts';
import { ChainId } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export interface GetXvsBridgeStatusInput {
  toChainId: ChainId;
  tokenBridgeContract: XVSProxyOFTDest | XVSProxyOFTSrc;
}

export interface GetXvsBridgeStatusOutput {
  dailyLimitResetTimestamp: BigNumber;
  maxDailyLimitUsd: BigNumber;
  totalTransferredLast24HourUsd: BigNumber;
  maxSingleTransactionLimitUsd: BigNumber;
}

const getXvsBridgeStatus = async ({
  toChainId,
  tokenBridgeContract,
}: GetXvsBridgeStatusInput): Promise<GetXvsBridgeStatusOutput> => {
  const layerZeroChainId = LAYER_ZERO_CHAIN_IDS[toChainId];
  const [
    dailyResetTimestamp,
    maxDailyLimitUsdMantissa,
    totalTransferredLast24HourUsdMantissa,
    maxSingleTransactionLimitUsdMantissa,
  ] = await Promise.all([
    tokenBridgeContract.chainIdToLast24HourWindowStart(layerZeroChainId),
    tokenBridgeContract.chainIdToMaxDailyLimit(layerZeroChainId),
    tokenBridgeContract.chainIdToLast24HourTransferred(layerZeroChainId),
    tokenBridgeContract.chainIdToMaxSingleTransactionLimit(layerZeroChainId),
  ]);
  const dailyLimitResetTimestamp = new BigNumber(dailyResetTimestamp.toString());
  const maxDailyLimitUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(maxDailyLimitUsdMantissa.toString()),
    token: USD_PRICE_TOKEN,
  });
  const totalTransferredLast24HourUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(totalTransferredLast24HourUsdMantissa.toString()),
    token: USD_PRICE_TOKEN,
  });
  const maxSingleTransactionLimitUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(maxSingleTransactionLimitUsdMantissa.toString()),
    token: USD_PRICE_TOKEN,
  });

  return {
    dailyLimitResetTimestamp,
    maxDailyLimitUsd,
    totalTransferredLast24HourUsd,
    maxSingleTransactionLimitUsd,
  };
};

export default getXvsBridgeStatus;
