import { cn } from '@venusprotocol/ui';

import type { CellProps } from 'components/Cell';
import { CellGroup } from 'components/CellGroup';

export interface PageStatHeaderProps {
  title: string;
  description?: string;
  cells: CellProps[];
  className?: string;
}

export const PageStatHeader: React.FC<PageStatHeaderProps> = ({
  title,
  description,
  cells,
  className,
}) => (
  <div
    className={cn(
      'space-y-6 xl:flex xl:space-y-0 xl:gap-x-6 xl:justify-between xl:items-center',
      className,
    )}
  >
    <div className="xl:max-w-140">
      <h1 className="text-p1s sm:text-h6">{title}</h1>

      {description && <p className="hidden sm:block text-p3r">{description}</p>}
    </div>

    <CellGroup cells={cells} className="xl:w-auto" variant="secondary" />
  </div>
);
