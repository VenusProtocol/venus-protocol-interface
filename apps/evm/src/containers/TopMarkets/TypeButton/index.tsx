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
    className={cn(
      'cursor-pointer text-p3s',
      isActive ? 'text-blue underline underline-offset-3 decoration-1' : 'text-light-grey-active',
      className,
    )}
    {...otherProps}
  >
    {children}
  </button>
);
