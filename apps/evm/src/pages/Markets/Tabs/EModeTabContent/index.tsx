import { cn } from '@venusprotocol/ui';

import { EModeGroupList, type EModeGroupListProps } from 'containers/EModeGroupList';

export interface EModeTabContentProps extends EModeGroupListProps {}

export const EModeTabContent: React.FC<EModeTabContentProps> = ({ className, ...otherProps }) => (
  <EModeGroupList
    className={cn('sm:p-6 sm:rounded-lg sm:border sm:border-dark-blue-hover', className)}
    {...otherProps}
  />
);
