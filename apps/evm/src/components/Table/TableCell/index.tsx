import { Slot } from '@radix-ui/react-slot';

import { cn } from 'utilities';
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  asChild?: boolean;
  align?: 'left' | 'right';
}

export const TableCell: React.FC<TableCellProps> = ({
  className,
  align = 'left',
  asChild = false,
  ...otherProps
}) => {
  const Comp = asChild ? Slot : 'td';

  return (
    <Comp
      className={cn(
        'px-4 xl:first:pl-6 xl:last:pr-6 whitespace-nowrap',
        align === 'right' ? 'text-right' : 'text-left',
        className,
      )}
      {...otherProps}
    />
  );
};
