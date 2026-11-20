import { useAccountAddress } from 'libs/wallet';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { useSuperProperties } from '../../useSuperProperties';

export const SuperPropertiesRegistrar: React.FC = () => {
  const posthog = usePostHog();
  const { accountAddress } = useAccountAddress();
  const { version, themePreference } = useSuperProperties();

  // biome-ignore lint/correctness/useExhaustiveDependencies: posthog.reset() clears super properties when the wallet disconnects
  useEffect(() => {
    posthog?.register({ version, themePreference });
  }, [posthog, version, themePreference, accountAddress]);

  return null;
};
