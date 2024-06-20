import { Card } from 'components';
import { cn } from 'utilities';

import type { Stat } from '../../types';

export interface Legend {
  label: string;
  color: 'blue' | 'red' | 'green';
}

export interface MarketCardProps {
  title: string;
  rightLabel?: string | React.ReactNode;
  legends?: Legend[];
  stats?: Stat[];
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  children,
  title,
  rightLabel,
  legends = [],
  stats = [],
  className,
  testId,
}) => (
  <Card className={cn(className, 'space-y-8')} data-testid={testId}>
    <div className="space-y-6">
      <div
        className={cn(
          'space-y-6',
          !rightLabel && 'lg:space-y-0 lg:flex lg:items-center lg:justify-between',
        )}
      >
        <div className="flex items-center justify-between">
          <h4 className="mr-4 text-lg md:mb-0">{title}</h4>

          {!!rightLabel && <div>{rightLabel}</div>}
        </div>

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

      {stats.length > 0 && (
        <div className="flex space-x-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hidden text-nowrap lg:text-wrap">
          {stats.map(stat => (
            <div
              className="border-lightGrey border-r pr-6 last-of-type:border-0 last-of-type:pr-0 flex-shrink-0"
              key={`card-${title}-legend-${stat.label}`}
            >
              <p className="text-grey mb-1 text-sm">{stat.label}</p>

              <p className="text-sm font-semibold sm:text-lg">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    {children}
  </Card>
);
