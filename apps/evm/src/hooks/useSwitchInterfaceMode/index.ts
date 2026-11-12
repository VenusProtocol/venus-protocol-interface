import { useInterfaceMode } from 'hooks/useInterfaceMode';
import type { InterfaceMode } from 'hooks/useInterfaceMode/store';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useProHomePath } from 'hooks/useProHomePath';
import { governanceChainId, useSwitchChain } from 'libs/wallet';
import { useLocation, useNavigate } from 'react-router';

export const useSwitchInterfaceMode = () => {
  const { isLite, setMode } = useInterfaceMode();
  const isLiteModeEnabled = useIsFeatureEnabled({ name: 'liteMode' });
  const { switchChain } = useSwitchChain();
  const proHomePath = useProHomePath();
  const navigate = useNavigate();
  const location = useLocation();

  return (targetMode: InterfaceMode) => {
    if (targetMode === 'lite' && !isLiteModeEnabled) {
      switchChain({
        chainId: governanceChainId,
        callback: () => {
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

    setMode(targetMode);
    navigate({
      pathname: targetMode === 'pro' ? proHomePath : '/',
      search: chainId ? `?chainId=${chainId}` : '',
    });
  };
};
