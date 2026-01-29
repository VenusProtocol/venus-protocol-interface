import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../utilities/cn';

import { Spinner } from '@venusprotocol/ui';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'quinary'
  | 'senary'
  | 'text';

const getVariantClasses = ({ variant, active }: { variant: ButtonVariant; active: boolean }) => {
  switch (variant) {
    case 'secondary':
      return cn(
        'bg-dark-blue-disabled text-light-grey',
        active
          ? 'border-blue bg-blue text-white'
          : 'hover:border-blue-hover hover:text-blue active:border-blue active:bg-blue active:text-white',
      );
    case 'tertiary':
      return cn(
        'border-dark-blue-active bg-dark-blue-active disabled:bg-lightGrey disabled:border-transparent',
        active
          ? 'bg-blue border-blue'
          : 'hover:text-blue hover:border-blue hover:bg-dark-blue-disabled active:bg-blue active:text-white',
      );
    case 'quaternary':
      return cn(
        'bg-dark-blue-active border-dark-blue-active',
        active
          ? 'bg-dark-blue-active border-blue'
          : 'hover:bg-dark-blue-hover hover:border-dark-blue-hover active:bg-dark-blue-active active:border-blue',
      );
    case 'quinary':
      return cn(
        'border-cards border-lightGrey bg-cards active:border-blue active:bg-blue disabled:border-background disabled:bg-background h-8 rounded-full px-5 py-1',
        active ? 'border-blue bg-blue' : 'hover:border-lightGrey hover:bg-lightGrey',
      );
    case 'senary':
      return cn(
        'border-lightGrey bg-cards hover:border-blue hover:border-blue hover:bg-lightGrey disabled:border-lightGrey disabled:bg-cards h-8 px-2 py-1',
        active && 'border-blue bg-lightGrey',
      );
    case 'text':
      return cn(
        'active:mediumBlue text-blue hover:text-mediumBlue bg-transparent p-0 disabled:bg-transparent disabled:border-transparent',
        active && 'text-mediumBlue',
      );
    // primary
    default:
      return cn(
        'border-blue bg-blue text-white',
        active
          ? 'bg-blue-active'
          : 'hover:bg-blue-hover hover:text-inherit active:bg-blue-active active:text-inherit active:border-blue-active',
      );
  }
};

export interface ButtonWrapperProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  asChild?: boolean;
  active?: boolean;
  size?: 'xs' | 'sm' | 'md';
  rounded?: boolean;
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  asChild,
  variant = 'primary',
  active = false,
  size = 'md',
  rounded = false,
  className,
  type = 'button',
  ...otherProps
}) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'text-sm inline-flex cursor-pointer items-center justify-center border border-transparent font-semibold transition-all duration-250 disabled:cursor-default disabled:bg-dark-grey-disabled disabled:border-dark-grey-hover disabled:text-light-grey',
        size === 'xs' && 'py-1 px-5',
        size === 'sm' && 'py-2 px-6',
        size === 'md' && 'py-3 px-12',
        rounded ? 'rounded-full' : 'rounded-lg',
        getVariantClasses({ variant, active }),
        className,
      )}
      type={type}
      {...otherProps}
    />
  );
};

export interface ButtonProps extends Omit<ButtonWrapperProps, 'asChild'> {
  loading?: boolean;
  contentClassName?: string;
}

export const Button = ({
  loading,
  disabled = false,
  variant = 'primary',
  children,
  contentClassName,
  className,
  ...otherProps
}: ButtonProps) => (
  <ButtonWrapper
    disabled={loading || disabled}
    type="button"
    variant={variant}
    className={cn(variant !== 'primary' && variant !== 'secondary' && 'text-sm', className)}
    {...otherProps}
  >
    {loading && (
      <div className="mr-2">
        <Spinner variant="small" />
      </div>
    )}

    <span className={cn('inline-flex items-center text-inherit', contentClassName)}>
      {children}
    </span>
  </ButtonWrapper>
);

export const PrimaryButton = (props: ButtonProps) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props: ButtonProps) => <Button variant="secondary" {...props} />;
export const TertiaryButton = (props: ButtonProps) => <Button variant="tertiary" {...props} />;
export const QuaternaryButton = (props: ButtonProps) => <Button variant="quaternary" {...props} />;
export const QuinaryButton = (props: ButtonProps) => <Button variant="quinary" {...props} />;
export const SenaryButton = (props: ButtonProps) => <Button variant="senary" {...props} />;
export const TextButton = (props: ButtonProps) => <Button variant="text" {...props} />;
