import { useInterfaceMode } from 'hooks/useInterfaceMode';
import type { InterfaceMode } from 'hooks/useInterfaceMode/store';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useProHomePath } from 'hooks/useProHomePath';
import { useAnalytics } from 'libs/analytics';
import { governanceChainId, useSwitchChain } from 'libs/wallet';
import { useLocation, useNavigate } from 'react-router';

type InterfaceModeSwitchAnalyticVariant = 'header_toggle' | 'onboarding';

export const useSwitchInterfaceMode = () => {
  const { mode, isLite, setMode } = useInterfaceMode();
  const isLiteModeEnabled = useIsFeatureEnabled({ name: 'liteMode' });
  const { switchChain } = useSwitchChain();
  const { captureAnalyticEvent } = useAnalytics();
  const proHomePath = useProHomePath();
  const navigate = useNavigate();
  const location = useLocation();

  return (targetMode: InterfaceMode, analyticVariant: InterfaceModeSwitchAnalyticVariant) => {
    const captureVersionSwitched = () =>
      captureAnalyticEvent('version_switched', {
        prevVersion: mode,
        version: targetMode,
        variant: analyticVariant,
      });

    if (targetMode === 'lite' && !isLiteModeEnabled) {
      switchChain({
        chainId: governanceChainId,
        callback: () => {
          captureVersionSwitched();
          setMode('lite');
          navigate({ pathname: '/', search: `?chainId=${governanceChainId}` });
        },
      });

      return;
    }

    const chainId = new URLSearchParams(location.search).get('chainId');

    if (isLite) {
      navigate(location, { replace: true, state: { ...location.state, liteEntry: true } });
    }

    captureVersionSwitched();
    setMode(targetMode);
    navigate({
      pathname: targetMode === 'pro' ? proHomePath : '/',
      search: chainId ? `?chainId=${chainId}` : '',
    });
  };
};
