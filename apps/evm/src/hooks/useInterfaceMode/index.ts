import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useEffect } from 'react';
import { useStore } from './store';

export { useProModeOnProRoutes } from './useProModeOnProRoutes';

export const useInterfaceMode = () => {
  const storedMode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);
  const isLiteModeEnabled = useIsFeatureEnabled({ name: 'liteMode' });

  useEffect(() => {
    if (!isLiteModeEnabled && storedMode === 'lite') {
      setMode('pro');
    }
  }, [isLiteModeEnabled, storedMode, setMode]);

  const mode = isLiteModeEnabled ? storedMode : 'pro';

  return { mode, isLite: mode === 'lite', setMode };
};
