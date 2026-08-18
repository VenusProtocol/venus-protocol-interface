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

  // We navigate in an effect instead of rendering a Navigate component so the redirection
  // also happens when the location changes while this component is still mounted. Other
  // components, such as UrlChainIdFallback, replace the search params of the location they
  // were rendered with, which would otherwise revert this redirection and leave the user on
  // a route that does not exist
  useEffect(() => {
    if (location.pathname === pathname && location.search === search) {
      return;
    }

    navigate({ pathname, search }, { replace: true });
  }, [location.pathname, location.search, pathname, search, navigate]);

  return undefined;
};
