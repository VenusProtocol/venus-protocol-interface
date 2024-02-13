import BigNumber from 'bignumber.js';
import { XVSProxyOFTDest, XVSProxyOFTSrc } from 'libs/contracts';

import { LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
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

// the XVS price might vary during the time it takes to complete a bridge operation,
// so this is used as a safe margin (90% of the actual limit)
const BRIDGE_USD_LIMIT_FACTOR = new BigNumber('0.9');

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

export default getXvsBridgeStatus;
