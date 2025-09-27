import { cn } from '@venusprotocol/ui';
import { NoticeError, Toggle, type ToggleProps } from 'components';
import { useTranslation } from 'libs/translations';

export type RiskAcknowledgementToggleProps = ToggleProps;

export const RiskAcknowledgementToggle: React.FC<RiskAcknowledgementToggleProps> = ({
  className,
  ...toggleProps
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn('space-y-3', className)}>
      <NoticeError description={t('operationForm.riskyOperation.warning')} />

      <div className="flex gap-x-3">
        <Toggle {...toggleProps} />

        <p>{t('operationForm.riskyOperation.toggleLabel')}</p>
      </div>
    </div>
  );
};
