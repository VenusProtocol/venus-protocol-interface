import { cn } from '@venusprotocol/ui';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useTranslation } from 'libs/translations';
import './interfaceModeLabel.css';

export interface InterfaceModeLabelProps {
  className?: string;
}

export const InterfaceModeLabel: React.FC<InterfaceModeLabelProps> = ({ className }) => {
  const { t } = useTranslation();
  const { isLite } = useInterfaceMode();

  return (
    <span className={cn('venus-mode-label text-sm', className)}>
      {isLite ? t('layout.interfaceMode.lite') : t('layout.interfaceMode.pro')}
    </span>
  );
};
