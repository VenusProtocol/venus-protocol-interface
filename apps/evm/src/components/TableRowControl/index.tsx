import { cn } from '@venusprotocol/ui';

import { Icon } from 'components/Icon';

export interface TableRowControlProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const TableRowControl: React.FC<TableRowControlProps> = ({ className, ...otherProps }) => (
  <button
    type="button"
    className={cn('p-2 -mr-2 cursor-pointer text-light-grey hover:text-white', className)}
    {...otherProps}
  >
    <Icon name="pendingOutline" className="text-inherit transition-colors" />
  </button>
);
