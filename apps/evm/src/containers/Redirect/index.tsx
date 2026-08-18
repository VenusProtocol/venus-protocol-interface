import { useFormatTo } from 'hooks/useFormatTo';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export interface RedirectProps {
  to: string;
}

export const Redirect: React.FC<RedirectProps> = ({ to }) => {
  const { formatTo } = useFormatTo();
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = formatTo({ to });

  useEffect(() => {
    if (location.pathname === pathname && location.search === search) {
      return;
    }

    navigate({ pathname, search }, { replace: true });
  }, [location.pathname, location.search, pathname, search, navigate]);

  return undefined;
};
