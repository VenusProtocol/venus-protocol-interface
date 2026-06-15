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
        <span className="text-b1r text-light-grey">{t('primeLeaderboard.rankCard.rankLabel')}</span>
        <span className="text-h5 text-white">{rankLabel}</span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-b1r text-light-grey">
          {t('primeLeaderboard.rankCard.primeScoreLabel')}
        </span>
        <span className="text-h5 text-white">{primeScoreLabel}</span>
      </div>
    </div>
  );
};
