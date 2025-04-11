import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { xVSProxyOFTSrcAbi } from 'libs/contracts';
import type { ChainId } from 'types';
import { convertPriceMantissaToDollars } from 'utilities';

export interface GetXvsBridgeStatusInput {
  fromChainId: ChainId;
  toChainId: ChainId;
  fromChainBridgeContractAddress: Address;
  toChainBridgeContractAddress: Address;
  fromChainPublicClient: PublicClient;
  toChainPublicClient: PublicClient;
}

export interface GetXvsBridgeStatusOutput {
  dailyLimitResetTimestamp: BigNumber;
  maxDailyLimitUsd: BigNumber;
  totalTransferredLast24HourUsd: BigNumber;
  maxSingleTransactionLimitUsd: BigNumber;
}

// The XVS price might vary during the time it takes to complete a bridge operation, so this is used
// as a safe margin (90% of the actual limit)
export const BRIDGE_USD_LIMIT_FACTOR = new BigNumber('0.9');

// We should normally pass either the SRC or the DEST contract ABI based on the direction of the
// transfer, but since both use the same definitions for the functions used in this query it does
// not matter
const abi = xVSProxyOFTSrcAbi;

export const getXvsBridgeStatus = async ({
  fromChainId,
  toChainId,
  fromChainBridgeContractAddress,
  toChainBridgeContractAddress,
  fromChainPublicClient,
  toChainPublicClient,
}: GetXvsBridgeStatusInput): Promise<GetXvsBridgeStatusOutput> => {
  const layerZeroFromChainId = LAYER_ZERO_CHAIN_IDS[fromChainId];
  const layerZeroToChainId = LAYER_ZERO_CHAIN_IDS[toChainId];

  const [
    dailyResetTimestamp,
    maxDailySendLimit,
    totalTransferred,
    maxSingleSendTransactionLimit,
    maxDailyReceiveLimit,
    maxSingleReceiveTransactionLimit,
  ] = await Promise.all([
    fromChainPublicClient.readContract({
      address: fromChainBridgeContractAddress,
      abi,
      functionName: 'chainIdToLast24HourWindowStart',
      args: [layerZeroToChainId],
    }),
    fromChainPublicClient.readContract({
      address: fromChainBridgeContractAddress,
      abi,
      functionName: 'chainIdToMaxDailyLimit',
      args: [layerZeroToChainId],
    }),
    fromChainPublicClient.readContract({
      address: fromChainBridgeContractAddress,
      abi,
      functionName: 'chainIdToLast24HourTransferred',
      args: [layerZeroToChainId],
    }),
    fromChainPublicClient.readContract({
      address: fromChainBridgeContractAddress,
      abi,
      functionName: 'chainIdToMaxSingleTransactionLimit',
      args: [layerZeroToChainId],
    }),
    toChainPublicClient.readContract({
      address: toChainBridgeContractAddress,
      abi,
      functionName: 'chainIdToMaxDailyReceiveLimit',
      args: [layerZeroFromChainId],
    }),
    toChainPublicClient.readContract({
      address: toChainBridgeContractAddress,
      abi,
      functionName: 'chainIdToMaxSingleReceiveTransactionLimit',
      args: [layerZeroFromChainId],
    }),
  ]);

  const maxDailyLimitUsdMantissa = BigNumber.min(
    maxDailySendLimit.toString(),
    maxDailyReceiveLimit.toString(),
  );

  const maxSingleTransactionLimitUsdMantissa = BigNumber.min(
    maxSingleSendTransactionLimit.toString(),
    maxSingleReceiveTransactionLimit.toString(),
  );

  const dailyLimitResetTimestamp = new BigNumber(dailyResetTimestamp.toString());

  const maxDailyLimitUsd = convertPriceMantissaToDollars({
    priceMantissa: maxDailyLimitUsdMantissa,
    decimals: 18,
  }).multipliedBy(BRIDGE_USD_LIMIT_FACTOR);

  const totalTransferredLast24HourUsd = convertPriceMantissaToDollars({
    priceMantissa: new BigNumber(totalTransferred.toString()),
    decimals: 18,
  });

  const maxSingleTransactionLimitUsd = convertPriceMantissaToDollars({
    priceMantissa: maxSingleTransactionLimitUsdMantissa,
    decimals: 18,
  }).multipliedBy(BRIDGE_USD_LIMIT_FACTOR);

  return {
    dailyLimitResetTimestamp,
    maxDailyLimitUsd,
    totalTransferredLast24HourUsd,
    maxSingleTransactionLimitUsd,
  };
};
