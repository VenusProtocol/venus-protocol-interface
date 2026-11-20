import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { useStore } from './store';

export const useIosRiskModal = () => {
  const isEnabled = useIsFeatureEnabled({ name: 'iosExploitWarning' });
  const risk = useStore(state => state.risk);
  const isAcknowledged = useStore(state => state.isAcknowledged);
  const acknowledge = useStore(state => state.acknowledge);

  const affectedRisk = isEnabled && risk?.status === 'affected' ? risk : undefined;

  return {
    risk: affectedRisk,
    isUnreadable: isEnabled && risk?.status === 'unreadable',
    isOpen: !!affectedRisk && !isAcknowledged,
    acknowledge,
  };
};
