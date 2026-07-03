import BigNumber from 'bignumber.js';

import { useGetPrimeLeaderboard } from 'clients/api';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual, convertMantissaToTokens } from 'utilities';

import { ITEMS_PER_PAGE } from '../PrimeLeaderboardTable';
import { RANKS_PAGE_PARAM_KEY } from '../RankTable';

export const useGetPrimeRankScore = (fallbackScore: number): number => {
  const { accountAddress } = useAccountAddress();
  const xvs = useGetToken({ symbol: 'XVS' });
  const { currentPage } = useUrlPagination({ paramKey: RANKS_PAGE_PARAM_KEY });

  const { data: leaderboard } = useGetPrimeLeaderboard({
    page: currentPage + 1,
    limit: ITEMS_PER_PAGE,
  });

  const tableEntry = accountAddress
    ? leaderboard?.entries.find(entry => areAddressesEqual(entry.userAddress, accountAddress))
    : undefined;

  if (!tableEntry) {
    return fallbackScore;
  }

  return (
    convertMantissaToTokens({
      value: new BigNumber(tableEntry.effectiveStakeMantissa),
      token: xvs,
    })?.toNumber() ?? fallbackScore
  );
};
