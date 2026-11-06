import { cn } from '@venusprotocol/ui';

import type { CellProps } from 'components/Cell';
import { InfoIcon } from 'components/InfoIcon';

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
    className={cn('flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between', className)}
  >
    <div className="xl:max-w-140">
      <h1 className="venus-page-title">{title}</h1>

      {description && <p className="venus-page-subtitle">{description}</p>}
    </div>

    <div className="flex shrink-0 flex-wrap gap-8 sm:gap-12">
      {cells.map(cell => (
        <div key={cell.label}>
          <div className="mb-3 flex items-center gap-x-2">
            <p className="text-sm text-light-grey">{cell.label}</p>

            {!!cell.tooltip && <InfoIcon tooltip={cell.tooltip} />}
          </div>

          <div className="text-xl font-normal tabular-nums xl:text-2xl">{cell.value}</div>
        </div>
      ))}
    </div>
  </div>
);
