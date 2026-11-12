import { cn } from '@venusprotocol/ui';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useSwitchInterfaceMode } from 'hooks/useSwitchInterfaceMode';
import { useTranslation } from 'libs/translations';
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
  const { isLite } = useInterfaceMode();
  const switchInterfaceMode = useSwitchInterfaceMode();

  const targetMode = isLite ? 'pro' : 'lite';
  const label = isLite ? t('layout.interfaceMode.pro') : t('layout.interfaceMode.lite');

  const handleClick = () => {
    onSwitch?.();
    switchInterfaceMode(targetMode);
  };

  return (
    <button
      type="button"
      aria-label={t('layout.interfaceMode.switchTo', { mode: label })}
      onClick={handleClick}
      data-interface-mode-switch=""
      className={cn(
        'venus-mode-switch relative flex h-full shrink-0 cursor-pointer items-center justify-center rounded-lg border border-mode-switch bg-mode-switch shadow-mode-switch backdrop-blur-raised backdrop-saturate-[1.3] w-10.25 px-0 text-sm text-primary focus-visible:outline-2 focus-visible:outline-brand sm:w-13.75',
        className,
      )}
    >
      {label}

      <span aria-hidden="true" className="venus-mode-switch__border" />
    </button>
  );
};
