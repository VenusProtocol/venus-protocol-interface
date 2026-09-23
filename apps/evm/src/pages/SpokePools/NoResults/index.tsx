import { Button, Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface NoResultsProps {
  onReset: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({ onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="bg-cards flex size-10 items-center justify-center rounded-lg">
        <Icon name="market" className="text-grey size-6" />
      </div>

      <p className="text-p3s">{t('spokePools.filter.noResults')}</p>

      <Button size="sm" onClick={onReset}>
        {t('spokePools.filter.resetFilters')}
      </Button>
    </div>
  );
};
