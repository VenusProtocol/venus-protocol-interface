import noop from 'noop-ts';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'translation';

import { menuItems } from 'components/Layout/constants';

export interface PathNode {
  dom: string | React.ReactNode;
  href?: string;
}

export interface BreadcrumbNavigationContextValue {
  pathNodes: PathNode[];
  setPathNodes: (newPathNodes: PathNode[]) => void;
}

export const BreadcrumbNavigationContext = React.createContext<BreadcrumbNavigationContextValue>({
  pathNodes: [],
  setPathNodes: noop,
});

export const BreadcrumbNavigationProvider: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [pathNodes, setPathNodes] = useState<PathNode[]>([]);

  // Reset path nodes on navigation change
  useEffect(() => {
    const pathnameRoot = (pathname as string).split('/').slice(0, 2).join('/');
    const activeMenuItem = menuItems.find(item => item.href === pathnameRoot);

    setPathNodes(
      activeMenuItem
        ? [
            {
              href: pathnameRoot,
              dom: t(activeMenuItem.i18nKey),
            },
          ]
        : [],
    );
  }, [pathname]);

  return (
    <BreadcrumbNavigationContext.Provider
      value={{
        pathNodes,
        setPathNodes,
      }}
    >
      {children}
    </BreadcrumbNavigationContext.Provider>
  );
};
