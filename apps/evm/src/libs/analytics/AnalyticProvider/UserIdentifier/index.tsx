import { useAccountAddress } from 'libs/wallet';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

export const UserIdentifier: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const posthog = usePostHog();

  // Identify user by their account address
  useEffect(() => {
    if (accountAddress) {
      posthog?.identify(accountAddress);
    } else {
      posthog?.reset();
    }
  }, [accountAddress, posthog]);

  return undefined;
};
