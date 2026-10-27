import BigNumber from 'bignumber.js';
import type { LiteEarnAsset } from '../../types';

export const sumCents = ({
  earnAssets,
  field,
}: {
  earnAssets: LiteEarnAsset[];
  field: 'supplyCents' | 'liquidityCents';
}) => earnAssets.reduce((total, earnAsset) => total.plus(earnAsset[field]), new BigNumber(0));
