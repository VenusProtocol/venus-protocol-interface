import type { YieldPlusPosition } from 'types';

import { vBusdCorePool, vUsdtCorePool, vXvs } from './vTokens';

export const yieldPlusPosition: YieldPlusPosition = {
  chainId: vXvs.chainId,
  positionAccountAddress: '0x56dA56A2943A8A80A11A238b1fA2f370A53b3aC5',
  dsaVTokenAddress: vBusdCorePool.address,
  longVTokenAddress: vXvs.address,
  shortVLongTokenAddress: vUsdtCorePool.address,
  leverageFactor: 2,
  unrealizedPnlCents: 14320.45,
  unrealizedPnlPercentage: 11.72,
};

export const yieldPlusPositions: YieldPlusPosition[] = [yieldPlusPosition];
