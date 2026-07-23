import { cn } from '@venusprotocol/ui';

import { Card, LabeledInlineContent, type TableColumn } from 'components';
import type { LiquidityHubSource } from 'types';

export interface CardListProps {
  columns: TableColumn<LiquidityHubSource>[];
  sources: LiquidityHubSource[];
  rowKeyExtractor: (row: LiquidityHubSource) => string;
  className?: string;
}

export const CardList: React.FC<CardListProps> = ({
  columns,
  sources,
  rowKeyExtractor,
  className,
}) => (
  <div className={cn('space-y-3', className)}>
    {sources.map((row, rowIndex) => (
      <Card key={rowKeyExtractor(row)} className="bg-dark-blue p-3">
        <div className="space-y-3">
          {columns.map(column => (
            <LabeledInlineContent label={column.label} key={column.key}>
              {column.renderCell(row, rowIndex)}
            </LabeledInlineContent>
          ))}
        </div>
      </Card>
    ))}
  </div>
);
