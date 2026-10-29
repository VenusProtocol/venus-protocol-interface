import { useStore } from './store';

export type { InterfaceMode } from './store';

export const useInterfaceMode = () => {
  const mode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);

  return { mode, isLite: mode === 'lite', setMode };
};
