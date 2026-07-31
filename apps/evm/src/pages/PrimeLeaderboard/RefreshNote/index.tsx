import {
  useGetPrimeEffectiveStake,
  useGetPrimeLeaderboard,
  useGetPrimeMinimumStake,
} from 'clients/api';
import { NoticeInfo } from 'components';
import { useGetPrimeRankLimit } from 'containers/PrimeRank/useGetPrimeRankLimit';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import {
  convertMantissaToTokens,
  formatTokensToReadableValue,
  shortenValueWithSuffix,
} from 'utilities';

export const RefreshNote: React.FC = () => {
  const { t, Trans } = useTranslation();
  const xvs = useGetToken({ symbol: 'XVS' });

  const { data: leaderboard } = useGetPrimeLeaderboard();
  const { data: minimumStake } = useGetPrimeMinimumStake();
  const rankLimit = useGetPrimeRankLimit();

  const { data: lastPrimeHolderStake } = useGetPrimeEffectiveStake({
    accountAddress: minimumStake?.lastPrimeHolderAddress ?? undefined,
  });

  const lastRefreshedAt = leaderboard?.computedAt;

  if (!lastRefreshedAt) {
    return null;
  }

  const rankCutoff =
    minimumStake?.reason === 'last_position' &&
    rankLimit !== undefined &&
    !!lastPrimeHolderStake &&
    !!xvs ? (
      <p className="min-w-0 text-light-grey">
        <Trans
          i18nKey="primeLeaderboard.rankCutoffNote"
          components={{
            Rank: <span className="font-semibold text-white">{`#${rankLimit}`}</span>,
            Score: (
              <span className="font-semibold text-white">
                {shortenValueWithSuffix({
                  value: convertMantissaToTokens({
                    value: lastPrimeHolderStake.effectiveStakeMantissa,
                    token: xvs,
                  }),
                  maxDecimalPlaces: 2,
                })}
              </span>
            ),
            Staked: (
              <span className="font-semibold text-white">
                {formatTokensToReadableValue({
                  value: convertMantissaToTokens({
                    value: lastPrimeHolderStake.totalStakedMantissa,
                    token: xvs,
                  }),
                  token: xvs,
                })}
              </span>
            ),
          }}
        />
      </p>
    ) : null;

  return (
    <NoticeInfo
      description={
        <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
          {rankCutoff}

          <p className="shrink-0 text-light-grey">
            {t('primeLeaderboard.tablesRefreshNote', { date: lastRefreshedAt })}
          </p>
        </div>
      }
    />
  );
};
