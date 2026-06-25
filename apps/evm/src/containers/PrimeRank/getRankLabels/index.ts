import BigNumber from 'bignumber.js';

import { shortenValueWithSuffix } from 'utilities';

import type { PrimeRankData } from '../useGetPrimeRank';

export interface RankLabels {
  rankLabel: string;
  primeScoreLabel: string;
}

export const getRankLabels = ({
  hasStakedXvs,
  rank,
  primeScore,
}: Pick<PrimeRankData, 'hasStakedXvs' | 'rank' | 'primeScore'>): RankLabels => ({
  rankLabel: hasStakedXvs ? `#${rank}` : '#-',
  primeScoreLabel: hasStakedXvs
    ? shortenValueWithSuffix({ value: new BigNumber(primeScore) })
    : '-',
});
