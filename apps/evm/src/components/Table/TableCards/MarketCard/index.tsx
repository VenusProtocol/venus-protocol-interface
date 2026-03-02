import { cn } from '@venusprotocol/ui';
import type { To } from 'react-router';

import { Card } from 'components/Card';
import { Delimiter } from 'components/Delimiter';
import { LabeledInlineContent } from 'components/LabeledInlineContent';
import { RowControl } from 'components/Table/RowControl';
import type { TableProps } from 'components/Table/types';
import { Link } from 'containers/Link';

export interface MarketCardProps<R> {
  row: R;
  index: number;
  columns: TableProps<R>['columns'];
  key: string;
  href?: To;
  onClick?: TableProps<R>['rowOnClick'];
  onControlClick?: TableProps<R>['rowControlOnClick'];
  className?: string;
}

export function MarketCard<R>({
  index,
  row,
  href,
  columns,
  onClick,
  onControlClick,
  className,
  key,
}: MarketCardProps<R>) {
  const [titleColumn, ...otherColumns] = columns;

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>{titleColumn.renderCell(row, index)}</div>

        {onControlClick && <RowControl onClick={e => onControlClick?.(e, row)} />}
      </div>

      <Delimiter className="my-4" />

      <div className="space-y-6">
        {otherColumns.map(column => (
          <LabeledInlineContent key={`${key}-${column.key}`} label={column.label}>
            <div className="text-right inline-flex">{column.renderCell(row, index)}</div>
          </LabeledInlineContent>
        ))}
      </div>
    </div>
  );

  return (
    <Card
      className={cn(
        !!(onClick || href) && 'cursor-pointer hover:bg-dark-blue-hover active:bg-dark-blue-active',
        className,
      )}
      asChild
      onClick={e => onClick?.(e, row)}
      key={key}
    >
      {href ? (
        <Link className="text-white no-underline hover:no-underline" noStyle to={href}>
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
    </Card>
  );
}
