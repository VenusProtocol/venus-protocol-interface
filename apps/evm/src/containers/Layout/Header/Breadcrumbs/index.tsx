import { cn } from '@venusprotocol/ui';
import { Wrapper } from 'components';
import { Link } from 'containers/Link';
import type { PathNode } from '../usePathNodes';

export interface BreadcrumbsProps {
  pathNodes: PathNode[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, pathNodes }) => {
  const pathNodeDom = pathNodes.map((pathNode, index) => (
    <span key={`layout-header-breadcrumb-${pathNode.href}`} className="inline-flex items-center">
      {pathNodes.length > 0 && index < pathNodes.length - 1 ? (
        <>
          <Link
            className="text-secondary hover:text-primary transition-colors hover:no-underline"
            to={pathNode.href}
          >
            {pathNode.dom}
          </Link>

          <span className="text-secondary mx-2">/</span>
        </>
      ) : (
        <span className="font-bold">{pathNode.dom}</span>
      )}
    </span>
  ));

  return (
    <Wrapper className={className}>
      <span className={cn('flex flex-wrap items-center', pathNodes.length === 1 && 'text-xl')}>
        {pathNodeDom}
      </span>
    </Wrapper>
  );
};
