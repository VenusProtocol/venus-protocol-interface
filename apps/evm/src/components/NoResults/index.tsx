import { Button } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import { Icon, type IconName } from '../Icon';

export interface NoResultsProps {
  title: string;
  description?: string;
  iconName: IconName;
  onReset?: () => void;
}

export const NoResults: React.FC<NoResultsProps> = ({ title, description, iconName, onReset }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="bg-surface-4 flex size-10 items-center justify-center rounded-lg">
        <Icon name={iconName} className="text-secondary size-6" />
      </div>

      <div className="space-y-1">
        <p className="text-p3s">{title}</p>

        {!!description && <p className="text-b1r text-secondary">{description}</p>}
      </div>

      {!!onReset && (
        <Button size="sm" onClick={onReset}>
          {t('noResults.resetFilters')}
        </Button>
      )}
    </div>
  );
};
