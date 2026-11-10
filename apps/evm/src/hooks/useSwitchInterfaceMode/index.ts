import { useInterfaceMode } from 'hooks/useInterfaceMode';
import type { InterfaceMode } from 'hooks/useInterfaceMode/store';
import { useProHomePath } from 'hooks/useProHomePath';
import { useLocation, useNavigate } from 'react-router';

export const useSwitchInterfaceMode = () => {
  const { isLite, setMode } = useInterfaceMode();
  const proHomePath = useProHomePath();
  const navigate = useNavigate();
  const location = useLocation();

  return (targetMode: InterfaceMode) => {
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
