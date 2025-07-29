import config from 'config';
import { logError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { usePostHog } from 'posthog-js/react';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { debounce } from 'utilities';
import { useAccount } from 'wagmi';
import type { AnalyticEventName, AnalyticEventProps } from './types';

export * from './types';

interface CaptureEventOptions {
  debounced?: boolean;
}

export const useAnalytics = () => {
  const posthog = usePostHog();
  const { chainId } = useChainId();
  const { connector } = useAccount();
  const { accountAddress } = useAccountAddress();
  const { pathname } = useLocation();

  const captureEvent = useCallback(
    <TEventName extends AnalyticEventName>(
      eventName: TEventName,
      eventProps: AnalyticEventProps<TEventName>,
    ) => {
      const commonProperties = {
        chainId,
        // We already identify users by their wallet address, but it doesn't seem to show in PostHog
        // so we also record the wallet address when sending an event
        walletAddress: accountAddress,
        walletProvider: connector?.name,
        origin: config.isSafeApp ? 'Safe App' : 'Venus App',
        page: pathname,
      };

      // Only send analytic events in production
      if (config.environment !== 'production') {
        console.groupCollapsed(`[Analytic event] ${eventName}`);
        console.log('Common', commonProperties);
        console.log('Specific', eventProps);
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
    [chainId, pathname, accountAddress, connector?.name, posthog],
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
    captureAnalyticEvent,
  };
};
