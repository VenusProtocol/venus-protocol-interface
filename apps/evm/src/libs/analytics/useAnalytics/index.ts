import { usePostHog } from 'posthog-js/react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { useAccount } from 'wagmi';

import config from 'config';
import { logError } from 'libs/errors';
import { useChainId } from 'libs/wallet';
import { debounce } from 'utilities';
import { useAuthAnalyticVariantContext } from '../context';
import type { AnalyticEventName, AnalyticEventProps } from './types';

export * from './types';

interface CaptureEventOptions {
  debounced?: boolean;
}

export const useAnalytics = () => {
  const posthog = usePostHog();
  const { chainId: currentChainId } = useChainId();
  const { connector } = useAccount();
  const { pathname } = useLocation();
  const { authAnalyticVariant, setAuthAnalyticVariant } = useAuthAnalyticVariantContext();

  const captureEvent = useCallback(
    <TEventName extends AnalyticEventName>(
      eventName: TEventName,
      eventProps: AnalyticEventProps<TEventName>,
    ) => {
      const { chainId, walletAddress, walletProvider, origin, page, ...specificProperties } =
        eventProps;

      const commonProperties = {
        chainId: chainId || currentChainId,
        walletProvider: walletProvider || connector?.name,
        origin: origin || config.isSafeApp ? 'Safe App' : 'Venus App',
        page: page || pathname,
      };

      // Only send analytic events in production
      if (config.environment !== 'production') {
        console.groupCollapsed(`[Analytic event] ${eventName}`);
        console.log('Common', commonProperties);
        console.log('Specific', specificProperties);
        console.groupEnd();
        return;
      }

      if (!posthog) {
        logError('Attempted to send analytic event but posthog object was undefined');
        return;
      }

      // Send event to PostHog
      posthog.capture(eventName, {
        ...commonProperties,
        ...eventProps,
      });
    },
    [currentChainId, pathname, connector?.name, posthog],
  );

  const debouncedCaptureEvent = useMemo(
    () =>
      debounce({
        fn: captureEvent,
        delay: 900,
      }),
    [captureEvent],
  );

  const captureAnalyticEvent = <TEventName extends AnalyticEventName>(
    eventName: TEventName,
    eventProps: AnalyticEventProps<TEventName>,
    option?: CaptureEventOptions,
  ) => {
    const fn = option?.debounced ? debouncedCaptureEvent : captureEvent;
    fn(eventName, eventProps);
  };

  return {
    authAnalyticVariant,
    setAuthAnalyticVariant,
    captureAnalyticEvent,
  };
};
