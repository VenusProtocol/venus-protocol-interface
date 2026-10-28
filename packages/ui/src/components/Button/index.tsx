import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../utilities/cn';
import { pointerLightClassNames } from '../../utilities/pointerLight';

import { Spinner } from '@venusprotocol/ui';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'quinary'
  | 'senary'
  | 'text'
  | 'select';

const NEUTRAL_MATERIAL_CLASSES =
  'bg-none bg-surface-raised border-transparent text-white shadow-raised backdrop-blur-raised backdrop-saturate-[1.3]';

const ACTION_MATERIAL_CLASSES =
  'bg-action hover:bg-action-hover text-white shadow-action backdrop-blur-raised backdrop-saturate-[1.3]';

const PRESSED_CLASSES =
  'active:scale-[0.965_0.94] active:shadow-action-pressed active:duration-100 motion-reduce:active:scale-100';

const DISABLED_CLASSES =
  'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:shadow-none';

const getVariantClasses = ({ variant, active }: { variant: ButtonVariant; active: boolean }) => {
  if (variant === 'text') {
    return cn(
      'active:mediumBlue text-blue hover:text-mediumBlue bg-transparent p-0 disabled:bg-transparent disabled:border-transparent',
      active && 'text-mediumBlue',
    );
  }

  const geometryClasses = cn(
    variant === 'quinary' && 'h-8 rounded-full px-5 py-1',
    variant === 'senary' && 'h-8 px-2 py-1',
    variant === 'select' && 'px-4',
  );

  if (active) {
    return cn(geometryClasses, ACTION_MATERIAL_CLASSES, 'border-white');
  }

  return cn(
    geometryClasses,
    variant === 'primary' ? ACTION_MATERIAL_CLASSES : NEUTRAL_MATERIAL_CLASSES,
    variant !== 'primary' && 'border-transparent',
  );
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
        'text-sm inline-flex cursor-pointer items-center justify-center border border-transparent font-semibold transition-[background,border-color,box-shadow,color,transform] duration-300 ease-out',
        variant !== 'text' &&
          cn(pointerLightClassNames, 'active:before:opacity-100', PRESSED_CLASSES),
        DISABLED_CLASSES,
        size === 'xs' && 'py-1 px-5',
        size === 'sm' && 'py-2 px-6',
        size === 'md' && 'py-3 px-12',
        rounded ? 'rounded-full' : 'rounded-lg',
        getVariantClasses({ variant, active }),
        className,
      )}
      data-pointer-light={variant === 'text' ? undefined : ''}
      data-venus-button-variant={variant}
      data-venus-button-active={active || undefined}
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
    aria-busy={loading || undefined}
    className={cn(variant !== 'primary' && variant !== 'secondary' && 'text-sm', className)}
    {...otherProps}
  >
    {loading && (
      <div className="mr-2" role="status" aria-label="Loading">
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
export const SelectButton = (props: ButtonProps) => <Button variant="select" {...props} />;
