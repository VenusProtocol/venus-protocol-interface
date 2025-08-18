import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const RouteChangeTracker: React.FC = () => {
  const location = useLocation();
  const posthog = usePostHog();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to send a pageview event every time the pathname changes (but not the search params)
  useEffect(() => {
    posthog?.capture('$pageview', {
      $current_url: window.location.href,
    });
  }, [location.pathname, posthog]);

  return null;
};
