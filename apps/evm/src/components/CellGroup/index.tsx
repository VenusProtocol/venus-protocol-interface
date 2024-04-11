import { InfoIcon } from '../InfoIcon';
import { cn } from 'utilities';

export interface Cell {
  label: string;
  value: string | number;
  tooltip?: string;
  color?: string;
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
}) => (
  <div
    className={cn(
      'gap-2 bg-transparent p-0',
      variant === 'secondary'
        ? 'flex overflow-y-auto scrollbar-hidden'
        : 'grid grid-cols-1 sm:grid-cols-2 xl:bg-cards xl:flex xl:p-6 xl:flex-wrap xl:rounded-2xl xl:gap-x-0',
      className,
    )}
    {...containerProps}
  >
    {cells.map(({ label, value, tooltip, color }) => (
      <div
        className={cn(
          'flex flex-col gap-y-1 whitespace-nowrap justify-center xl: xl:bg-transparent',
          variant === 'secondary'
            ? 'px-4 md:px-6 first-of-type:pl-0 last-of-type:pr-0 border-r border-r-lightGrey last-of-type:border-r-0'
            : 'bg-cards rounded-2xl p-4 xl:py-0 xl:px-6 xl:rounded-none xl:first-of-type:pl-0 xl:last-of-type:pr-0 xl:border-r xl:last-of-type:border-r-0 xl:border-lightGrey',
        )}
        key={`cell-group-item-${label}`}
      >
        <div className="flex items-center">
          <span className={cn('text-grey', smallValues && 'text-sm')}>{label}</span>

          {!!tooltip && <InfoIcon tooltip={tooltip} className="ml-2" />}
        </div>

        <p
          className={cn(smallValues ? 'text-lg' : 'text-xl')}
          style={
            color
              ? {
                  color,
                }
              : undefined
          }
        >
          {value}
        </p>
      </div>
    ))}
  </div>
);

export default CellGroup;
