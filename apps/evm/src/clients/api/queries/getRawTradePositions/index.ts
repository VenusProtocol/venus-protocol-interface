import BigNumber from 'bignumber.js';

import { VError, logError } from 'libs/errors';
import type { TradePosition } from 'types';
import {
  areAddressesEqual,
  convertTokensToMantissa,
  formatToTradePosition,
  restService,
} from 'utilities';
import { getPools } from '../useGetPools/getPools';
import type {
  GetApiTradePositionsOutput,
  GetRawTradePositionsInput,
  GetRawTradePositionsOutput,
} from './types';

export * from './types';

export const getRawTradePositions = async ({
  publicClient,
  accountAddress,
  chainId,
  legacyPoolComptrollerContractAddress,
  venusLensContractAddress,
  tokens,
}: GetRawTradePositionsInput): Promise<GetRawTradePositionsOutput> => {
  const response = await restService<GetApiTradePositionsOutput>({
    endpoint: `/account/${accountAddress}/yield-plus/positions?chainId=${chainId}&isActive=true`,
    method: 'GET',
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  // Fetch pools corresponding to Trade positions
  const poolResults = await Promise.allSettled(
    payload.positions.map(apiPosition =>
      getPools({
        publicClient,
        chainId,
        accountAddress: apiPosition.positionAccountAddress,
        legacyPoolComptrollerContractAddress,
        venusLensContractAddress,
        tokens,
        isEModeFeatureEnabled: false,
      }),
    ),
  );

  const positions = payload.positions.reduce<TradePosition[]>((acc, apiTradePosition, index) => {
    const pools = poolResults[index]?.status === 'fulfilled' ? poolResults[index].value.pools : [];

    const pool = pools.find(p =>
      areAddressesEqual(legacyPoolComptrollerContractAddress, p.comptrollerAddress),
    );

    if (!pool) {
      logError(
        `Could not fetch pools for Trade position account with address: ${apiTradePosition.positionAccountAddress}`,
      );
      return acc;
    }

    const dsaAsset = pool.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, apiTradePosition.dsaVTokenAddress),
    );

    const userDsaAssetSupplyBalanceMantissa = dsaAsset
      ? convertTokensToMantissa({
          token: dsaAsset.vToken.underlyingToken,
          value: dsaAsset.userSupplyBalanceTokens,
        })
      : undefined;

    let dsaBalanceMantissa = new BigNumber(
      apiTradePosition.capitalUtilization.suppliedPrincipalMantissa || 0,
    );

    if (userDsaAssetSupplyBalanceMantissa) {
      dsaBalanceMantissa = BigNumber.min(userDsaAssetSupplyBalanceMantissa, dsaBalanceMantissa);
    }

    const tradePosition = formatToTradePosition({
      chainId,
      positionAccountAddress: apiTradePosition.positionAccountAddress,
      dsaVTokenAddress: apiTradePosition.dsaVTokenAddress,
      longVTokenAddress: apiTradePosition.longVTokenAddress,
      shortVTokenAddress: apiTradePosition.shortVTokenAddress,
      dsaBalanceMantissa,
      leverageFactor: Number(apiTradePosition.effectiveLeverageRatio ?? 0),
      unrealizedPnlCents: apiTradePosition.pnl
        ? Number(apiTradePosition.pnl.unrealizedPnlUsd) * 100
        : 0,
      unrealizedPnlPercentage: apiTradePosition?.pnl
        ? Number(apiTradePosition.pnl.unrealizedPnlRatio) * 100
        : 0,
      pool,
    });

    return tradePosition ? [...acc, tradePosition] : acc;
  }, []);

  return {
    positions,
  };
};
