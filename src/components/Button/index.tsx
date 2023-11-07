import { Slot } from '@radix-ui/react-slot';
import React from 'react';
import { cn } from 'utilities';

import { Spinner } from '../Spinner';

export type Variant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'quinary'
  | 'senary'
  | 'text';

const getVariantClasses = ({ variant, active }: { variant: Variant; active: boolean }) => {
  switch (variant) {
    case 'secondary':
      return cn(
        'border-mediumBlue hover:border-blue hover:bg-blue active:border-mediumBlue active:bg-mediumBlue disabled:border-lightGrey disabled:bg-transparent',
        active && 'border-blue bg-blue',
      );
    case 'tertiary':
      return cn(
        'h-10 border-lightGrey bg-lightGrey px-3 active:border-grey active:bg-grey disabled:border-transparent disabled:bg-lightGrey',
        active ? 'border-grey bg-grey' : 'hover:border-blue',
      );
    case 'quaternary':
      return cn(
        'active:border:text-grey h-8 rounded-full border-lightGrey bg-lightGrey px-6 py-1 active:text-grey disabled:border-transparent',
        active ? 'border-grey bg-grey' : 'hover:border-blue hover:bg-lightGrey',
      );
    case 'quinary':
      return cn(
        'h-8 rounded-full border-cards border-lightGrey bg-cards px-5 py-1 active:border-blue active:bg-blue disabled:border-background disabled:bg-background',
        active ? 'border-blue bg-blue' : 'hover:border-lightGrey hover:bg-lightGrey',
      );
    case 'senary':
      return cn(
        'h-8 border-lightGrey bg-cards px-2 py-1 hover:border-blue hover:border-blue hover:bg-lightGrey disabled:border-lightGrey disabled:bg-cards',
        active && 'border-blue bg-lightGrey',
      );
    case 'text':
      return cn(
        'active:mediumBlue bg-transparent p-0 font-normal text-blue hover:text-mediumBlue',
        active && 'text-mediumBlue',
      );
    // primary
    default:
      return cn(
        'border-blue bg-blue active:border-darkBlue active:bg-darkBlue disabled:border-lightGrey disabled:bg-lightGrey',
        active ? 'border-mediumBlue bg-mediumBlue' : 'hover:border-mediumBlue hover:bg-mediumBlue',
      );
  }
};

export interface ButtonWrapperProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
  variant?: Variant;
  children?: React.ReactNode;
}

export const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  asChild,
  variant = 'primary',
  active = false,
  className,
  type = 'button',
  ...otherProps
}) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'inline-flex h-12 cursor-pointer items-center justify-center rounded-lg border border-transparent px-6 py-2 font-semibold transition-all duration-[250ms] disabled:cursor-default disabled:text-grey',
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
}

export const Button = ({
  loading,
  disabled = false,
  variant = 'primary',
  children,
  ...otherProps
}: ButtonProps) => (
  <ButtonWrapper disabled={loading || disabled} type="button" variant={variant} {...otherProps}>
    {loading && (
      <div className="mr-2">
        <Spinner variant="small" />
      </div>
    )}

    <span
      className={cn(
        'inline-flex items-center text-inherit',
        variant !== 'primary' && variant !== 'secondary' && 'text-sm',
      )}
    >
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
