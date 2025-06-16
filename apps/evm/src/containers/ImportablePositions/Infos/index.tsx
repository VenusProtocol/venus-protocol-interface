import { useTranslation } from 'libs/translations';
import { InfoSection } from './InfoSection';

export const Infos: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <InfoSection
        title={t('importPositionsModal.infoSection.1.title')}
        description={t('importPositionsModal.infoSection.1.description')}
        iconName="graph"
        iconColorClass="text-blue"
        iconContainerColorClass="bg-blue/10"
      />

      <InfoSection
        title={t('importPositionsModal.infoSection.2.title')}
        description={t('importPositionsModal.infoSection.2.description')}
        iconName="lightning2"
        iconColorClass="text-yellow"
        iconContainerColorClass="bg-yellow/10"
      />

      <InfoSection
        title={t('importPositionsModal.infoSection.3.title')}
        description={t('importPositionsModal.infoSection.3.description')}
        iconName="shield2"
        iconColorClass="text-green"
        iconContainerColorClass="bg-green/10"
      />
    </div>
  );
};
