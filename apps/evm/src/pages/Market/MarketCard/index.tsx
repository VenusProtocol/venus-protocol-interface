import { cn } from '@venusprotocol/ui';
import { Card, type CardProps } from 'components';

import type { Stat } from '../types';

export interface Legend {
  label: string;
  color: 'blue' | 'red' | 'green';
}

export interface MarketCardProps extends CardProps {
  title: string;
  topContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  legends?: Legend[];
  stats?: Stat[];
  className?: string;
  children?: React.ReactNode;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  children,
  title,
  topContent,
  rightContent,
  legends = [],
  stats = [],
  className,
  ...otherProps
}) => (
  <Card className={cn('space-y-5 p-6 md:space-y-8', className)} {...otherProps}>
    <div className="space-y-5 md:space-y-6">
      <div
        className={cn(
          'space-y-6',
          !rightContent && 'lg:space-y-0 lg:flex lg:items-center lg:justify-between',
        )}
      >
        <div className="flex items-center justify-between">
          <h4 className="mr-4 text-lg md:mb-0">{title}</h4>

          {!!rightContent && <div>{rightContent}</div>}
        </div>
      </div>

      {topContent}

      {stats.length > 0 && (
        <div className="flex space-x-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hidden text-nowrap lg:text-wrap">
          {stats.map(stat => (
            <div
              className="border-lightGrey border-r pr-6 last-of-type:border-0 last-of-type:pr-0 shrink-0"
              key={`card-${title}-legend-${stat.label}`}
            >
              <p className="text-grey mb-1 text-sm">{stat.label}</p>

              <div className="text-sm font-semibold sm:text-lg">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

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
