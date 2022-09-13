import { DependencyList, useContext, useEffect } from 'react';

import { BreadcrumbNavigationContext, PathNode } from 'context/BreadcrumbNavigationContext';
import useIsMounted from 'hooks/useIsMounted';

// Hook used to dynamically update the path nodes used for the breadcrumb
// navigation
const useUpdateBreadcrumbNavigation = (
  updatePathNodes: (currentPathNodes: PathNode[]) => PathNode[],
  dependencies: DependencyList,
) => {
  const checkIfIsMounted = useIsMounted();
  const isMounted = checkIfIsMounted();

  const { pathNodes, setPathNodes } = useContext(BreadcrumbNavigationContext);

  useEffect(() => {
    if (isMounted) {
      const newPathNodes = updatePathNodes(pathNodes);
      setPathNodes(newPathNodes);
    }
  }, [isMounted, ...dependencies]);
};

export default useUpdateBreadcrumbNavigation;
