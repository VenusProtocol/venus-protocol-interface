import { useTranslation } from 'libs/translations';

export interface RankSummaryProps {
  rankLabel: string;
  primeScoreLabel: string;
}

export const RankSummary: React.FC<RankSummaryProps> = ({ rankLabel, primeScoreLabel }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-b1r text-secondary">{t('primeLeaderboard.rankCard.rankLabel')}</span>
        <span className="text-h5 text-primary">{rankLabel}</span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-b1r text-secondary">
          {t('primeLeaderboard.rankCard.primeScoreLabel')}
        </span>
        <span className="text-h5 text-primary">{primeScoreLabel}</span>
      </div>
    </div>
  );
};
