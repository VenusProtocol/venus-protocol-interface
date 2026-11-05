import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useLocation } from 'react-router';
import { isProOnlyPathname, useStore } from './store';

export const useInterfaceMode = () => {
  const storedMode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);
  const { pathname } = useLocation();
  const isLiteModeEnabled = useIsFeatureEnabled({ name: 'liteMode' });

  const mode = isLiteModeEnabled && !isProOnlyPathname(pathname) ? storedMode : 'pro';

  return { mode, isLite: mode === 'lite', setMode };
};
