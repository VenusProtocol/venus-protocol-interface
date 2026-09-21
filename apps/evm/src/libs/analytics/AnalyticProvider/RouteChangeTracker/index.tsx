import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const RouteChangeTracker: React.FC = () => {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture('$pageview', {
      $current_url: window.location.href,
      $pathname: location.pathname,
    });
  }, [location.pathname, posthog]);

  return null;
};
