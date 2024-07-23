import { cn } from 'utilities';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow: React.FC<TableRowProps> = ({ className, onClick, ...otherProps }) => (
  <tr
    className={cn('h-14 hover:bg-nightBlue w-full', !!onClick && 'cursor-pointer', className)}
    onClick={onClick}
    {...otherProps}
  />
);
