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
  const location = useLocation();

  const targetMode = isLite ? 'pro' : 'lite';
  const label = isLite ? t('layout.interfaceMode.pro') : t('layout.interfaceMode.lite');

  const handleClick = () => {
    const chainId = new URLSearchParams(location.search).get('chainId');

    onSwitch?.();

    if (isLite) {
      navigate(location, { replace: true, state: { ...location.state, liteEntry: true } });
    }

    setMode(targetMode);
    navigate({
      pathname: targetMode === 'pro' ? proHomePath : '/',
      search: chainId ? `?chainId=${chainId}` : '',
    });
  };

  return (
    <button
      type="button"
      aria-label={t('layout.interfaceMode.switchTo', { mode: label })}
      onClick={handleClick}
      className={cn(
        'venus-mode-switch relative flex h-full shrink-0 cursor-pointer items-center justify-center rounded-lg border border-default bg-input px-2.5 text-sm text-primary focus-visible:outline-2 focus-visible:outline-brand sm:px-4',
        className,
      )}
    >
      {label}

      <span aria-hidden="true" className="venus-mode-switch__border" />
    </button>
  );
};
