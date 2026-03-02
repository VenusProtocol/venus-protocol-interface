import { VError, logError } from 'libs/errors';
import type { YieldPlusPosition } from 'types';
import { areAddressesEqual, restService } from 'utilities';
import { getPools } from '../useGetPools/getPools';
import type {
  GetApiYieldPlusPositionsOutput,
  GetYieldPlusPositionsInput,
  GetYieldPlusPositionsOutput,
} from './types';

export * from './types';

// TODO: add tests

export const getYieldPlusPositions = async ({
  publicClient,
  accountAddress,
  chainId,
  legacyPoolComptrollerContractAddress,
  venusLensContractAddress,
  tokens,
}: GetYieldPlusPositionsInput): Promise<GetYieldPlusPositionsOutput> => {
  const response = await restService<GetApiYieldPlusPositionsOutput>({
    endpoint: `/account/${accountAddress}/yield-plus/positions?chainId=${chainId}`,
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

      const yieldPlusPosition: YieldPlusPosition = {
        chainId,
        positionAccountAddress: apiYieldPlusPosition.positionAccountAddress,
        dsaVTokenAddress: apiYieldPlusPosition.dsaVTokenAddress,
        longVTokenAddress: apiYieldPlusPosition.longVTokenAddress,
        shortVLongTokenAddress: apiYieldPlusPosition.shortVTokenAddress,
        leverageFactor: Number(apiYieldPlusPosition.effectiveLeverageRatio ?? 0),
        unrealizedPnlCents: apiYieldPlusPosition.pnl
          ? Number(apiYieldPlusPosition.pnl.unrealizedPnlUsd) / 100
          : 0,
        unrealizedPnlPercentage: apiYieldPlusPosition?.pnl
          ? Number(apiYieldPlusPosition.pnl.pnlPercentage)
          : 0,
        pool,
      };

      return [...acc, yieldPlusPosition];
    },
    [],
  );

  return {
    positions,
  };
};
