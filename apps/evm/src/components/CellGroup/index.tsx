import { cn } from '@venusprotocol/ui';
import { useBreakpointUp } from 'hooks/responsive';
import { useState } from 'react';
import { InfoIcon } from '../InfoIcon';

export interface Cell {
  label: string;
  value: string | number | React.ReactNode;
  tooltip?: string;
  className?: string;
}

export type CellGroupVariant = 'primary' | 'secondary';

export interface CellGroupProps {
  cells: Cell[];
  variant?: CellGroupVariant;
  smallValues?: boolean;
  className?: string;
}

export const CellGroup: React.FC<CellGroupProps> = ({
  cells,
  variant = 'primary',
  smallValues = false,
  className,
  ...containerProps
}) => {
  const isSmOrUp = useBreakpointUp('sm');
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(!isSmOrUp);

  return (
    <div className="relative py-2">
      <div
        className={cn(
          'opacity-0 absolute top-0 left-0 h-full w-12 rounded-xl -translate-x-[75%] bg-gradient-to-r from-transparent/95 via-transparent/80 to-transparent z-10 transition-all',
          showLeftScroll && 'opacity-100',
        )}
      />
      <div
        className={cn(
          'opacity-0 absolute top-0 right-0 h-full w-12 rounded-xl translate-x-[75%] bg-gradient-to-l from-transparent/95 via-transparent/80 to-transparent z-10 transition-all',
          showRightScroll && 'opacity-100',
        )}
      />
      <div
        onScroll={elem => {
          const viewportWidth = window.innerWidth;
          const scrollPos = elem.currentTarget.scrollLeft;
          const maxScroll = elem.currentTarget.scrollWidth - viewportWidth;
          const isAtScrollStart = scrollPos === 0;
          const isAtScrollEnd = scrollPos >= maxScroll;

          setShowLeftScroll(!isAtScrollStart);
          setShowRightScroll(!isAtScrollEnd);
        }}
        className={cn(
          'gap-2 bg-transparent p-0',
          variant === 'secondary'
            ? 'flex overflow-y-auto scrollbar-hidden '
            : 'grid grid-cols-1 sm:grid-cols-2 xl:bg-cards xl:flex xl:p-6 xl:flex-wrap xl:rounded-xl xl:gap-x-0',
          className,
        )}
        {...containerProps}
      >
        {cells.map(({ label, value, tooltip, className: cellClassName }) => (
          <div
            className={cn(
              'flex flex-col gap-y-1 whitespace-nowrap justify-center xl: xl:bg-transparent',
              variant === 'secondary'
                ? 'px-4 md:px-6 first-of-type:pl-0 last-of-type:pr-0 border-r border-r-offWhite/10 last-of-type:border-r-0'
                : 'bg-cards rounded-xl p-4 xl:py-0 xl:px-6 xl:rounded-none xl:first-of-type:pl-0 xl:last-of-type:pr-0 xl:border-r xl:last-of-type:border-r-0 xl:border-lightGrey',
            )}
            key={`cell-group-item-${label}`}
          >
            <div className="flex items-center">
              <span className={cn('text-grey', smallValues && 'text-sm')}>{label}</span>

              {!!tooltip && <InfoIcon tooltip={tooltip} className="ml-2" />}
            </div>

            <p className={cn(smallValues ? 'text-lg' : 'text-xl', cellClassName)}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CellGroup;
