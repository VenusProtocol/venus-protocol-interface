import type { LiquidityHub, Pool } from 'types';
import areTokensEqual from 'utilities/areTokensEqual';

export const findLiquidityHubCoreAsset = ({
  pool,
  liquidityHub,
}: {
  pool: Pool;
  liquidityHub: LiquidityHub;
}) => pool.assets.find(asset => areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken));
