import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';

export const CampaignTimeline: React.FC<{ vault: InstitutionalVault }> = ({ vault }) => {
  const { t, Trans } = useTranslation();

  const timelineContents = [
    {
      title: t('vault.modals.overview.institutionalTimeline.depositPeriod'),
      description: (
        <Trans
          i18nKey="vault.modals.overview.institutionalTimeline.depositPeriodDescription"
          values={{
            startDate: vault.vaultDeploymentDate,
            endDate: vault.openEndDate,
            tokenSymbol: vault.stakedToken.symbol,
          }}
          components={{ br: <br /> }}
        />
      ),
    },
    {
      title: t('vault.modals.overview.institutionalTimeline.estimatedEarningPeriod'),
      description: (
        <Trans
          i18nKey="vault.modals.overview.institutionalTimeline.estimatedEarningPeriodDescription"
          values={{
            startDate: vault.openEndDate,
            endDate: vault.maturityDate,
            tokenSymbol: vault.stakedToken.symbol,
          }}
          components={{ br: <br /> }}
        />
      ),
    },
    {
      title: t('vault.modals.overview.institutionalTimeline.estimatedRepayingPeriod'),
      description: (
        <Trans
          i18nKey="vault.modals.overview.institutionalTimeline.estimatedRepayingPeriodDescription"
          values={{
            startDate: vault.maturityDate,
            endDate: vault.settlementDate,
            tokenSymbol: vault.stakedToken.symbol,
          }}
          components={{ br: <br /> }}
        />
      ),
    },
    {
      title: t('vault.modals.overview.institutionalTimeline.claimPeriod'),
      description: (
        <Trans
          i18nKey="vault.modals.overview.institutionalTimeline.claimPeriodDescription"
          values={{
            startDate: vault.settlementDate,
            tokenSymbol: vault.stakedToken.symbol,
          }}
          components={{ br: <br /> }}
        />
      ),
    },
  ];

  if (vault.vaultDeploymentDate?.getTime() === vault.openEndDate?.getTime()) {
    timelineContents.splice(1, 0, {
      title: t('vault.modals.overview.institutionalTimeline.estimatedPendingPeriod'),
      description: (
        <Trans
          i18nKey="vault.modals.overview.institutionalTimeline.estimatedPendingPeriodDescription"
          values={{
            startDate: vault.vaultDeploymentDate,
            endDate: vault.openEndDate,
            tokenSymbol: vault.stakedToken.symbol,
          }}
          components={{ br: <br /> }}
        />
      ),
    });
  }

  return (
    <div>
      <p className="text-p2s text-white pb-4">{t('vault.modals.overview.campaignTimeline')}</p>

      <div className="flex flex-col gap-4">
        {timelineContents.map((content, index) => (
          <div key={index}>
            <p className="text-b1s text-white mb-1">{content.title}</p>
            <p className="text-b1r text-grey">{content.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
