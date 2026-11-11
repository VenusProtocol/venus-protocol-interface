import { useIsFetching } from '@tanstack/react-query';
import { PrimaryButton } from '@venusprotocol/ui';
import venusLogoSrc from 'assets/img/venusLogo.svg';
import venusWordmarkSrc from 'assets/img/venusWordmark.svg';
import { Icon } from 'components';
import backgroundSrc from 'containers/VipModal/Modal/background.jpg';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useIsConnectedAccountVip } from 'hooks/useIsConnectedAccountVip';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSwitchInterfaceMode } from 'hooks/useSwitchInterfaceMode';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import { getOnboardingVariant } from './getOnboardingVariant';
import { hasSeenOnboarding, markOnboardingSeen } from './storage';

const SHOW_DELAY_MS = 800;
const CARD_MAX_WIDTH_PX = 432;
const VIEWPORT_GUTTER_PX = 16;
const ANCHOR_GAP_PX = 12;
const ARROW_SIZE_PX = 16;

interface CardPosition {
  top: number;
  right: number;
  width: number;
  arrowRight: number;
}

const getModeSwitch = () =>
  document.querySelector<HTMLButtonElement>('[data-interface-mode-switch]');

const isAnotherDialogOpen = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], dialog[open]')).some(
    element => {
      if (element.closest('[data-interface-onboarding]') || element.hidden) {
        return false;
      }

      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    },
  );

const getCardPosition = (): CardPosition => {
  const viewportWidth = window.innerWidth;
  const width = Math.min(CARD_MAX_WIDTH_PX, viewportWidth - VIEWPORT_GUTTER_PX * 2);
  const anchor = getModeSwitch()?.getBoundingClientRect();

  if (!anchor) {
    return { top: 80, right: VIEWPORT_GUTTER_PX, width, arrowRight: VIEWPORT_GUTTER_PX };
  }

  const right = Math.min(
    Math.max(viewportWidth - anchor.right, VIEWPORT_GUTTER_PX),
    viewportWidth - VIEWPORT_GUTTER_PX - width,
  );
  const anchorCenterFromRight = viewportWidth - (anchor.left + anchor.width / 2);

  return {
    top: anchor.bottom + ANCHOR_GAP_PX,
    right,
    width,
    arrowRight: anchorCenterFromRight - right - ARROW_SIZE_PX / 2,
  };
};

export const InterfaceOnboarding: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { accountAddress, isAccountPending } = useAccountAddress();
  const { isLite } = useInterfaceMode();
  const isLiteModeEnabled = useIsFeatureEnabled({ name: 'liteMode' });
  const { isConnectedAccountVip, isLoading: isVipStatusLoading } = useIsConnectedAccountVip();
  const [userChainSettings] = useUserChainSettings();
  const switchInterfaceMode = useSwitchInterfaceMode();
  const cardRef = useRef<HTMLDivElement>(null);

  const [entry] = useState(() => ({
    pathname,
    variant:
      isLiteModeEnabled && !hasSeenOnboarding()
        ? getOnboardingVariant({ pathname, isLite })
        : undefined,
  }));
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasLeftEntryPage, setHasLeftEntryPage] = useState(false);
  const [isPageClear, setIsPageClear] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<CardPosition>();

  const firstLoadCount = useIsFetching({ predicate: query => query.state.data === undefined });
  const isOnEntryPage = pathname === entry.pathname;
  const isPending = !!entry.variant && !isDismissed && !hasLeftEntryPage && isOnEntryPage;
  const isVipModalPending =
    !!accountAddress &&
    !userChainSettings.doNotShowVipModal &&
    (isVipStatusLoading || isConnectedAccountVip);
  const isPageLoading = !!isAccountPending || firstLoadCount > 0;
  const canShow = isPending && isPageClear && !isVipModalPending && (isVisible || !isPageLoading);

  useEffect(() => {
    if (!isOnEntryPage) {
      setHasLeftEntryPage(true);
    }
  }, [isOnEntryPage]);

  useEffect(() => {
    if (!isPending) {
      return;
    }

    const updatePageClear = () => setIsPageClear(!!getModeSwitch() && !isAnotherDialogOpen());

    const observer = new MutationObserver(updatePageClear);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open', 'role', 'style', 'class', 'hidden'],
    });

    updatePageClear();

    return () => observer.disconnect();
  }, [isPending]);

  useEffect(() => {
    if (!canShow) {
      setIsVisible(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPosition(getCardPosition());
      setIsVisible(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [canShow]);

  const dismiss = () => {
    markOnboardingSeen();
    setIsDismissed(true);
  };

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    cardRef.current?.focus({ preventScroll: true });

    const updatePosition = () => setPosition(getCardPosition());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        markOnboardingSeen();
        setIsDismissed(true);
      }
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  const shownVariant = entry.variant;

  if (!isVisible || !canShow || !shownVariant || !position) {
    return null;
  }

  const handleTry = () => {
    dismiss();
    switchInterfaceMode(shownVariant);
  };

  const content =
    shownVariant === 'pro'
      ? {
          modeName: t('layout.interfaceMode.pro'),
          title: t('layout.interfaceOnboarding.pro.title'),
          description: t('layout.interfaceOnboarding.pro.description'),
          tryButtonLabel: t('layout.interfaceOnboarding.pro.tryButtonLabel'),
        }
      : {
          modeName: t('layout.interfaceMode.lite'),
          title: t('layout.interfaceOnboarding.lite.title'),
          description: t('layout.interfaceOnboarding.lite.description'),
          tryButtonLabel: t('layout.interfaceOnboarding.lite.tryButtonLabel'),
        };

  return (
    <div data-interface-onboarding="">
      <div className="fixed inset-0 z-9999 backdrop-blur-xs" onClick={dismiss} aria-hidden="true" />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interface-onboarding-title"
        aria-describedby="interface-onboarding-description"
        tabIndex={-1}
        className="fixed z-99999 flex flex-col gap-y-5 rounded-2xl border border-border-raised bg-surface-popup p-5 shadow-popup backdrop-blur-popup backdrop-saturate-[1.2] outline-hidden sm:p-6"
        style={{
          top: position.top,
          right: position.right,
          width: position.width,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-2 size-4 rotate-45 border-t border-l border-border-raised bg-surface-popup [clip-path:polygon(0_0,100%_0,0_100%)]"
          style={{ right: Math.max(position.arrowRight, ARROW_SIZE_PX) }}
        />

        <div className="flex items-center justify-between gap-x-3">
          <h2 id="interface-onboarding-title" className="text-p2s">
            {content.title}
          </h2>

          <button
            type="button"
            aria-label={t('layout.interfaceOnboarding.closeButtonLabel')}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center"
            onClick={dismiss}
          >
            <Icon name="close" className="size-6" />
          </button>
        </div>

        <div className="relative flex aspect-8/3 items-center justify-center overflow-hidden rounded-lg">
          <img src={backgroundSrc} alt="" className="absolute inset-0 size-full object-cover" />

          <div className="relative flex items-center gap-x-3">
            <img src={venusLogoSrc} alt="" className="h-8" />
            <img src={venusWordmarkSrc} alt="Venus" className="h-5" />
            <span className="text-p2r text-white">{content.modeName}</span>
          </div>
        </div>

        <p id="interface-onboarding-description" className="text-p3r text-light-grey">
          {content.description}
        </p>

        <PrimaryButton className="w-full" onClick={handleTry}>
          {content.tryButtonLabel}
        </PrimaryButton>
      </div>
    </div>
  );
};
