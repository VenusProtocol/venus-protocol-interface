import { cn } from '@venusprotocol/ui';
import { Card, type CardProps, CellGroup, type CellProps } from 'components';

export interface Legend {
  label: string;
  color: 'blue' | 'red' | 'green';
}

export interface MarketCardProps extends CardProps {
  title: string;
  topContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  legends?: Legend[];
  cells?: CellProps[];
  className?: string;
  children?: React.ReactNode;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  children,
  title,
  topContent,
  rightContent,
  legends = [],
  cells = [],
  className,
  ...otherProps
}) => (
  <Card
    className={cn('@container/marketCard space-y-5 p-6 md:space-y-8', className)}
    {...otherProps}
  >
    <div className="space-y-5 md:space-y-6">
      <div
        className={cn(
          'space-y-6',
          !rightContent && '@lg:space-y-0 @lg:flex @lg:items-center @lg:justify-between',
        )}
      >
        <div className="flex flex-col gap-y-3 @lg:flex-row @lg:items-center @lg:justify-between">
          <h4 className="mr-4 text-lg md:mb-0">{title}</h4>

          {!!rightContent && <div>{rightContent}</div>}
        </div>
      </div>

      {topContent}

      {cells.length > 0 && <CellGroup cells={cells} />}

      {legends.length > 0 && (
        <div className="flex items-center space-x-6">
          {legends.map(legend => (
            <div className="flex items-center" key={`card-${title}-legend-${legend.label}`}>
              <div
                className={cn('mr-1 h-2 w-2 shrink-0 rounded-full', {
                  'bg-red': legend.color === 'red',
                  'bg-blue': legend.color === 'blue',
                  'bg-green': legend.color === 'green',
                })}
              />

              <p className="text-sm">{legend.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    {children}
  </Card>
);
