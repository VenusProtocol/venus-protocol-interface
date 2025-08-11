import { PostHogProvider, usePostHog } from 'posthog-js/react';
import config from '../../config';
import { version as APP_VERSION } from '../../constants/version';
import { useAppStateContext } from '../../context';

export interface AnalyticProviderProps {
  children?: React.ReactNode;
}

export const AnalyticProvider: React.FC<AnalyticProviderProps> = ({ children }) => {
  const posthog = usePostHog();
  const { setAnalyticIds } = useAppStateContext();

  const onLoaded = () =>
    setAnalyticIds({
      sessionId: posthog.get_session_id(),
      distinctId: posthog.get_distinct_id(),
    });

  return (
    <PostHogProvider
      apiKey={config.posthog.apiKey}
      options={{
        api_host: config.posthog.hostUrl,
        persistence: 'memory',
        name: APP_VERSION,
        loaded: onLoaded,
      }}
    >
      {children}
    </PostHogProvider>
  );
};
