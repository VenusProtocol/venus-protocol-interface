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
      <p className="text-p2s text-white">{t('vault.modals.overview.campaignTimeline')}</p>

      {checkpoints.map(checkpoint => (
        <div key={checkpoint.title}>
          <p className="text-b1s text-white mb-1">{checkpoint.title}</p>

          <p className="text-b1r text-grey">{checkpoint.description}</p>
        </div>
      ))}
    </div>
  );
};
