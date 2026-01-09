import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import { Wrapper } from 'components';
import { Link } from 'containers/Link';
import type { PathNode } from '../usePathNodes';

export interface BreadcrumbsProps {
  pathNodes: PathNode[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathNodes }) => {
  const pathNodeDom = useMemo(
    () =>
      pathNodes.map((pathNode, index) => (
        <span
          key={`layout-header-breadcrumb-${pathNode.href}`}
          className="inline-flex items-center"
        >
          {pathNodes.length > 0 && index < pathNodes.length - 1 ? (
            <>
              <Link
                className="text-grey hover:text-white transition-colors hover:no-underline"
                to={pathNode.href}
              >
                {pathNode.dom}
              </Link>

              <span className="text-grey mx-2">/</span>
            </>
          ) : (
            <span className="font-bold">{pathNode.dom}</span>
          )}
        </span>
      )),
    [pathNodes],
  );

  return (
    <Wrapper>
      <span className={cn('flex flex-wrap items-center', pathNodes.length === 1 && 'text-xl')}>
        {pathNodeDom}
      </span>
    </Wrapper>
  );
};
