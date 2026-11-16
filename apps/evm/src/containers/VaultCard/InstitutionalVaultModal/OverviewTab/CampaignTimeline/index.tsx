import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';
import { useTimeline } from '../../useTimeline';

export const CampaignTimeline: React.FC<{ vault: InstitutionalVault }> = ({ vault }) => {
  const { t } = useTranslation();

  const { checkpoints } = useTimeline({
    vault,
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-p2s text-primary">{t('vault.modals.overview.campaignTimeline')}</p>

      {checkpoints.map(checkpoint => (
        <div key={checkpoint.title}>
          <p className="text-b1s text-primary mb-1">{checkpoint.title}</p>

          {!!checkpoint.timeRange && (
            <p className="text-b1r text-secondary">{checkpoint.timeRange}</p>
          )}

          {!!checkpoint.description && (
            <p className="text-b1r text-secondary">{checkpoint.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};
