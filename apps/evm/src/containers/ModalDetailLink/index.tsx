import { Provider, Tooltip, Trigger } from '@radix-ui/react-tooltip';
import { Icon, useActiveTabPath } from 'components';
import { TooltipContent } from 'components/Tooltip/TooltipContent';
import 'containers/Layout/NavBar/InterfaceModeLabel/interfaceModeLabel.css';
import 'containers/Layout/NavBar/InterfaceModeSwitch/interfaceModeSwitch.css';
import { Link } from 'containers/Link';
import { useBreakpointUp, useHasHoverPointer } from 'hooks/responsive';
import { type ProShortcut, useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { useEffect, useRef } from 'react';
import { type To, useLocation } from 'react-router';
import { getPathname } from './getPathname';

export interface ModalDetailLinkProps {
  getTo: (activeTabPath: string[]) => To;
  destination: string;
  analyticProps: ProShortcut;
}

export const ModalDetailLink: React.FC<ModalDetailLinkProps> = ({
  getTo,
  destination,
  analyticProps,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const activeTabPath = useActiveTabPath();
  const { captureAnalyticEvent } = useAnalytics();
  const captureAnalyticEventRef = useRef(captureAnalyticEvent);
  const analyticPropsRef = useRef(analyticProps);
  const hasHoverPointer = useHasHoverPointer();
  const isMdUp = useBreakpointUp('md');

  const to = getTo(activeTabPath);
  const isVisible = getPathname(to) !== pathname;

  useEffect(() => {
    if (isVisible) {
      captureAnalyticEventRef.current('pro_shortcut_viewed', analyticPropsRef.current);
    }
  }, [isVisible]);

  if (!isVisible) {
    return undefined;
  }

  const handleClick = () =>
    captureAnalyticEvent('pro_shortcut_click', {
      ...analyticProps,
      activeTab: activeTabPath.filter(Boolean).join('/') || undefined,
    });

  const handleAuxClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 1) {
      handleClick();
    }
  };

  const link = (
    <Link
      noStyle
      to={to}
      aria-label={t('modalDetailLink.ariaLabel', { destination })}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      className="venus-mode-switch group relative inline-flex h-6 shrink-0 items-center rounded-md border border-mode-switch bg-mode-switch pl-2 pr-0.5 text-b2s whitespace-nowrap text-primary shadow-mode-switch backdrop-blur-raised backdrop-saturate-[1.3] active:shadow-action-pressed active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand before:absolute before:inset-x-0 before:-inset-y-2 before:content-['']"
    >
      <span className="venus-mode-label">{t('layout.interfaceMode.pro')}</span>

      <Icon
        name="chevronRight"
        className="size-4 text-brand transition-transform duration-150 group-hover:translate-x-0.5"
      />

      <span aria-hidden="true" className="venus-mode-switch__border" />
    </Link>
  );

  if (!hasHoverPointer || !isMdUp) {
    return link;
  }

  return (
    <Provider>
      <Tooltip delayDuration={200}>
        <Trigger asChild>{link}</Trigger>

        <TooltipContent side="top" className="block p-3 z-99999">
          <span className="block font-semibold">{t('modalDetailLink.tooltipTitle')}</span>
          <span className="block text-secondary">{destination}</span>
        </TooltipContent>
      </Tooltip>
    </Provider>
  );
};
