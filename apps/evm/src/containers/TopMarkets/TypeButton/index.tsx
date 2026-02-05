import { cn } from '@venusprotocol/ui';

export interface TypeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const TypeButton: React.FC<TypeButtonProps> = ({
  children,
  className,
  isActive = false,
  ...otherProps
}) => (
  <button
    type="button"
    className={cn('cursor-pointer', !isActive && 'text-dark-grey-hover', className)}
    {...otherProps}
  >
    {children}
  </button>
);
