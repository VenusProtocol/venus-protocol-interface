import BigNumber from 'bignumber.js';

import { LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import type { XVSProxyOFTDest, XVSProxyOFTSrc } from 'libs/contracts';
import type { ChainId } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export interface GetXvsBridgeStatusInput {
  fromChainId: ChainId;
  toChainId: ChainId;
  tokenBridgeSendingContract: XVSProxyOFTDest | XVSProxyOFTSrc;
  receivingEndBridgeContract: XVSProxyOFTDest | XVSProxyOFTSrc;
}

export interface GetXvsBridgeStatusOutput {
  dailyLimitResetTimestamp: BigNumber;
  maxDailyLimitUsd: BigNumber;
  totalTransferredLast24HourUsd: BigNumber;
  maxSingleTransactionLimitUsd: BigNumber;
}

// the XVS price might vary during the time it takes to complete a bridge operation,
// so this is used as a safe margin (90% of the actual limit)
export const BRIDGE_USD_LIMIT_FACTOR = new BigNumber('0.9');

export const getXvsBridgeStatus = async ({
  fromChainId,
  toChainId,
  tokenBridgeSendingContract,
  receivingEndBridgeContract,
}: GetXvsBridgeStatusInput): Promise<GetXvsBridgeStatusOutput> => {
  const layerZeroFromChainId = LAYER_ZERO_CHAIN_IDS[fromChainId];
  const layerZeroToChainId = LAYER_ZERO_CHAIN_IDS[toChainId];

  const [
    dailyResetTimestamp,
    maxDailySendLimitUsdMantissa,
    maxDailyReceiveLimitUsdMantissa,
    totalTransferredLast24HourUsdMantissa,
    maxSingleSendTransactionLimitUsdMantissa,
    maxSingleReceiveTransactionLimitUsdMantissa,
  ] = await Promise.all([
    tokenBridgeSendingContract.chainIdToLast24HourWindowStart(layerZeroToChainId),
    tokenBridgeSendingContract.chainIdToMaxDailyLimit(layerZeroToChainId),
    receivingEndBridgeContract.chainIdToMaxDailyReceiveLimit(layerZeroFromChainId),
    tokenBridgeSendingContract.chainIdToLast24HourTransferred(layerZeroToChainId),
    tokenBridgeSendingContract.chainIdToMaxSingleTransactionLimit(layerZeroToChainId),
    receivingEndBridgeContract.chainIdToMaxSingleReceiveTransactionLimit(layerZeroFromChainId),
  ]);

  const maxDailyLimitUsdMantissa = BigNumber.min(
    maxDailySendLimitUsdMantissa.toString(),
    maxDailyReceiveLimitUsdMantissa.toString(),
  );

  const maxSingleTransactionLimitUsdMantissa = BigNumber.min(
    maxSingleSendTransactionLimitUsdMantissa.toString(),
    maxSingleReceiveTransactionLimitUsdMantissa.toString(),
  );

  const dailyLimitResetTimestamp = new BigNumber(dailyResetTimestamp.toString());
  const maxDailyLimitUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(maxDailyLimitUsdMantissa.toString()),
    decimals: 18,
  }).multipliedBy(BRIDGE_USD_LIMIT_FACTOR);
  const totalTransferredLast24HourUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(totalTransferredLast24HourUsdMantissa.toString()),
    decimals: 18,
  });
  const maxSingleTransactionLimitUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(maxSingleTransactionLimitUsdMantissa.toString()),
    decimals: 18,
  }).multipliedBy(BRIDGE_USD_LIMIT_FACTOR);

  return {
    dailyLimitResetTimestamp,
    maxDailyLimitUsd,
    totalTransferredLast24HourUsd,
    maxSingleTransactionLimitUsd,
  };
};
