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
        'border-mediumBlue hover:border-blue hover:bg-blue active:border-mediumBlue active:bg-mediumBlue disabled:border-lightGrey disabled:bg-transparent',
        active && 'border-blue bg-blue',
      );
    case 'tertiary':
      return cn(
        'border-lightGrey bg-lightGrey active:border-grey active:bg-grey disabled:bg-lightGrey h-10 px-3 disabled:border-transparent',
        active ? 'border-grey bg-grey' : 'hover:border-blue',
      );
    case 'quaternary':
      return cn(
        'active:border:text-grey border-lightGrey bg-lightGrey active:text-grey h-8 rounded-full px-2 py-1 disabled:border-transparent',
        active ? 'border-grey bg-grey' : 'hover:border-blue hover:bg-lightGrey',
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
        'active:mediumBlue text-blue hover:text-mediumBlue bg-transparent p-0',
        active && 'text-mediumBlue',
      );
    // primary
    default:
      return cn(
        'bg-clip-padding border-blue-disabled/50 bg-blue active:bg-blue-active disabled:bg-dark-blue-disabled disabled:border-dark-blue-disabled',
        active ? 'bg-blue-active' : 'hover:bg-blue-hover',
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
  small?: boolean;
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  asChild,
  variant = 'primary',
  active = false,
  small = false,
  className,
  type = 'button',
  ...otherProps
}) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'disabled:text-light-grey inline-flex cursor-pointer items-center justify-center border border-transparent font-semibold transition-all duration-250 disabled:cursor-default',
        small ? 'h-8 px-5 py-1 text-sm rounded-md' : 'h-12 px-6 py-2 rounded-lg',
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
