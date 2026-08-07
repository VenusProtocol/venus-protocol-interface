import { Content } from './Content';
import { useStore } from './store';

/**
 * Global host for the market operations modal, so features outside a
 * markets table (e.g. the support chat widget) can pop it from anywhere.
 * Mounted once in App; opened through this container's store.
 */
const MarketFormModalHost: React.FC = () => {
  const request = useStore(state => state.request);

  if (!request) {
    return null;
  }

  return <Content request={request} />;
};

export default MarketFormModalHost;
