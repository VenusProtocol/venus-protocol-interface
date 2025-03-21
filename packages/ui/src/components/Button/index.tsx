import { Spinner } from '../../components/Spinner';
import { cn } from '../../utilities/cn';

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
        'border-blue bg-blue berachain:text-background active:border-darkBlue active:bg-darkBlue disabled:border-lightGrey disabled:bg-lightGrey hover:border-mediumBlue hover:bg-mediumBlue',
        active ? 'border-mediumBlue bg-mediumBlue' : 'hover:border-mediumBlue hover:bg-mediumBlue',
      );
  }
};

export type ButtonAltComponentType = React.FC | undefined;

export interface BaseProps<T extends ButtonAltComponentType> {
  loading?: boolean;
  contentClassName?: string;
  className?: string;
  component?: T;
  active?: boolean;
  variant?: ButtonVariant;
  children?: React.ReactNode;
  disabled?: boolean;
}

export type ButtonProps<T extends ButtonAltComponentType = undefined> = T extends React.FC
  ? BaseProps<T> & React.ComponentProps<T>
  : BaseProps<T> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = <T extends ButtonAltComponentType>({
  loading,
  variant = 'primary',
  disabled = false,
  active = false,
  children,
  contentClassName,
  component,
  className,
  ...otherProps
}: ButtonProps<T>) => {
  const Comp = component ?? 'button';

  return (
    <Comp
      disabled={loading || disabled}
      type={Comp === 'button' ? 'button' : undefined}
      className={cn(
        'relative overflow-hidden disabled:text-grey inline-flex h-12 cursor-pointer items-center justify-center rounded-lg border border-transparent px-6 py-2 font-semibold transition-all duration-[250ms] disabled:cursor-default',
        getVariantClasses({ variant, active }),
        className,
      )}
      {...otherProps}
    >
      {loading && (
        <div className="mr-2">
          <Spinner variant="small" />
        </div>
      )}

      <span
        className={cn(
          'inline-flex items-center text-inherit',
          variant !== 'primary' && variant !== 'secondary' && 'text-sm',
          contentClassName,
        )}
      >
        {children}
      </span>
    </Comp>
  );
};

export const PrimaryButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="secondary" {...props} />
);

export const TertiaryButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="tertiary" {...props} />
);

export const QuaternaryButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="quaternary" {...props} />
);

export const QuinaryButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="quinary" {...props} />
);

export const SenaryButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="senary" {...props} />
);

export const TextButton = <T extends ButtonAltComponentType>(props: ButtonProps<T>) => (
  <Button variant="text" {...props} />
);
