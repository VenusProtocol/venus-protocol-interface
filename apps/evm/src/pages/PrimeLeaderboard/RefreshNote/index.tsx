import { useGetPrimeLeaderboard } from 'clients/api';
import { useTranslation } from 'libs/translations';

export const RefreshNote: React.FC = () => {
  const { t } = useTranslation();
  const { data: leaderboard } = useGetPrimeLeaderboard();
  const lastRefreshedAt = leaderboard?.computedAt;

  if (!lastRefreshedAt) {
    return null;
  }

  return (
    <p className="text-center text-b1r text-light-grey sm:text-right">
      {t('primeLeaderboard.tablesRefreshNote', { date: lastRefreshedAt })}
    </p>
  );
};
