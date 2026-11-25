import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useTheme } from 'hooks/useTheme';

export const useSuperProperties = () => {
  const { mode } = useInterfaceMode();
  const { preference, theme } = useTheme();

  return {
    version: mode,
    themePreference: preference,
    theme,
  };
};
