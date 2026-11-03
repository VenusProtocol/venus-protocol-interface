import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { SHARED_PATHNAMES, useStore } from '../store';

export const useProModeOnProRoutes = () => {
  const { pathname } = useLocation();
  const setMode = useStore(state => state.setMode);

  useEffect(() => {
    if (!SHARED_PATHNAMES.includes(pathname.replace(/\/$/, '') || '/')) {
      setMode('pro');
    }
  }, [pathname, setMode]);
};
