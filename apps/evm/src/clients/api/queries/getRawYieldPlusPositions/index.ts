import BigNumber from 'bignumber.js';

import { VError, logError } from 'libs/errors';
import type { YieldPlusPosition } from 'types';
import { areAddressesEqual, formatToYieldPlusPosition, restService } from 'utilities';
import { getPools } from '../useGetPools/getPools';
import type {
  GetApiYieldPlusPositionsOutput,
  GetRawYieldPlusPositionsInput,
  GetRawYieldPlusPositionsOutput,
} from './types';

export * from './types';

export const getRawYieldPlusPositions = async ({
  publicClient,
  accountAddress,
  chainId,
  legacyPoolComptrollerContractAddress,
  venusLensContractAddress,
  tokens,
}: GetRawYieldPlusPositionsInput): Promise<GetRawYieldPlusPositionsOutput> => {
  const response = await restService<GetApiYieldPlusPositionsOutput>({
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

  // Fetch pools corresponding to Yield+ positions
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

  const positions = payload.positions.reduce<YieldPlusPosition[]>(
    (acc, apiYieldPlusPosition, index) => {
      const pools =
        poolResults[index]?.status === 'fulfilled' ? poolResults[index].value.pools : [];

      const pool = pools.find(p =>
        areAddressesEqual(legacyPoolComptrollerContractAddress, p.comptrollerAddress),
      );

      if (!pool) {
        logError(
          `Could not fetch pools for Yield+ position account with address: ${apiYieldPlusPosition.positionAccountAddress}`,
        );
        return acc;
      }

      const yieldPlusPosition = formatToYieldPlusPosition({
        chainId,
        positionAccountAddress: apiYieldPlusPosition.positionAccountAddress,
        dsaVTokenAddress: apiYieldPlusPosition.dsaVTokenAddress,
        longVTokenAddress: apiYieldPlusPosition.longVTokenAddress,
        shortVTokenAddress: apiYieldPlusPosition.shortVTokenAddress,
        dsaBalanceMantissa: new BigNumber(
          apiYieldPlusPosition.capitalUtilization.suppliedPrincipalMantissa || 0,
        ),
        leverageFactor: Number(apiYieldPlusPosition.effectiveLeverageRatio ?? 0),
        unrealizedPnlCents: apiYieldPlusPosition.pnl
          ? Number(apiYieldPlusPosition.pnl.unrealizedPnlUsd) * 100
          : 0,
        unrealizedPnlPercentage: apiYieldPlusPosition?.pnl
          ? Number(apiYieldPlusPosition.pnl.unrealizedPnlPercentage)
          : 0,
        pool,
      });

      return yieldPlusPosition ? [...acc, yieldPlusPosition] : acc;
    },
    [],
  );

  return {
    positions,
  };
};
