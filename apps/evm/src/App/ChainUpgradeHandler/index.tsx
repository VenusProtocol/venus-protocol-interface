import { useNow } from 'hooks/useNow';
import { useEffect } from 'react';

const runtimeTimestamp = new Date();

export interface ChainUpgradeHandlerProps {
  upgradeTimestamps: Date[];
}

export const ChainUpgradeHandler: React.FC<ChainUpgradeHandlerProps> = ({ upgradeTimestamps }) => {
  const now = useNow({ intervalMs: 10000 });

  // Reload page if we're passed any of the chain upgrades and the app was opened before that, so
  // that the block time and blocks per day metadata from the @venusprotocol/chains package are
  // updated
  useEffect(() => {
    if (
      upgradeTimestamps.some(
        upgradeTimestamp => now >= upgradeTimestamp && runtimeTimestamp < upgradeTimestamp,
      )
    ) {
      window.location.reload();
    }
  }, [now, upgradeTimestamps]);

  return undefined;
};
