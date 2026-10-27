import { cn } from '@venusprotocol/ui';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useProHomePath } from 'hooks/useProHomePath';
import { useTranslation } from 'libs/translations';
import { useLocation, useNavigate } from 'react-router';
import './interfaceModeSwitch.css';

export interface InterfaceModeSwitchProps {
  onSwitch?: () => void;
  className?: string;
}

export const InterfaceModeSwitch: React.FC<InterfaceModeSwitchProps> = ({
  onSwitch,
  className,
}) => {
  const { t } = useTranslation();
  const { isLite, setMode } = useInterfaceMode();
  const proHomePath = useProHomePath();
  const navigate = useNavigate();
  const { search } = useLocation();

  const targetMode = isLite ? 'pro' : 'lite';
  const label = isLite ? t('layout.interfaceMode.pro') : t('layout.interfaceMode.lite');

  const handleClick = () => {
    onSwitch?.();
    setMode(targetMode);
    navigate({ pathname: targetMode === 'pro' ? proHomePath : '/', search });
  };

  return (
    <button
      type="button"
      aria-label={t('layout.interfaceMode.switchTo', { mode: label })}
      onClick={handleClick}
      className={cn(
        'venus-mode-switch relative flex h-full shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dark-blue-hover bg-background-active px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-blue sm:px-4',
        className,
      )}
    >
      {label}

      <span aria-hidden="true" className="venus-mode-switch__border" />
    </button>
  );
};
