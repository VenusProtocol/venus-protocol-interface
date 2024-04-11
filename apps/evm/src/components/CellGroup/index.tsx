import { InfoIcon } from '../InfoIcon';
import { cn } from 'utilities';

export interface Cell {
  label: string;
  value: string | number;
  tooltip?: string;
  color?: string;
}

export interface CellGroupProps {
  cells: Cell[];
  naked?: boolean;
  smallValues?: boolean;
  className?: string;
}

export const CellGroup: React.FC<CellGroupProps> = ({
  cells,
  naked = false,
  smallValues = false,
  className,
  ...containerProps
}) => (
  <div
    className={cn(
      'grid grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-2 xl:flex xl:flex-wrap xl:bg-cards xl:p-6 xl:rounded-2xl xl:gap-x-0',
      className,
    )}
    {...containerProps}
  >
    {cells.map(({ label, value, tooltip, color }) => (
      <div
        className="flex flex-col justify-center rounded-2xl p-4 bg-cards xl: xl:bg-transparent xl:p-0 xl:rounded-none xl:pr-6 xl:pl-6 xl:first-of-type:pl-0 xl:last-of-type:pr-0 xl:border-r xl:last-of-type:border-r-0 xl:border-lightGrey"
        key={`cell-group-item-${label}`}
      >
        <div className="flex items-center mb-1">
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
