import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useTheme } from 'hooks/useTheme';

export const useSuperProperties = () => {
  const { mode } = useInterfaceMode();
  const { preference } = useTheme();

  return {
    version: mode,
    themePreference: preference,
  };
};
